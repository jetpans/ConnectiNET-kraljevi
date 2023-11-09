from flask import Flask,jsonify,request,render_template, redirect
from models import Account, Visitor, Organizer, Administrator, Event, Review, Payment, Subscription, NotificationOption, EventMedia, Interest, Country
import re
from flask_bcrypt import Bcrypt
from dotenv import load_dotenv
from flask_sqlalchemy import SQLAlchemy
from controllers.controller import Controller

class AuthController(Controller):
    def __init__(self, app, db, bcrypt):
        super().__init__(app, db)
        self.bcrypt = bcrypt
        self.app.add_url_rule("/register", view_func=self.register, methods=["POST"])
        self.app.add_url_rule("/login", view_func=self.login, methods=["POST"]) 
        
        
        self.email_regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b'
        self.password_regex = "^(?=.*?[a-z])(?=.*?[0-9]).{8,}$"
        self.LOGIN_REQUIRED_FIELDS = ["email", "username", "password", "roleId", "profileImage", "countryCode"]
        self.username_range = (6,20)
        
    def register(self):
        result = self.testRegForm(request.form)
        
        if result == "OK":
            roleId = request.form["roleId"]
            passwordHash = self.bcrypt.generate_password_hash(request.form["password"]).decode("utf-8")
            f = request.form
            
            newAcc = Account(f["roleId"],f["username"], passwordHash, f["email"], f["countryCode"], f["profileImage"])
            self.db.session.add(newAcc)
            self.db.session.commit()
            
            if roleId == "0":
                newVisitor = Visitor(f["firstName"], f["lastName"], newAcc.accountId)
                self.db.session.add(newVisitor)
                
            elif roleId == "1":
                newOrganizer = Organizer(f["organizerName"], newAcc.accountId)
                self.db.session.add(newOrganizer)
            self.db.session.commit()
        return result


    def login(self):
        pass
    
    
    def testRegForm(self, form):
        
        for k in self.LOGIN_REQUIRED_FIELDS:
            if k not in form.keys():
                return f"{k} argument is missing!"
            
        if form["roleId"] not in ["0", "1"]:
            return "Illegal role id."
        
        if not re.match(self.email_regex, form["email"]):
            return "Mail is of wrong format."
        
        if not re.match(self.password_regex, form["password"]):
            return "Password is bad."
        
        if len(form["username"]) < self.username_range[0] or len(form["username"]) > self.username_range[1]:
            return "Username is too short or too long."
        
        if form["roleId"] == 0:
            if "firstName" not in form.keys() or "lastName" not in form.keys():
                return "Role is visitor but name or surname is missing."
            
        if form["roleId"] == 1:
            if "organizerName" not in form.keys():
                return "Role is organizer but organizer name is missing."
            
        if form["countryCode"] not in list(map(lambda x: x[0], self.db.session.query(Country.countryCode).all())):
            return "Invalid country code."
        
        if form["username"] in list(map(lambda x: x[0] , self.db.session.query(Account.username).all())):
            return "Username already in use."
        
        return "OK"
        
