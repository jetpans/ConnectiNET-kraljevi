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
                "priority":str(int(random.random()*50))
            }, result_dict))
        return {"success":True, "data": toList}
    
    def getOrganizerPublicProfile(self, organizerId):
        organizer = self.db.session.query(Organizer).filter_by(accountId=organizerId).first()
        account = self.db.session.query(Account).filter_by(accountId=organizerId).first()
        if organizer:
            profile = {
                "username": account["username"],
                "organizerName": organizer["organizerName"],
                "eMail": account["eMail"],
                "profileImage": account["profileImage"],
                "countryCode": account["countryCode"],
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