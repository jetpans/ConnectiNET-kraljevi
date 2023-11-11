from flask import Flask,jsonify,request,render_template
from models import Account, Visitor, Organizer, Event, Review, Payment, Subscription, NotificationOption, EventMedia, Interest
from dotenv import load_dotenv
from controllers.controller import Controller
import random
from util import getRole

class EventController(Controller):
    def __init__(self, app, db,auth_users):
        super().__init__(app, db)
        self.auth_users = auth_users
        
        self.app.add_url_rule("/getThing", view_func=self.getThing, methods=["GET"])
    
    def getThing(self):
        if getRole(self.auth_users) not in [-1,1,0]:
            return "Authentication required!"
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
        return toList
        