from models import Account, Visitor, Organizer, Event, Review, Payment, Subscription, NotificationOption, EventMedia, Interest
from flask import Flask,jsonify,request,render_template, session, send_file
from dotenv import load_dotenv
from controllers.controller import Controller
import random
from util import *
from flask_jwt_extended import create_access_token,get_jwt,get_jwt_identity, \
                               unset_jwt_cookies, jwt_required, JWTManager
import os

from datetime import datetime

class UserController(Controller):
    def __init__(self, app, db,jwt):
        super().__init__(app, db, jwt)

        
        self.app.add_url_rule("/api/getSubscriberInfo", view_func=self.getSubscriberInfo, methods=["GET"])
        
    
    
    @organiser_required()
    def getSubscriberInfo(self):
        data = self.db.session.query(Subscription.startDate, Subscription.expireDate).join(Account, Account.accountId == Subscription.accountId).filter(Account.username == get_jwt_identity()).order_by(Subscription.startDate).first()
        print(data)
        start_date, expire_date = data

        today = datetime.now().date()
        if data:
            # Structure the retrieved dates into a dictionary
            dates_dict = {
                "startDate": str(data[0]),  # Assuming data[0] contains startDate
                "expireDate": str(data[1]),  # Assuming data[1] contains expireDate
                "isSubscribed" : str(expire_date != None or start_date<=today<=expire_date)
            }
            
            return jsonify({"success": True, "data": dates_dict})
        else:
            # If no data is found, return a message indicating that
            return {"success":False, "data": "No such user"}
