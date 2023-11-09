from flask import Flask,jsonify,request,render_template, redirect, url_for, session
from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy
import re
import uuid
from dotenv import load_dotenv
from controllers.controller import Controller
from models import Account, Visitor, Organizer, Administrator, Event, Review, Payment, Subscription, NotificationOption, EventMedia, Interest, Country

class AuthController(Controller):
    def __init__(self, app, db, bcrypt, auth_users):
        super().__init__(app, db)
        self.bcrypt = bcrypt
        self.auth_users = auth_users
        
        self.app.add_url_rule("/register", view_func=self.register, methods=["POST"])
        self.app.add_url_rule("/login", view_func=self.login, methods=["POST"]) 
        self.app.add_url_rule("/logout", view_func=self.logout, methods=["POST"]) 
        
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
            return redirect("/login")
        return result


    def login(self):
        result = self.testLoginForm(request.form)
        if result == "OK":
            myUser = self.db.session.query(Account).filter_by(username=request.form["username"]).first()
            userHashedPassword = myUser.passwordHash
            isCorrect = self.bcrypt.check_password_hash(userHashedPassword, request.form["password"])
            if (isCorrect):
                session['sID'] = uuid.uuid4()
                
                self.auth_users[session['sID']] = myUser
                resp = redirect("/")
                resp.set_cookie("username", myUser.username)
                return resp
            else:
                return redirect("/login")
        else:
            return redirect("/login")
            
    def logout():
        response = jsonify({"msg":"Logout successful."})
        try:
            session.pop("sID")
        except:
            pass
        return response

    
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
        
    def testLoginForm(self,form):
        if "username" not in form.keys() or "password" not in form.keys():
            return "Missing a field in login package."
        if form["username"] not in list(map(lambda x: x[0] , self.db.session.query(Account.username).all())):
            return "Wrong credentials"
        return "OK"

