from flask import Flask, render_template, request
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv


import os
load_dotenv()
DB_CONNECT_URL = os.getenv('DB_CONNECT_URL')


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = DB_CONNECT_URL

db = SQLAlchemy(app)

class Account(db.Model):
    __tablename__ = 'accounts'  # Plural lowercase table name

    username = db.Column(db.Integer, primary_key=True)
    passwordHash = db.Column(db.String(64), nullable=False)
    eMail = db.Column(db.String(100), nullable=False)
    profileImage = db.Column(db.String(150))

    def __init__(self, username, passwordHash, eMail, profileImage=None):
        self.username = username
        self.passwordHash = passwordHash
        self.eMail = eMail
        self.profileImage = profileImage

class Visitor(db.Model):
    __tablename__ = 'visitors'  # Plural lowercase table name

    username = db.Column(db.Integer, db.ForeignKey('accounts.username'), primary_key=True)
    firstName = db.Column(db.String(40), nullable=False)
    lastName = db.Column(db.String(40), nullable=False)
    account = db.relationship('Account', back_populates='visitors')
    def __init__(self, username, firstName, lastName):
        self.username = username
        self.firstName = firstName
        self.lastName = lastName     

class Organiser(db.Model):
    __tablename__ = 'organisers'  # Plural lowercase table name

    username = db.Column(db.Integer, db.ForeignKey('accounts.username'), primary_key=True)
    organiserName = db.Column(db.String(100), nullable=False)

    # Define the relationship to the Account table
    account = db.relationship('Account', back_populates='organisers')

    def __init__(self, username, organiserName):
        self.username = username
        self.organiserName = organiserName
        
class Administrator(db.Model):
    __tablename__ = 'administrators'  # Plural lowercase table name

    username = db.Column(db.Integer, db.ForeignKey('accounts.username'), primary_key=True)

    # Define the relationship to the Account table
    account = db.relationship('Account', back_populates='administrators')

    def __init__(self, username):
        self.username = username

class Event(db.Model):
    __tablename__ = 'events'  # Plural lowercase table name

    eventId = db.Column(db.String, primary_key=True)
    date = db.Column(db.Date, nullable=False)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(1000))
    country = db.Column(db.String(50), nullable=False)
    city = db.Column(db.String(50), nullable=False)
    location = db.Column(db.String(150), nullable=False)
    time = db.Column(db.DateTime, nullable=False)
    displayImageSource = db.Column(db.String(150))
    price = db.Column(db.Float)
    username = db.Column(db.Integer, db.ForeignKey('organisers.username'))

    # Define the relationship to the Organiser table
    organiser = db.relationship('Organiser', back_populates='events')

    def __init__(self, eventId, date, title, description, country, city, location, time, displayImageSource=None, price=None, username=None):
        self.eventId = eventId
        self.date = date
        self.title = title
        self.description = description
        self.country = country
        self.city = city
        self.location = location
        self.time = time
        self.displayImageSource = displayImageSource
        self.price = price
        self.username = username   

class Review(db.Model):
    __tablename__ = 'reviews'  # Plural lowercase table name

    reviewId = db.Column(db.String(10), primary_key=True)
    date = db.Column(db.Date, nullable=False)
    time = db.Column(db.DateTime, nullable=False)
    comment = db.Column(db.String(500), nullable=False)
    username = db.Column(db.Integer, db.ForeignKey('visitors.username'),  nullable=False)
    eventId = db.Column(db.String, db.ForeignKey('events.eventId') ,nullable=False)

    # Define the relationships to the Visitor and Event tables
    visitor = db.relationship('Visitor', back_populates='reviews')
    event = db.relationship('Event', back_populates='reviews')

    def __init__(self, reviewId, date, time, comment, username, eventId):
        self.reviewId = reviewId
        self.date = date
        self.time = time
        self.comment = comment
        self.username = username
        self.eventId = eventId

class Payment(db.Model):
    __tablename__ = 'payments'  # Plural lowercase table name

    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, nullable=False)
    amount = db.Column(db.Float, nullable=False)
    paymentMethod = db.Column(db.String(10), nullable=False)
    username = db.Column(db.Integer, db.ForeignKey('organisers.username'))

    # Define the relationship to the Organiser table
    organiser = db.relationship('Organiser', back_populates='payments')

    def __init__(self, id, date, amount, paymentMethod, username):
        self.id = id
        self.date = date
        self.amount = amount
        self.paymentMethod = paymentMethod
        self.username = username

class Subscription(db.Model):
    __tablename__ = 'subscriptions'  # Plural lowercase table name
    subscriptionId = db.Column(db.String(10), primary_key=True)
    startDate = db.Column(db.Date, nullable=False)
    expireDate = db.Column(db.Date, nullable=False)
    username = db.Column(db.Integer, db.ForeignKey('organisers.username'))

    # Define the relationship to the Organiser table
    organiser = db.relationship('Organiser', back_populates='subscriptions')

    def __init__(self, startDate, expireDate, subscriptionId, username):
        self.startDate = startDate
        self.expireDate = expireDate
        self.subscriptionId = subscriptionId
        self.username = username

class NotificationOption(db.Model):
    __tablename__ = 'notification_options'  # Plural lowercase table name

    type = db.Column(db.String(5), primary_key=True)
    username = db.Column(db.Integer, db.ForeignKey('visitors.username'), primary_key=True)

    # Define the relationship to the Visitor table
    visitor = db.relationship('Visitor', back_populates='notification_options')

    def __init__(self, type, username):
        self.type = type
        self.username = username
        
class EventMedia(db.Model):
    __tablename__ = 'event_media'  # Plural lowercase table name

    mediaType = db.Column(db.String, nullable=False)
    mediaSource = db.Column(db.String(150), nullable=False)
    mediaId = db.Column(db.String(10), primary_key=True)
    eventId = db.Column(db.String, db.ForeignKey('events.eventId'), nullable=False)

    # Define the relationship to the Event table
    event = db.relationship('Event', back_populates='event_media')

    def __init__(self, mediaType, mediaSource, mediaId, eventId):
        self.mediaType = mediaType
        self.mediaSource = mediaSource
        self.mediaId = mediaId
        self.eventId = eventId

class Interest(db.Model):
    __tablename__ = 'interests'  # Plural lowercase table name

    degreeOfInterest = db.Column(db.String(5), nullable=False)
    username = db.Column(db.Integer, db.ForeignKey('visitors.username'), primary_key=True)
    eventId = db.Column(db.String, db.ForeignKey('events.eventId'), primary_key=True)

    # Define the relationships to the Visitor and Event tables
    visitor = db.relationship('Visitor', back_populates='interests')
    event = db.relationship('Event', back_populates='interests')

    def __init__(self, degreeOfInterest, username, eventId):
        self.degreeOfInterest = degreeOfInterest
        self.username = username
        self.eventId = eventId

@app.route('/')
def hello():
    return "Hello world!"




if __name__ == "__main__":
    app.run(debug=True)