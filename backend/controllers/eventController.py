from datetime import date, timedelta
import logging
from flask import Flask,jsonify,request,render_template, session
from models import Account, EventType, Visitor, Organizer, Event, Review, Payment, Subscription, Data, EventMedia, Interest, Country
from dotenv import load_dotenv
from controllers.controller import Controller
import random
from util import *
from datetime import datetime, date
from flask_jwt_extended import create_access_token,get_jwt,get_jwt_identity, \
                               unset_jwt_cookies, jwt_required, JWTManager


class EventController(Controller):
    def __init__(self, app, db,jwt):
        super().__init__(app, db, jwt)

        
        self.app.add_url_rule("/getEvents", view_func=self.getEvents, methods=["GET"])
        self.app.add_url_rule("/getEvent/<int:card_id>", view_func=self.getEvent, methods=["GET"])
        self.app.add_url_rule("/getOrganizerPublicProfile/<int:organizerId>", view_func=self.getOrganizerPublicProfile, methods=["GET"])
        self.app.add_url_rule("/setInterest/<int:eventId>", view_func=self.setInterest, methods=["POST"])
        self.app.add_url_rule("/createComment/<int:eventId>", view_func=self.createComment, methods=["POST"])
        self.app.add_url_rule("/api/getEventTypes", view_func = self.getEventTypes, methods = ["GET"])

    
    # @visitor_required()
    @jwt_required()
    def getEvents(self):
        # if getRole(self.auth_users) not in [-1,1,0]:
        #     return {"success": False, "data": "Authentication required"}
        two_years_ago = datetime.now() - timedelta(days=365 * 2)

        dbResp = self.db.session.query(Event, EventType).filter(Event.dateTime >= two_years_ago).join(EventType, Event.eventType == EventType.typeId).all()
        result_dict = []
        for pair in dbResp:
            item = pair[0].__dict__
            item["typeName"] = pair[1].typeName
            result_dict.append(item)
        toList = list(map( lambda event:
            {
                "id":event["eventId"],
                "title":event["title"],
                "image":event["displayImageSource"],
                "description":event["description"],
                "time":str(event["dateTime"]),
                "country":event["countryCode"],
                "city":event["city"],
                "type":event["typeName"],
                "priority":str(int(random.random()*50)),
                "accountId":event["accountId"],
                "organizer": self.db.session.query(Organizer).filter(Organizer.accountId == event["accountId"]).first().organizerName, 
                "price":event["price"],
                "my_event": True if self.db.session.query(Account).filter(Account.username == get_jwt_identity()).first().accountId == event["accountId"] else False,
                "interest": sum(1 for interest in self.db.session.query(Interest).filter(Interest.eventId == event["eventId"]).all() if (interest.degreeOfInterest == 1 or interest.degreeOfInterest == 0))
            }, result_dict))
        return {"success":True, "data": toList}
        

    @jwt_required()
    def getReviewsForEvent(self, eventId):
        dbResp = self.db.session.query(Review, Visitor.firstName, Visitor.lastName).join(Visitor, Review.accountId == Visitor.accountId).filter(Review.eventId == eventId).all()
        result_dict = [u[0].__dict__ for u in dbResp]
        firstNameList = [u[1] for u in dbResp]
        lastNameList = [u[2] for u in dbResp]
        toList = list(map( lambda review, firstName, lastName:
            {
                "id":review["reviewId"],
                "time":str(review["dateTime"]),
                "comment":review["comment"],
                "accountId":review["accountId"],
                "firstName":firstName,
                "lastName":lastName,
                "eventId":review["eventId"]
            }, result_dict, firstNameList, lastNameList))
        return toList
    
    @jwt_required()
    def getEvent(self, card_id):

        eventId = card_id

        comments = self.getReviewsForEvent(eventId)

        MyEvent = self.db.session.query(Event, EventType).filter(Event.eventId == eventId).join(EventType, EventType.typeId == Event.eventType).first()
        eventTypeName = MyEvent[1].typeName
        MyEvent = MyEvent[0]
        
        interests_with_event_id = self.db.session.query(Interest).filter(Interest.eventId == eventId).all()
        interested_count = 0
        maybe_count = 0
        nointerest_count = 0
        for interest in interests_with_event_id:
            if int(interest.degreeOfInterest) == 1:
                interested_count += 1
            elif int(interest.degreeOfInterest) == 0:
                maybe_count += 1
            elif int(interest.degreeOfInterest) == -1:
                nointerest_count += 1
        
        if(MyEvent.dateTime is not None and MyEvent.duration is not None):
            end_time = MyEvent.dateTime + MyEvent.duration
        else:
            end_time = datetime(year=9999, month=1, day=15, hour=8, minute=0, second=0)

        event = {
            "id": MyEvent.eventId,
            "title": MyEvent.title,
            "time":str(MyEvent.dateTime),
            "image":MyEvent.displayImageSource,
            "description":MyEvent.description,
            "price":MyEvent.price,
            "city":MyEvent.city,
            "location":MyEvent.location,
            "priority":str(int(random.random()*50)),
            "accountId":MyEvent.accountId,
            "interested": interested_count,
            "maybe": maybe_count,
            "nointerest": nointerest_count,
            "organizer": self.db.session.query(Organizer).filter(Organizer.accountId == MyEvent.accountId).first().organizerName, 
            "image_org": self.db.session.query(Account).filter(Account.accountId == MyEvent.accountId).first().profileImage,
            "countryCode": MyEvent.countryCode,
            "eventType": eventTypeName,
            "end_time": str(end_time),
            "username": self.db.session.query(Account).filter(Account.accountId == MyEvent.accountId).first().username,
            "my_event": True if self.db.session.query(Account).filter(Account.username == get_jwt_identity()).first().accountId == MyEvent.accountId else False

        }
        
        return {"success":True, "data": event, "comments": comments}
    
    @jwt_required()
    def getOrganizerPublicProfile(self, organizerId):
        organizer = self.db.session.query(Organizer).filter_by(accountId=organizerId).first()
        if organizer:
            account = self.db.session.query(Account).filter_by(accountId=organizerId).first()
            country = self.db.session.query(Country).filter_by(countryCode=account.countryCode).first()
            profile = {
                "username": account.username,
                "organizerName": organizer.organizerName,
                "eMail": account.eMail,
                "profileImage": account.profileImage,
                "country": country.name,
                "socials": organizer.socials
            }
            
            two_years_ago = datetime.now() - timedelta(days=365 * 2)

            dbResp = self.db.session.query(Event).filter(Event.dateTime >= two_years_ago).filter_by(accountId=organizerId).all() 
            result_dict = [u.__dict__ for u in dbResp]
            toList = list(map( lambda event:
                {
                    "id":event["eventId"],
                    "title":event["title"],
                    "image":event["displayImageSource"],
                    "description":event["description"],
                    "time":str(event["dateTime"]),
                    "priority":str(int(random.random()*50)),
                    "organizer": self.db.session.query(Organizer).filter(Organizer.accountId == event["accountId"]).first().organizerName, 
                    "price":event["price"],
                    "my_event": True if self.db.session.query(Account).filter(Account.username == get_jwt_identity()).first().accountId == event["accountId"] else False,
                    "accountId": event["accountId"],
                
                }, result_dict))

            return jsonify({"success": True, "organizerInfo": profile, "organizerEvents": toList})
        else:
            return jsonify({"success": False, "message": "Organizer not found"})

    @jwt_required()
    def setInterest(self, eventId):
        try:
            formData = request.get_json()
            
            data = self.db.session.query(Interest).join(Account, Account.accountId == Interest.accountId).join(Event, Event.eventId == Interest.eventId).filter(Account.username == get_jwt_identity()).filter(Event.eventId == eventId).first()
            
            myUser = self.db.session.query(Account).filter_by(username=get_jwt_identity()).first()
            
            if data:
                data.degreeOfInterest = formData["interest"]
            else:
                new_interest = Interest(formData["interest"], myUser.accountId, eventId)
                self.db.session.add(new_interest)
            
            self.db.session.commit()
            
            return jsonify({"success": True, "message": "Interest set successfully"})
        except Exception as e:
            logging.warning(e)
            return jsonify({"success": False, "message": "Error setting Interest"})
        
    @jwt_required()
    def createComment(self, eventId):
        try:
            formData = request.get_json()            
            # data = self.db.session.query(Interest).join(Account, Account.accountId == Interest.accountId).join(Event, Event.eventId == Interest.eventId).filter(Account.username == get_jwt_identity()).filter(Event.eventId == eventId).first()
            
            myUser = self.db.session.query(Account).filter_by(username=get_jwt_identity()).first()
                        
            new_comment = Review(date.today(), formData["comment"], myUser.accountId, eventId)
            self.db.session.add(new_comment)
            
            self.db.session.commit()
            
            return jsonify({"success": True, "message": "Comment created successfully"})
        except Exception as e:
            logging.warning(e)
            return jsonify({"success": False, "message": "Error creating Comment"})
        
    @jwt_required()
    def getEventTypes(self):
        event_types = self.db.session.query(EventType).all()
        event_types = list(map(lambda eType: eType.__dict__, event_types))
        for item in event_types:
            del item['_sa_instance_state']
        
        return {"success":True, "data": event_types}