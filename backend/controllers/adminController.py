
from datetime import datetime
from flask import Flask,jsonify,request,render_template, redirect, url_for, session
from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy
import re
import uuid
from dotenv import load_dotenv
from controllers.controller import Controller
import logging
from models import Account, Visitor, Organizer, Event, Review, Payment, Subscription, EventType,Data, NotificationEventType, NotificationCountry,EventMedia, Interest, Country
from flask_jwt_extended import create_access_token,get_jwt,get_jwt_identity, \
                               unset_jwt_cookies, jwt_required, JWTManager
from util import *
import os
from datetime import datetime, date
from dateutil.relativedelta import relativedelta

class AdminController(Controller):
    def __init__(self, app, db, jwt):
        super().__init__(app, db, jwt)

        self.app.add_url_rule("/api/getAllUsers", view_func=self.getAllUsers, methods=["GET"])
        self.app.add_url_rule("/api/getAllEventsForOrganizer/<accountId>", view_func=self.getAllEvents, methods=["GET"])
        self.app.add_url_rule("/api/getAllReviewsForAccount/<accountId>", view_func=self.getAllReviews, methods=["GET"])
        self.app.add_url_rule("/api/admin/makeAdmin/<accountId>", view_func=self.makeAdmin, methods=["POST"])
        self.app.add_url_rule("/api/admin/deleteAccount/<accountId>", view_func=self.deleteAccount, methods=["POST"])
        self.app.add_url_rule("/api/admin/cancelSubscription/<accountId>", view_func=self.cancelSubscription, methods=["POST"])
        self.app.add_url_rule("/api/admin/deleteEvent/<eventId>", view_func=self.deleteEvent, methods=["POST"])
        self.app.add_url_rule("/api/admin/deleteReview/<reviewId>", view_func=self.deleteReview, methods=["POST"])

        self.app.add_url_rule("/api/setSubscriptionPrice", view_func=self.setSubscriptionPrice, methods=["POST"])
        
    @admin_required()
    def getAllUsers(self):
        try:
            users = self.db.session.query(Account, Visitor, Organizer, Country).join(Visitor, Visitor.accountId == Account.accountId, isouter=True).join(Organizer, Organizer.accountId == Account.accountId, isouter=True).join(Country, Country.countryCode == Account.countryCode).all()
            users_to_dicts = list(map(lambda user: self.tripletToDict(user), users ))
            return {"success": True, "data":users_to_dicts}
        except Exception as e:
            print(e)
            pass
        
        return {"success": False, "message": "There was an error"}
    
    @admin_required()
    def getAllEvents(self, accountId):
        try:
            events = self.db.session.query(Event, EventType, Organizer,Country).filter(Event.accountId == accountId).\
                join(EventType, EventType.typeId == Event.eventType).join(Organizer, Organizer.accountId == Event.accountId)\
                    .join(Country, Event.countryCode == Country.countryCode).all() 
            result = list(map(lambda event: self.eventTypeOrgCountryToDict(event), events))
            return {"success": True, "data":result}
        except Exception as e:
            print(e)
            pass
        
        return {"success": False, "message": "There was an error"}
    
   
    
    @admin_required()
    def getAllReviews(self, accountId):
        try:
            reviews = self.db.session.query(Review,Account,Event).filter(Review.accountId == accountId)\
                .join(Event, Event.eventId == Review.eventId).join(Account, Account.accountId == Review.accountId).all() 
            result = list(map(lambda review: self.revAccountEventToDict(review), reviews))
            for e in result:
                del e['_sa_instance_state']
            return {"success": True, "data":result}
        except Exception as e:
            print(e)
            pass
        
        return {"success": False, "message": "There was an error"}
    
   
    @admin_required()
    def setSubscriptionPrice(self):
        data = request.get_json()
        newPrice = data["newPrice"]
        if (int(newPrice) > 0):
            myEntry = self.db.session.query(Data).filter(Data.entryName == "subscriptionPrice").first()
            myEntry.value = str(newPrice)
            self.db.session.commit()
            return {"success":True, "message":"Succesful."}
        return {"success":False, "message":"Something was wrong with request, maybe the price is < 0."}
    
    @admin_required()
    def makeAdmin(self, accountId):
        myUser = self.db.session.query(Account).filter(Account.accountId == accountId).first()
        if (myUser.roleId != 0):
            return {"success": False, "message": "Unable to make user admin."}
        
        myUser.roleId = -1
        self.db.session.commit()
        return {"success":True, "message":"Success."}
    
    @admin_required()
    def deleteAccount(self, accountId):
        try:
            myUser = self.db.session.query(Account).filter(Account.accountId == accountId).first()
            if myUser.roleId != 0:
                return {"success": False, "message": "Unable to delete non visitor account."}
            hisReviews = self.db.session.query(Review).filter(Review.accountId == myUser.accountId).delete()
            hisNotificationCountry = self.db.session.query(NotificationCountry).filter(NotificationCountry.accountId == myUser.accountId).delete()
            hisNotificationEventType = self.db.session.query(NotificationEventType).filter(NotificationEventType.accountId == myUser.accountId).delete()
            hisInterests = self.db.session.query(Interest).filter(Interest.accountId == myUser.accountId).delete()
            hisVisitor = self.db.session.query(Visitor).filter(Visitor.accountId == myUser.accountId).delete()
            self.db.session.delete(myUser)
            self.db.session.commit()
            return {"success":True, "message":"Success."}
        except:
            return {"success":False, "message":"Something went wrong."}
        
        
    @admin_required()
    def cancelSubscription(self, accountId):
        try:
            myUser = self.db.session.query(Account).filter(Account.accountId == accountId).first()
            data = self.db.session.query(Subscription).join(Account, Account.accountId == Subscription.accountId).filter(Account.accountId == accountId).order_by(Subscription.startDate).first()
            if data==None: 
                return jsonify({"success": False, "message": "Can't cancel. User doesn't already have an active subscription."})
            else:
                expire_date = data.expireDate
                today = datetime.now().date()
                if today >= expire_date:
                    return jsonify({"success": False, "message": "Can't cancel. User doesn't already have an active subscription."})
            mySubscriptionId = data.subscriptionId
            self.db.session.query(Subscription).filter(Subscription.subscriptionId == mySubscriptionId).delete()
            self.db.session.commit()
            return {"success": True, "message": "Successfuly canceled subscription."}
        except:
            return {"success": False, "message": "Can't cancel. Something went wrong."}
        
    
    @admin_required()
    def deleteEvent(self, eventId):
        #TODO DELETE RELATED IMAGES
        
        
        try:
            myEvent = self.db.session.query(Event).filter(Event.eventId == eventId).first()
            self.db.session.query(EventMedia).filter(EventMedia.eventId == eventId).delete()
            self.db.session.query(Review).filter(Review.eventId == eventId).delete()
            self.db.session.query(Interest).filter(Interest.eventId == eventId).delete()
            self.db.session.delete(myEvent)
            
            self.db.session.commit()
            
            return {"success": True, "message":"Successfuly deleted event."}
        except:
            return {"success": False, "message":"Couldn't delete event."}
        
    @admin_required()
    def deleteReview(self, reviewId):
        try:
            self.db.session.query(Review).filter(Review.reviewId == reviewId).delete()
            self.db.session.commit()
            return {"success": True, "message":"Successfuly deleted review."}
        except:
            return {"success": False, "message":"Couldn't delete review."}
            
    def revAccountEventToDict(self, triplet):
        review, account, event = triplet
        result = review.__dict__
        result["username"] = account.username
        result["eventName"] = event.title
        return result
    
    def hasReviews(self, accountId):
        reviews = self.db.session.query(Review).filter(Review.accountId == accountId).count()
        return reviews != 0
    
    def tripletToDict(self, triplet):
        acc, visit, org, country = triplet
        data = self.db.session.query(Subscription.startDate, Subscription.expireDate).join(Account, Account.accountId == Subscription.accountId).filter(Account.username ==acc.__dict__.get('username')).order_by(Subscription.startDate).first()
        events = self.db.session.query(Event).join(Account, Account.accountId == Event.accountId).filter(Account.username ==acc.__dict__.get('username')).all() 
        result : dict = {}
        result = acc.__dict__
        result.update(visit.__dict__) if visit != None else 1
        result.update(org.__dict__) if org != None else 1
        result["countryName"] = country.name
        if data:
            start_date, expire_date = data
            today = datetime.now().date()
            if expire_date != None or start_date<=today<=expire_date:
                result["subscription"] = 1
            else:
                result["subscription"] = 0
        else:
            result["subscription"] = 0
        if events:
            result["events"] = 1
        else:
            result["events"] = 0
        result["reviews"] = self.hasReviews(result["accountId"])
        del result['_sa_instance_state']
        return result

    def eventTypeOrgCountryToDict(self, doublet):
        event, type, org, country = doublet
        result = event.__dict__
        result["eventType"] = type.typeName
        result["organizerName"] = org.organizerName
        result["countryName"] = country.name
        del result['_sa_instance_state']
        return result