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
    __tablename__ = 'accounts'

    accountId = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), nullable=False, unique=True)
    passwordHash = db.Column(db.String(64), nullable=False)
    eMail = db.Column(db.String(200), nullable=False)
    profileImage = db.Column(db.String(150))

    def __init__(self, username, passwordHash, eMail, profileImage=None):
        self.username = username
        self.passwordHash = passwordHash
        self.eMail = eMail
        self.profileImage = profileImage

class Visitor(db.Model):
    __tablename__ = 'visitors'  # Lowercase and plural table name

    accountId = db.Column(db.Integer, db.ForeignKey('accounts.accountId'), primary_key=True)
    firstName = db.Column(db.String(50), nullable=False)
    lastName = db.Column(db.String(50), nullable=False)

    account = db.relationship('Account', backref='visitors')

    def __init__(self, firstName, lastName, accountId):
        self.firstName = firstName
        self.lastName = lastName
        self.accountId = accountId    

class Organiser(db.Model):
    __tablename__ = 'organisers'  # Lowercase and plural table name

    accountId = db.Column(db.Integer, db.ForeignKey('accounts.accountId'), primary_key=True)
    organiserName = db.Column(db.String(100), nullable=False)

    account = db.relationship('Account', backref='organisers')

    def __init__(self, organiserName, accountId):
        self.organiserName = organiserName
        self.accountId = accountId
        
class Administrator(db.Model):
    __tablename__ = 'administrators'  # Lowercase and plural table name

    accountId = db.Column(db.Integer, db.ForeignKey('accounts.accountId'), primary_key=True)
    account = db.relationship('Account', backref='administrators')
    
    def __init__(self, accountId):
        self.accountId = accountId

class Event(db.Model):
    __tablename__ = 'events'  # Lowercase and plural table name

    eventId = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, nullable=False)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.String(1000))
    country = db.Column(db.String(50), nullable=False)
    city = db.Column(db.String(50), nullable=False)
    location = db.Column(db.String(100), nullable=False)
    time = db.Column(db.Time, nullable=False)
    displayImageSource = db.Column(db.String(150))
    price = db.Column(db.Float)
    accountId = db.Column(db.Integer, db.ForeignKey('organisers.accountId'))

    organiser = db.relationship('Organiser', backref='events')

    def __init__(self, date, title, description, country, city, location, time, displayImageSource, price, accountId):
        self.date = date
        self.title = title
        self.description = description
        self.country = country
        self.city = city
        self.location = location
        self.time = time
        self.displayImageSource = displayImageSource
        self.price = price
        self.accountId = accountId 

class Review(db.Model):
    __tablename__ = 'reviews'  # Lowercase and plural table name

    reviewId = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, nullable=False)
    time = db.Column(db.Time, nullable=False)
    comment = db.Column(db.String(250), nullable=False)
    accountId = db.Column(db.Integer, db.ForeignKey('visitors.accountId'))
    eventId = db.Column(db.Integer, db.ForeignKey('events.eventId'))

    visitor = db.relationship('Visitor', backref='reviews')
    event = db.relationship('Event', backref='reviews')

    def __init__(self, date, time, comment, accountId, eventId):
        self.date = date
        self.time = time
        self.comment = comment
        self.accountId = accountId
        self.eventId = eventId

class Payment(db.Model):
    __tablename__ = 'payments'  # Lowercase and plural table name

    paymentId = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, nullable=False)
    amount = db.Column(db.Float, nullable=False)
    paymentMethod = db.Column(db.String(10), nullable=False)
    accountId = db.Column(db.Integer, db.ForeignKey('organisers.accountId'))

    organiser = db.relationship('Organiser', backref='payments')

    def __init__(self, paymentId, date, amount, paymentMethod, accountId):
        self.paymentId = paymentId
        self.date = date
        self.amount = amount
        self.paymentMethod = paymentMethod
        self.accountId = accountId

class Subscription(db.Model):
    __tablename__ = 'subscriptions'  # Lowercase and plural table name

    subscriptionId = db.Column(db.Integer, primary_key=True)
    startDate = db.Column(db.Date)
    expireDate = db.Column(db.Date, nullable=False)
    accountId = db.Column(db.Integer, db.ForeignKey('organisers.accountId'))

    organiser = db.relationship('Organiser', backref='subscriptions')

    def __init__(self, subscriptionId, startDate, expireDate, accountId):
        self.subscriptionId = subscriptionId
        self.startDate = startDate
        self.expireDate = expireDate
        self.accountId = accountId

class NotificationOption(db.Model):
    __tablename__ = 'notification_options'  # Lowercase and plural table name

    type = db.Column(db.String(10), primary_key=True, nullable=False)
    accountId = db.Column(db.Integer, db.ForeignKey('visitors.accountId'), primary_key=True, nullable=False)

    visitor = db.relationship('Visitor', backref='notification_options')

    def __init__(self, type, accountId):
        self.type = type
        self.accountId = accountId
      
class EventMedia(db.Model):
    __tablename__ = 'event_media'  # Lowercase and plural table name

    mediaId = db.Column(db.Integer, primary_key=True)
    mediaType = db.Column(db.String(10), nullable=False)
    mediaSource = db.Column(db.String(150), nullable=False)
    eventId = db.Column(db.Integer, db.ForeignKey('events.eventId'), nullable=False)

    event = db.relationship('Event', backref='event_media')

    def __init__(self, mediaType, mediaSource, mediaId, eventId):
        self.mediaType = mediaType
        self.mediaSource = mediaSource
        self.mediaId = mediaId
        self.eventId = eventId

class Interest(db.Model):
    __tablename__ = 'interests'  # Lowercase and plural table name

    degreeOfInterest = db.Column(db.String(10), nullable=False)
    accountId = db.Column(db.Integer, db.ForeignKey('visitors.accountId'), primary_key=True, nullable=False)
    eventId = db.Column(db.Integer, db.ForeignKey('events.eventId'), primary_key=True, nullable=False)

    visitor = db.relationship('Visitor', backref='interests')
    event = db.relationship('Event', backref='interests')

    def __init__(self, degreeOfInterest, accountId, eventId):
        self.degreeOfInterest = degreeOfInterest
        self.accountId = accountId
        self.eventId = eventId

@app.route('/')
def hello():
    return "Hello world!"




if __name__ == "__main__":
    app.run(debug=True)