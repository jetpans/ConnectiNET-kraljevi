from flask import Flask,jsonify,request,render_template, session
from models import Account, Visitor, Organizer, Event, Review, Payment, Subscription, NotificationOption, EventMedia, Interest
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
                "interest": sum(1 for interest in self.db.session.query(Interest).filter(Interest.eventId == event["eventId"]).all() if interest.degreeOfInterest == "interested")


            }, result_dict))
        return {"success":True, "data": toList}
        

   
    

    
    def getReviewsForEvent(self, eventId):
        dbResp = self.db.session.query(Review).filter(Review.eventId == eventId).all() 
        comments = [review.comment for review in dbResp]        
        return {"success":True, "data": comments} 
    
    @jwt_required()
    def getEvent(self, card_id):

        eventId = card_id

        dbResp = self.db.session.query(Review).filter(Review.eventId == eventId).all() 
        comments = [review.comment for review in dbResp] 

        MyEvent = self.db.session.query(Event).filter(Event.eventId == eventId).first()

        interests_with_event_id = self.db.session.query(Interest).filter(Interest.eventId == eventId).all()
        interested_count = sum(1 for interest in interests_with_event_id if interest.degreeOfInterest == "interested")
        maybe_count = sum(1 for interest in interests_with_event_id if interest.degreeOfInterest == "maybe")
        nointerest_count = sum(1 for interest in interests_with_event_id if interest.degreeOfInterest == "nointerest")


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