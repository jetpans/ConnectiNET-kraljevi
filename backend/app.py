from flask import Flask,jsonify,request,render_template,redirect,session
from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
from datetime import datetime, timedelta, timezone
import os
import json
from controllers.authController import AuthController
from controllers.eventController import EventController
from controllers.imageController import ImageController
from controllers.userController import UserController
from controllers.adminController import AdminController
from models import Account, Visitor, Organizer,Event, Review, Payment, Subscription, Data, EventMedia, Interest
from config import DevelopmentConfig, ProductionConfig
from flask_jwt_extended import create_access_token,get_jwt,get_jwt_identity, \
                               unset_jwt_cookies, jwt_required, JWTManager
from flask_mail import Mail
from mailjet_rest import Client

import firebase_admin
from firebase_admin import credentials, storage




app = Flask(__name__)

env = os.environ.get('FLASK_ENV')
app.config["JWT_SECRET_KEY"] = "please-remember-to-change-me"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
app.config["IMAGE_DIRECTORY"] = "images"

app.config["MAIL_API_KEY"] = os.environ.get('MAIL_API_KEY')
app.config["MAIL_SECRET"] = os.environ.get("MAIL_SECRET")
 
app.config['MAX_CONTENT_LENGTH'] = 7 * 1024 * 1024 # X * 1024 *1024 === X Megabytes

cred = credentials.Certificate("./firebase_key.json")
print(cred.project_id)
firebase_app = firebase_admin.initialize_app(cred, {
    'storageBucket': 'imgstoremarko.appspot.com'
})
bucket = storage.bucket()



if env == 'production':
    app.config.from_object(ProductionConfig)
else:
    app.config.from_object(DevelopmentConfig)

bcrypt = Bcrypt(app)
db = SQLAlchemy(app)
jwt = JWTManager(app)
mail = Client(auth=(os.environ.get('MAIL_API_KEY'), os.environ.get("MAIL_SECRET")), version='v3.1')


@app.before_request
def do():
    print(request.headers)

@app.route("/")
def home():
    return {"success": True, "data": "API is running"}
    #return render_template("index.html")


@app.route("/<path:path>", methods=["GET"])
def catch_all(path):
    return {"success": True, "data": "API is running"}
    #return render_template("index.html")

@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Headers'] = 'Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization'
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, OPTIONS'
    response.headers["Access-Control-Allow-Credentials"] = "true"
    return response

@app.after_request
def refresh_expiring_jwts(response):
    try:
        exp_timestamp = get_jwt()["exp"]
        now = datetime.now(timezone.utc)
        target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
        if target_timestamp > exp_timestamp:
            #access_token = create_access_token(identity=myUser.username, additional_claims={"roleId":myUser.roleId}, expires_delta=timedelta(hours=1))       

            access_token = create_access_token(identity=get_jwt_identity(), additional_claims={"roleId":get_jwt()["roleId"]},expires_delta=timedelta(hours=1))
            data = response.get_json()
            if type(data) is dict:
                data["access_token"] = access_token 
                response.data = json.dumps(data)
        return response
    except (RuntimeError, KeyError):
        # Case where there is not a valid JWT. Just return the original respone
        return response





authController = AuthController(app, db, bcrypt, jwt, mail)
eventController = EventController(app, db, jwt)
imageController = ImageController(app,db,jwt,bucket)
userController = UserController(app,db,bcrypt,jwt)
adminController = AdminController(app,db,jwt)
