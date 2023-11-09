from flask import Flask,jsonify,request,render_template
from flask_bcrypt import Bcrypt
from controllers.authController import AuthController
from controllers.eventController import EventController
from models import Account, Visitor, Organizer, Administrator, Event, Review, Payment, Subscription, NotificationOption, EventMedia, Interest
from dotenv import load_dotenv
from flask_sqlalchemy import SQLAlchemy
import os

load_dotenv()
DB_CONNECT_URL = os.getenv('DB_CONNECT_URL')


app = Flask(__name__, static_folder="../frontend/build/static", template_folder="../frontend/build")
app.config["SECRET_KEY"] = "secret"
app.config['SQLALCHEMY_DATABASE_URI'] = DB_CONNECT_URL

bcrypt = Bcrypt(app)
db = SQLAlchemy(app)


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

# Example if it is necessary to instantiate classes upon request, not as singletons upon startup
#@app.route("/register")
#def register():
#    return AuthController(app, db).register()
#
#@app.route("/getThing")
#def getThing():
#    return EventController(app, db).getThing()


authController = AuthController(app, db, bcrypt)
eventController = EventController(app, db)


if __name__ == "__main__":
    app.run(debug=True, port=5000)
    