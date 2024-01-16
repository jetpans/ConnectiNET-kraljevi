import logging
from flask import Flask,jsonify,request,render_template, session, send_file
from models import Account, Visitor, Organizer, Event, Review, Payment, Subscription, Data, EventMedia, Interest
from dotenv import load_dotenv
from controllers.controller import Controller
import random
from util import *
from flask_jwt_extended import create_access_token,get_jwt,get_jwt_identity, \
                               unset_jwt_cookies, jwt_required, JWTManager
import os

import firebase_admin
from firebase_admin import credentials, storage
import requests
from io import BytesIO
from sqlalchemy import and_
import uuid

class ImageController(Controller):
    def __init__(self, app, db,jwt, bucket):
        super().__init__(app, db, jwt)
        self.bucket = bucket
        
        self.app.add_url_rule("/api/upload", view_func=self.upload_image, methods=["POST"])
        self.app.add_url_rule("/api/image/<image_name>", view_func = self.fetch_image, methods= ["GET"])
        self.app.add_url_rule("/api/usernameTempUpload", view_func=self.usernameTempUpload, methods=["POST"])
        self.app.add_url_rule("/api/uploadEventImage/<eventId>", view_func=self.uploadEventImage, methods=["POST"])
        self.app.add_url_rule("/api/getEventMedia/<eventId>", view_func=self.getEventMedia, methods=["GET"])
        self.app.add_url_rule("/api/uploadEventMedia/<eventId>", view_func=self.addEventMedia, methods=["POST"])
        self.app.add_url_rule("/api/deleteEventMedia/<mediaId>", view_func=self.deleteEventMedia, methods=["DELETE"])

    # @visitor_required()
    def upload_image(self):

        if 'image' not in request.files:
            return jsonify({'success': False, 'error': 'No image part in the request'})

        file = request.files['image']
        if file:
            new_filename = 'image-demo.png'  # Set your desired new filename here
            # file_path = os.path.join(self.app.config['IMAGE_DIRECTORY'], new_filename)      
            # file.save(file_path)
            
            blob = self.bucket.blob(new_filename)
            blob.upload_from_file(file)
            public_url = blob.public_url
            
            return jsonify({'success': True, 'message': 'Image uploaded and saved successfully'})
        
        return jsonify({'success': False, 'error': 'No image data received'})    
    
    # @visitor_required()
    def fetch_image(self, image_name):
        # print("Image is being fetched!")
        blob = self.bucket.blob(image_name)
        if not blob.exists():
            return jsonify({'success': False, 'error': 'No profile image found'}) 
        try:
            response = requests.get(image_name)
            if response.status_code != 200:
                return jsonify({'success': False, 'error': 'Failed to download image'})
            return send_file(
                BytesIO(response.content),
                mimetype='image/png',  # Adjust mimetype based on your image type
                as_attachment=False,
                download_name='image.png'  # Adjust the download filename
            )
        except:
            return jsonify({'success': False, 'error': 'Errored.'}) 
            
        
        # placeholder_path = os.path.join(self.app.config['IMAGE_DIRECTORY'] ,"placeholder.png")
        # try:
        #     return send_file(placeholder_path, mimetype='image/png')  # Adjust mimetype based on your image type
        # except Exception as e:
        #     return str(e)
        # return jsonify({'success': False, 'error': 'No profile image found'})   
    
    @visitor_required()
    def usernameTempUpload(self):
        if 'image' not in request.files:
            return jsonify({'success': False, 'error': 'No image part in the request'})

        file = request.files['image']
        
        if file:
            myUser = self.db.session.query(Account).filter(Account.username == get_jwt_identity()).first()
            
            new_filename = str(uuid.uuid4())+".png"  # Set your desired new filename here
            
            blob = self.bucket.blob(new_filename)
            blob.upload_from_file(file)
            blob.make_public()
            public_url = blob.public_url
            
            myUser.profileImage = public_url
            self.db.session.commit()
            return jsonify({'success': True, 'message': 'Image uploaded and saved successfully'})
        
        return jsonify({'success': False, 'error': 'No image data received'})  
    
    @jwt_required()
    def uploadEventImage(self, eventId):
        myEvent = self.db.session.query(Event).join(Account, and_(Account.accountId == Event.accountId, Account.username == get_jwt_identity()))\
            .filter(Event.eventId == eventId).first()
        
        if myEvent == None:
            return {"success":False, 'error':"User is not owner of this event."}
        if 'image' not in request.files:
            return {'success': False, 'error': 'No image part in the request'}
        
        file = request.files['image']        
        if file:
            
            new_filename = str(uuid.uuid4())+".png"  # Set your desired new filename here
            
            blob = self.bucket.blob(new_filename)
            blob.upload_from_file(file)
            blob.make_public()
            public_url = blob.public_url
            
            myEvent.displayImageSource = public_url
            self.db.session.commit()
            return jsonify({'success': True, 'message': 'Image uploaded and saved successfully'})
        
        return jsonify({'success': False, 'error': 'No image data received'})

    @jwt_required()
    def addEventMedia(self, eventId):
        myEvent = self.db.session.query(Event).join(Account, and_(Account.accountId == Event.accountId, Account.username == get_jwt_identity()))\
            .filter(Event.eventId == eventId).first()
        
        if myEvent == None:
            return {"success":False, 'error':"User is not owner of this event."}
        if 'image' not in request.files:
            return {'success': False, 'error': 'No image part in the request.'}
        
        file = request.files['image']        
        if file:
            
            new_filename = str(uuid.uuid4())+".png"  # Set your desired new filename here
            
            blob = self.bucket.blob(new_filename)
            blob.upload_from_file(file)
            blob.make_public()
            public_url = blob.public_url
            
            newMedia = EventMedia("image", public_url, eventId)
            self.db.session.add(newMedia)
            
            self.db.session.commit()
            return jsonify({'success': True, 'message': 'Image uploaded and saved successfully'})
        
        return jsonify({'success': False, 'error': 'No image data received'})
    @jwt_required()
    def getEventMedia(self, eventId):
        try:
            myMedia = self.db.session.query(EventMedia).filter(EventMedia.eventId == eventId).all()
            result = list(map(lambda entry: entry.__dict__, myMedia))
            for entry in result:
                del entry['_sa_instance_state']
        except:
            return {"success": False, "message": "Something went wrong."}
        return {"success":True, "data":result}
    
    
    
    @jwt_required()
    def deleteEventMedia(self, mediaId):
        myEvent, media = self.db.session.query(Event,EventMedia).join(Account, and_(Account.accountId == Event.accountId, Account.username == get_jwt_identity()))\
            .join(EventMedia, and_(EventMedia.mediaId == mediaId, EventMedia.eventId == Event.eventId)).first()
        
        if myEvent == None:
            return {"success":False, 'error':"User is not owner of this event."}

        
        if media == None:
            return {"success":False, 'error':"Media doesn't exist"}
        

        try:
            blob_path = media.mediaSource
            blob_path = blob_path.split("/")[-1]
            blob = storage.bucket().blob(blob_path)
            blob.delete()
        except:
            pass
        self.db.session.delete(media)
        self.db.session.commit()
        return {"success":True, 'error':"Deleted event media successfuly."}
