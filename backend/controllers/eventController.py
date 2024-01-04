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
        
    
    
    #@visitor_required()
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
        