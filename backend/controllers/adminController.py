
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
from util import *
import os


class AdminController(Controller):
    def __init__(self, app, db, jwt):
        super().__init__(app, db, jwt)


        self.app.add_url_rule("/api/getAllUsers", view_func=self.getAllUsers, methods=["GET"])

        
    @visitor_required()
    def getAllUsers(self):
        try:
            users = self.db.session.query(Account, Visitor, Organizer, Country).join(Visitor, Visitor.accountId == Account.accountId, isouter=True).join(Organizer, Organizer.accountId == Account.accountId, isouter=True).join(Country, Country.countryCode == Account.countryCode).all()
            users_to_dicts = list(map(lambda user: self.tripletToDict(user), users ))
            print(users_to_dicts)
            return {"success": True, "data":users_to_dicts}
        except Exception as e:
            print(e)
            pass
        
        return {"success": False, "message": "There was an error"}
    
    
    
    def tripletToDict(self, triplet):
        acc, visit, org, country = triplet
        result : dict = {}
        result = acc.__dict__
        result.update(visit.__dict__) if visit != None else 1
        result.update(org.__dict__) if org != None else 1
        result["countryName"] = country.name
        del result['_sa_instance_state']
        return result
        

