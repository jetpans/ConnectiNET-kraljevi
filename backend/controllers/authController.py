from flask import Flask,jsonify,request,render_template
from models import Account, Visitor, Organiser, Administrator, Event, Review, Payment, Subscription, NotificationOption, EventMedia, Interest
from dotenv import load_dotenv
from flask_sqlalchemy import SQLAlchemy
from controllers.controller import Controller

class AuthController(Controller):
    def __init__(self, app, db):
        super().__init__(app, db)
        
        self.app.add_url_rule("/register", view_func=self.register)
        self.app.add_url_rule("/login", view_func=self.login) 
        
    def register(self):
        pass

    def login(self):
        pass
