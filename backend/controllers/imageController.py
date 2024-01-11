import logging
from flask import Flask,jsonify,request,render_template, session, send_file
from models import Account, Visitor, Organizer, Event, Review, Payment, Subscription, EventMedia, Interest
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


class ImageController(Controller):
    def __init__(self, app, db,jwt, bucket):
        super().__init__(app, db, jwt)
        self.bucket = bucket
        
        self.app.add_url_rule("/api/upload", view_func=self.upload_image, methods=["POST"])
        self.app.add_url_rule("/api/image/<image_name>", view_func = self.fetch_image, methods= ["GET"])
        self.app.add_url_rule("/api/usernameTempUpload", view_func=self.usernameTempUpload, methods=["POST"])
    
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
            
            new_filename = get_jwt_identity()+".png"  # Set your desired new filename here
            
            blob = self.bucket.blob(new_filename)
            blob.upload_from_file(file)
            blob.make_public()
            public_url = blob.public_url
            
            myUser.profileImage = public_url
            self.db.session.commit()
            return jsonify({'success': True, 'message': 'Image uploaded and saved successfully'})
        
        return jsonify({'success': False, 'error': 'No image data received'})     