import logging
from flask import Flask,jsonify,request,render_template, session
from models import Account, Visitor, Organizer, Event, Review, Payment, Subscription, Data, EventMedia, Interest, Country
from dotenv import load_dotenv
from controllers.controller import Controller
import random
from util import *
from flask_jwt_extended import create_access_token,get_jwt,get_jwt_identity, \
                               unset_jwt_cookies, jwt_required, JWTManager


class EventController(Controller):
    def __init__(self, app, db,jwt):
        super().__init__(app, db, jwt)

        
        self.app.add_url_rule("/getEvents", view_func=self.getEvents, methods=["GET"])
        self.app.add_url_rule("/getEvent/<int:card_id>", view_func=self.getEvent, methods=["GET"])
        self.app.add_url_rule("/getOrganizerPublicProfile/<int:organizerId>", view_func=self.getOrganizerPublicProfile, methods=["GET"])

    
    # @visitor_required()
    @jwt_required()
    def getEvents(self):
        # if getRole(self.auth_users) not in [-1,1,0]:
        #     return {"success": False, "data": "Authentication required"}
        
        dbResp = self.db.session.query(Event).all() 
        result_dict = [u.__dict__ for u in dbResp]
        toList = list(map( lambda event:
            {
                "id":event["eventId"],
                "title":event["title"],
                "image":event["displayImageSource"],
                "description":event["description"],
                "time":str(event["dateTime"]),
                "priority":str(int(random.random()*50)),
                "accountId":event["accountId"],
                "organizer": self.db.session.query(Organizer).filter(Organizer.accountId == event["accountId"]).first().organizerName, 
                "price":event["price"],
                "interest": sum(1 for interest in self.db.session.query(Interest).filter(Interest.eventId == event["eventId"]).all() if (interest.degreeOfInterest == 1 or interest.degreeOfInterest == 0))


            }, result_dict))
        return {"success":True, "data": toList}
        

    
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
        # comments = [review.comment for review in dbResp]
        return toList
    
    @jwt_required()
    def getEvent(self, card_id):

        eventId = card_id

        comments = self.getReviewsForEvent(eventId)

        MyEvent = self.db.session.query(Event).filter(Event.eventId == eventId).first()

        interests_with_event_id = self.db.session.query(Interest).filter(Interest.eventId == eventId).all()
        interested_count = sum(1 for interest in interests_with_event_id if interest.degreeOfInterest == 1)
        maybe_count = sum(1 for interest in interests_with_event_id if interest.degreeOfInterest == 0)
        nointerest_count = sum(1 for interest in interests_with_event_id if interest.degreeOfInterest == -1)


        event = {
            "id": MyEvent.eventId,
            "title": MyEvent.title,
            "time":str(MyEvent.dateTime),
            "image":MyEvent.displayImageSource,
            "description":MyEvent.description,
            "price":MyEvent.price,
            "city":MyEvent.city,
            "location":MyEvent.location,
            "time":str(MyEvent.dateTime),
            "priority":str(int(random.random()*50)),
            "accountId":MyEvent.accountId,
            "interested": interested_count,
            "maybe": maybe_count,
            "nointerest": nointerest_count,
            "organizer": self.db.session.query(Organizer).filter(Organizer.accountId == MyEvent.accountId).first().organizerName, 
            "image_org": self.db.session.query(Account).filter(Account.accountId == MyEvent.accountId).first().profileImage 
            
        }

       

        
        return {"success":True, "data": event, "comments": comments}
    
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

            dbResp = self.db.session.query(Event).filter_by(accountId=organizerId).all() 
            result_dict = [u.__dict__ for u in dbResp]
            toList = list(map( lambda event:
                {
                    "id":event["eventId"],
                    "title":event["title"],
                    "image":event["displayImageSource"],
                    "description":event["description"],
                    "time":str(event["dateTime"]),
                    "priority":str(int(random.random()*50))
                }, result_dict))

            return jsonify({"success": True, "organizerInfo": profile, "organizerEvents": toList})
        else:
            return jsonify({"success": False, "message": "Organizer not found"})
