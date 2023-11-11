from flask import Flask,jsonify,request,render_template,redirect,session
from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
from datetime import datetime, timedelta, timezone
import os
import json
from controllers.authController import AuthController
from controllers.eventController import EventController
from models import Account, Visitor, Organizer,Event, Review, Payment, Subscription, NotificationOption, EventMedia, Interest


load_dotenv()
DB_CONNECT_URL = os.getenv('DB_CONNECT_URL')


app = Flask(__name__, static_folder="../frontend/build/static", template_folder="../frontend/build")
app.config["SECRET_KEY"] = "secret"
app.config["JWT_SECRET_KEY"] = "secret"
app.config['SQLALCHEMY_DATABASE_URI'] = DB_CONNECT_URL
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(minutes=1)

bcrypt = Bcrypt(app)
db = SQLAlchemy(app)
auth_users = {}

@app.before_request
def do():
    print(request.headers)

@app.route("/")
def home():
    return render_template("index.html")


@app.route("/<path:path>", methods=["GET"])
def catch_all(path):
    return render_template("index.html")

@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    return response






authController = AuthController(app, db, bcrypt, auth_users)
eventController = EventController(app, db, auth_users)


if __name__ == "__main__":
    app.run(debug=True, port=5000)
    