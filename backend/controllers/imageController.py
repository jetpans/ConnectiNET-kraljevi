from flask import Flask,jsonify,request,render_template, session, send_file
from models import Account, Visitor, Organizer, Event, Review, Payment, Subscription, NotificationOption, EventMedia, Interest
from dotenv import load_dotenv
from controllers.controller import Controller
import random
from util import *
from flask_jwt_extended import create_access_token,get_jwt,get_jwt_identity, \
                               unset_jwt_cookies, jwt_required, JWTManager
import os

class ImageController(Controller):
    def __init__(self, app, db,jwt):
        super().__init__(app, db, jwt)

        self.app.add_url_rule("/user/upload", view_func=self.upload_image, methods=["POST"])
        self.app.add_url_rule("/user/fetch", view_func = self.fetch_image, methods= ["GET"])
        
    # @visitor_required()
    def upload_image(self):
        print("Got request")
        print(list(request.files.keys()))
        if 'image' not in request.files:
            return jsonify({'success': False, 'error': 'No image part in the request'})

        file = request.files['image']
        if file:
            new_filename = 'image-demo.png'  # Set your desired new filename here
            file_path = os.path.join(self.app.config['IMAGE_DIRECTORY'], new_filename)      
            file.save(file_path)

            return jsonify({'success': True, 'message': 'Image uploaded and saved successfully'})
        
        return jsonify({'success': False, 'error': 'No image data received'})    
    
    # @visitor_required()
    def fetch_image(self):
        print("Image is being fetched!")
        image_path = os.path.join(self.app.config['IMAGE_DIRECTORY'] , "image-demo.png")
        try:
            return send_file(image_path, mimetype='image/png')  # Adjust mimetype based on your image type
        except Exception as e:
            return str(e)
        