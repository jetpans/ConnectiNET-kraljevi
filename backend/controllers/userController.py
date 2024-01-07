
from flask import Flask,jsonify,request,render_template, redirect, url_for, session
from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy
import re
import uuid
from dotenv import load_dotenv
from controllers.controller import Controller
import logging
from models import Account, Visitor, Organizer, Event, Review, Payment, Subscription, Data, EventMedia, Interest, Country
from flask_jwt_extended import create_access_token,get_jwt,get_jwt_identity, \
                               unset_jwt_cookies, jwt_required, JWTManager
from util import *
import os


class UserController(Controller):
    def __init__(self, app, db, bcrypt, jwt):
        super().__init__(app, db, jwt)
        self.bcrypt = bcrypt

        self.app.add_url_rule("/api/changeInformation", view_func=self.changeInformation, methods=["POST"])
        self.app.add_url_rule("/api/getInformation", view_func=self.getMoreInfo, methods=["GET"])
        self.app.add_url_rule("/api/getSubscriptionPrice", view_func=self.getSubscriptionPrice, methods=["GET"])


        self.email_regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b'
        self.password_regex = "^(?=.*?[a-z])(?=.*?[0-9]).{8,}$"
        
    @visitor_required()
    def changeInformation(self):
        data = request.get_json()
        print(f"recieved {data}")
        result = self.testChangeForm(data)
        print(f"result {result}")

        myUser = self.db.session.query(Account).filter(Account.username == get_jwt_identity()).first()
        myOrganiser = self.db.session.query(Organizer).filter(Organizer.accountId == myUser.accountId).first()
        myVisitor = self.db.session.query(Visitor).filter(Visitor.accountId == myUser.accountId).first()
        if result == "OK":
            temp_image_path = os.path.join(self.app.config['IMAGE_DIRECTORY'] , "temp_"+get_jwt_identity()+".png")
            profile_image_path = os.path.join(self.app.config['IMAGE_DIRECTORY'] , get_jwt_identity()+".png")
            if os.path.isfile(temp_image_path):
                myUser.profileImage = get_jwt_identity()+".png"
                if os.path.exists(profile_image_path):
                    os.remove(profile_image_path)
                os.rename(temp_image_path, profile_image_path)
            
            roleId = get_jwt()["roleId"]
            if data["password"] != None and len(data["password"])>0:
                passwordHash = self.bcrypt.generate_password_hash(data["password"]).decode("utf-8")
                myUser.passwordHash = passwordHash
            f = data
            
            myUser.eMail =  f["email"]
            myUser.countryCode = f["countryCode"]
            
            if roleId == 0:
                myVisitor.firstName = f["firstName"]
                myVisitor.lastName = f["lastName"]
            elif roleId == 1:
                myOrganiser.organizerName = f["organizerName"]
                myOrganiser.hidden = f["hidden"] == "true"
            self.db.session.commit()
            return {"success": True, "data": "Changed data successfuly"}
        
        return {"success": False, "message": "Something is wrong with form."}
    
    @visitor_required()
    def getMoreInfo(self):
        claims = get_jwt()
        r  = {}
        if claims["roleId"] == 0:
            r = self.db.session.query(Account,Visitor.firstName, Visitor.lastName).join(Visitor, Account.accountId == Visitor.accountId).filter(Account.username == get_jwt_identity()).first()
            dict = r[0].__dict__
            dict["firstName"] = r[1]
            dict["lastName"] = r[2]
        elif claims["roleId"] == 1:
            r = self.db.session.query(Account, Organizer.organizerName, Organizer.hidden).join(Organizer, Account.accountId == Organizer.accountId).filter(Account.username == get_jwt_identity()).first()
            dict = r[0].__dict__
            dict["organiserName"] = r[1]
            dict["hidden"] = str(r[2])

        else:
            return {"success": True, "data": "Invalid role"}
        print(r)
        del dict['_sa_instance_state']
        del dict['passwordHash']
        del dict['accountId']
        return {"success": True, "data": dict}


    
    def testChangeForm(self, form):
            
        if "roleId" in form.keys() and form["roleId"] not in [0, 1]:
            return {"success":False, "data": "Illegal role id."}
        
        if "email" in form.keys() and not re.match(self.email_regex, form["email"]):
            return {"success": False, "data": "Mail is of wrong format."}
        
        if (form["password"] != None and len(form["password"]) > 0 )and not re.match(self.password_regex, form["password"]):
            return {"success": False, "data": "Password is bad."}
        
        form["roleId"] = get_jwt()["roleId"]
        
        if form["roleId"] == 0:
            if "firstName" not in form.keys() or "lastName" not in form.keys():
                return {"success": False, "data": "Role is visitor but name or surname is missing."}
            
        if form["roleId"] == 1:
            if "organizerName" not in form.keys():
                return {"success": False, "data": "Role is organizer but organizer name is missing."}
            
        if form["countryCode"] not in list(map(lambda x: x[0], self.db.session.query(Country.countryCode).all())):
            return {"success": False, "data": "Invalid country code."}

        
        return "OK"
        
    def testLoginForm(self,form):
        if "username" not in form.keys() or "password" not in form.keys():
            {"success": False, "data": "Missing a field in login package."}
        if form["username"] not in list(map(lambda x: x[0] , self.db.session.query(Account.username).all())):
            {"success": False, "data": "Wrong credentials."}
        return "OK"
    
    def countries(self):
        
        dbResp = self.db.session.query(Country).all() 
        result_dict = [u.__dict__ for u in dbResp]
        toList = list(map( lambda country:
            {
                "countryCode":country["countryCode"],
                "name":country["name"],
            }, result_dict))
        return {"success":True, "data": toList}

    @visitor_required()
    def getSubscriptionPrice(self):
        price = int(self.db.session.query(Data).filter(Data.entryName=="subscriptionPrice").first().value)
        
        return {"success":True, "data":{"value": price}}