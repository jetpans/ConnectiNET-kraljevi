from flask import Flask,jsonify,request,render_template
from models import Account, Visitor, Organiser, Administrator, Event, Review, Payment, Subscription, NotificationOption, EventMedia, Interest
from controllers.authController import AuthController
from controllers.eventController import EventController
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


@app.route("/")
def home():
    return render_template("index.html")

@app.route("/<path:path>")
def catch_all(path):
    return render_template("index.html")

@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    print('Here')
    return response


authController = AuthController(app, db)
eventController = EventController(app, db)

if __name__ == "__main__":
    app.run(debug=True, port=5000)
    