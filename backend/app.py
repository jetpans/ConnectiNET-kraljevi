from flask import Flask,jsonify,request,render_template
from models import Account, Visitor, Organiser, Administrator, Event, Review, Payment, Subscription, NotificationOption, EventMedia, Interest
from controllers.authController import Controller, AuthController
from dotenv import load_dotenv
from flask_sqlalchemy import SQLAlchemy
import os


load_dotenv()
DB_CONNECT_URL = os.getenv('DB_CONNECT_URL')

##RUN WITH $ flask --app main run --debug

app = Flask(__name__, static_folder="../frontend/build/static", template_folder="../frontend/build")
app.config["SECRET_KEY"] = "secret"
app.config['SQLALCHEMY_DATABASE_URI'] = DB_CONNECT_URL

db = SQLAlchemy(app)


authController = AuthController(app, db)

if __name__ == "__main__":
    app.run(debug=True, port=5000)
    