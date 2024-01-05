from models import Account, Visitor, Organizer, Event, Review, Payment, Subscription, NotificationOption, EventMedia, Interest
from flask import Flask,jsonify,request,render_template, session, send_file
from dotenv import load_dotenv
from controllers.controller import Controller
import random
from util import *
from flask_jwt_extended import create_access_token,get_jwt,get_jwt_identity, \
                               unset_jwt_cookies, jwt_required, JWTManager
import os

from datetime import datetime, date
from dateutil.relativedelta import relativedelta


class UserController(Controller):
    def __init__(self, app, db,jwt):
        super().__init__(app, db, jwt)

        
        self.app.add_url_rule("/api/getSubscriberInfo", view_func=self.getSubscriberInfo, methods=["GET"])
        self.app.add_url_rule("/api/subscribe", view_func=self.subscribe, methods=["POST"])
        self.app.add_url_rule("/api/unsubscribe", view_func=self.unsubscribe, methods=["POST"])
        self.app.add_url_rule("/api/extendSubscribe", view_func=self.extendSubscribe, methods=["POST"])


        self.COST_OF_MONTH = 10
    
    
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
      
    @jwt_required()  
    # @organiser_required()
    def subscribe(self):
        formData = request.get_json()
        data = self.db.session.query(Subscription.startDate, Subscription.expireDate).join(Account, Account.accountId == Subscription.accountId).filter(Account.username == get_jwt_identity()).order_by(Subscription.startDate).first()
        
        myUser = self.db.session.query(Account).filter_by(username=get_jwt_identity()).first()
        
        
        if data:
            start_date, expire_date = data
            today = datetime.now().date()
            if expire_date != None or start_date<=today<=expire_date:
                return jsonify({"success": False, "message": "Can't subscribe. User already has an active subscription."})
        
        if not self.askBankIfPaymentIsLegal(formData):
            print("BANK REJETCTED")
            return jsonify({"success": False, "message": "Bank rejected the payment."})
                
        if formData["method"] == "card":
            newPayment = Payment(date.today(),self.COST_OF_MONTH,"card", myUser.accountId)
            newSubscription = Subscription(date.today(),datetime.today()+ relativedelta(months=1),myUser.accountId )
            self.db.session.add(newPayment)
            self.db.session.add(newSubscription)
            self.db.session.commit()
            #Dodati payment
            #Dodati subscription
            return jsonify({"success": True, "message": "Success."})
        elif formData["method"] == "paypal":
            newPayment = Payment(date.today(),self.COST_OF_MONTH,"paypal", myUser.accountId)
            newSubscription = Subscription(date.today(),datetime.today()+ relativedelta(months=1),myUser.accountId )
            
            self.db.session.add(newPayment)
            self.db.session.add(newSubscription)
            self.db.session.commit()
            
            return jsonify({"success": True, "message": "Success."})
        else:
            return jsonify({"success": False, "message": "Something is wrong with the request."})
    
    @organiser_required()
    def unsubscribe(self):
        data = self.db.session.query(Subscription).join(Account, Account.accountId == Subscription.accountId).filter(Account.username == get_jwt_identity()).order_by(Subscription.startDate).first()
        if data==None: 
            return jsonify({"success": False, "message": "Can't unsubscribe. User doesn't already have an active subscription."})
        else:
            expire_date = data.expireDate
            today = datetime.now().date()
            if today >= expire_date:
                return jsonify({"success": False, "message": "Can't unsubscribe. User doesn't already have an active subscription."})
        mySubscriptionId = data.subscriptionId
        self.db.session.query(Subscription).filter(Subscription.subscriptionId == mySubscriptionId).delete()
        self.db.session.commit()
        
        return jsonify({"success": True, "message": "Successfuly unsubscribed."})      
    
    @organiser_required()
    def extendSubscribe(self):
        formData = request.get_json()
        data = self.db.session.query(Subscription).join(Account, Account.accountId == Subscription.accountId).filter(Account.username == get_jwt_identity()).order_by(Subscription.startDate).first()
        myUser = self.db.session.query(Account).filter_by(username=get_jwt_identity()).first()
        
        
        if data==None: 
            return jsonify({"success": False, "message": "Can't extend. User doesn't already have an active subscription."})
        else:
            expire_date = data.expireDate
            today = datetime.now().date()
            if today >= expire_date:
                return jsonify({"success": False, "message": "Can't extend. User doesn't already have an active subscription."})
        
        
        if not self.askBankIfPaymentIsLegal(formData):
            print("BANK REJETCTED")
            return jsonify({"success": False, "message": "Bank rejected the payment."})
                
        expire_date = data.expireDate
        today = datetime.now().date()
        
        
        if formData["method"] == "card":
            newPayment = Payment(date.today(),self.COST_OF_MONTH,"card", myUser.accountId)
            data.expireDate += relativedelta(months=1)
            self.db.session.add(newPayment)
            self.db.session.commit()
            #Dodati payment
            #Dodati subscription
            return jsonify({"success": True, "message": "Success."})
        elif formData["method"] == "paypal":
            newPayment = Payment(date.today(),self.COST_OF_MONTH,"paypal", myUser.accountId)
            
            self.db.session.add(newPayment)
            data.expireDate += relativedelta(months=1)
            self.db.session.commit()
            
            return jsonify({"success": True, "message": "Success."})
        else:
            return jsonify({"success": False, "message": "Something is wrong with the request."})
    def askBankIfPaymentIsLegal(self, data):
        print(f"Bank recieved data for payment: {data}")
        return random.random() < 0.3