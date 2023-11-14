
from flask import Flask,jsonify,request,render_template, redirect, url_for, session
from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy
import re
import uuid
from dotenv import load_dotenv
from controllers.controller import Controller
import logging
from models import Account, Visitor, Organizer, Event, Review, Payment, Subscription, NotificationOption, EventMedia, Interest, Country
from flask_jwt_extended import create_access_token,get_jwt,get_jwt_identity, \
                               unset_jwt_cookies, jwt_required, JWTManager


class AuthController(Controller):
    def __init__(self, app, db, bcrypt, jwt):
        super().__init__(app, db)
        self.bcrypt = bcrypt
        self.jwt = jwt
        self.app.add_url_rule("/register", view_func=self.register, methods=["POST"])
        self.app.add_url_rule("/login", view_func=self.login, methods=["POST"]) 
        self.app.add_url_rule("/logout", view_func=self.logout, methods=["POST"]) 
        
        self.email_regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b'
        self.password_regex = "^(?=.*?[a-z])(?=.*?[0-9]).{8,}$"
        self.REGISTER_REQUIRED_FIELDS = ["email", "username", "password", "roleId", "countryCode"]
        self.LOGIN_REQUIRED_FIELDS = ["email", "username", "password", "roleId", "profileImage", "countryCode"]
        self.username_range = (6,20)
        
    def register(self):
        data = request.get_json()
        result = self.testRegForm(data)
        
        if result == "OK":
            roleId = data["roleId"]
            passwordHash = self.bcrypt.generate_password_hash(data["password"]).decode("utf-8")
            f = data

            newAcc = Account(f["roleId"],f["username"], passwordHash, f["email"], f["countryCode"])
            self.db.session.add(newAcc)
            self.db.session.commit()
            
            if roleId == "0":
                newVisitor = Visitor(f["firstName"], f["lastName"], newAcc.accountId)
                self.db.session.add(newVisitor)
                
            elif roleId == "1":
                newOrganizer = Organizer(f["organizerName"], newAcc.accountId)
                self.db.session.add(newOrganizer)
            self.db.session.commit()
            return {"success": True, "data": "Registration successful."}
        
        return result


    def login(self):
        data = request.get_json()
        result = self.testLoginForm(data)
        
        if result == "OK":
            myUser = self.db.session.query(Account).filter_by(username=data["username"]).first()
            userHashedPassword = myUser.passwordHash
            isCorrect = self.bcrypt.check_password_hash(userHashedPassword, data["password"])
            if (isCorrect):
                
                access_token = create_access_token(identity=myUser.username, additional_claims={"roleId":myUser.roleId})       
                user = {
                    "username": myUser.username,
                    "email": myUser.eMail,
                    "roleId": myUser.roleId,
                    "countryCode": myUser.countryCode
                }
                
                resp = {"success": True, "data": {"user":user, "access_token":access_token}}
                #resp.set_cookie("username", myUser.username)
                return resp
            else:
                return {"success": False, "data": "Wrong credentials."}
        else:
            return result
            
    def logout(self):
        response = {"success": True, "data": "Logout successful."}
        
        try:
            unset_jwt_cookies(response)
            session.pop("sID")
        except:
            pass
        return response

    
    def testRegForm(self, form):
        for k in self.REGISTER_REQUIRED_FIELDS:
            if k not in form.keys():
                return {"success": False, "data": f"{k} argument is missing!"}
            
        if form["roleId"] not in [0, 1]:
            return {"success":False, "data": "Illegal role id."}
        
        if not re.match(self.email_regex, form["email"]):
            return {"success": False, "data": "Mail is of wrong format."}
        
        if not re.match(self.password_regex, form["password"]):
            return {"success": False, "data": "Password is bad."}
        
        if len(form["username"]) < self.username_range[0] or len(form["username"]) > self.username_range[1]:
            return {"success": False, "data": "Username is too short or too long."}
        
        if form["roleId"] == 0:
            if "firstName" not in form.keys() or "lastName" not in form.keys():
                return {"success": False, "data": "Role is visitor but name or surname is missing."}
            
        if form["roleId"] == 1:
            if "organizerName" not in form.keys():
                return {"success": False, "data": "Role is organizer but organizer name is missing."}
            
        if form["countryCode"] not in list(map(lambda x: x[0], self.db.session.query(Country.countryCode).all())):
            return {"success": False, "data": "Invalid country code."}
        
        if form["username"] in list(map(lambda x: x[0] , self.db.session.query(Account.username).all())):
            return {"success": False, "data": "Username already in use."}
        
        return "OK"
        
    def testLoginForm(self,form):
        if "username" not in form.keys() or "password" not in form.keys():
            {"success": False, "data": "Missing a field in login package."}
        if form["username"] not in list(map(lambda x: x[0] , self.db.session.query(Account.username).all())):
            {"success": False, "data": "Wrong credentials."}
        return "OK"

