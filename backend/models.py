from flask import Flask, render_template, request
from flask_sqlalchemy import SQLAlchemy
import os
from config import DevelopmentConfig, ProductionConfig


app = Flask(__name__)
env = os.environ.get('FLASK_ENV')

if env == 'production':
    app.config.from_object(ProductionConfig)
else:
    app.config.from_object(DevelopmentConfig)
app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://snnmskyd:3RwBnQ_v0mfD24Jlbzy2xWFpw_wCGcUm@surus.db.elephantsql.com/snnmskyd"
db = SQLAlchemy(app)

class Country(db.Model):
    __tablename__ = "countries"
    
    countryCode = db.Column(db.String(3), primary_key=True)
    code = db.Column(db.String(2), unique = True)
    name = db.Column(db.String(100), nullable = False)
class Account(db.Model):
    __tablename__ = 'accounts'

    accountId = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), nullable=False, unique=True)
    passwordHash = db.Column(db.String(72), nullable=False)
    eMail = db.Column(db.String(200), nullable=False)
    profileImage = db.Column(db.String(150))
    roleId = db.Column(db.Integer, nullable = False)
    countryCode = db.Column(db.String(3), db.ForeignKey('countries.countryCode'))
    
    country = db.relationship('Country', backref='accounts')

    def __init__(self, roleId, username, passwordHash, eMail,countryCode, profileImage=None):
        self.roleId = roleId
        self.username = username
        self.passwordHash = passwordHash
        self.eMail = eMail
        self.profileImage = profileImage
        self.countryCode = countryCode

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

class Organizer(db.Model):
    __tablename__ = 'organizers'  # Lowercase and plural table name

    accountId = db.Column(db.Integer, db.ForeignKey('accounts.accountId'), primary_key=True)
    organizerName = db.Column(db.String(100), nullable=False)
    hidden = db.Column(db.Boolean, default = False)
    socials = db.Column(db.String(200), nullable = True)
    account = db.relationship('Account', backref='organizers')

    def __init__(self, organizerName, accountId):
        self.organizerName = organizerName
        self.accountId = accountId

class Event(db.Model):
    __tablename__ = 'events'  # Lowercase and plural table name

    eventId = db.Column(db.Integer, primary_key=True)
    dateTime = db.Column(db.DateTime(timezone=True), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.String(1000))
    countryCode = db.Column(db.String(3), db.ForeignKey('countries.countryCode'), nullable=False)
    city = db.Column(db.String(50), nullable=False)
    location = db.Column(db.String(100), nullable=False)
    displayImageSource = db.Column(db.String(150))
    price = db.Column(db.Float)
    eventType = db.Column(db.Integer, nullable = False)
    duration = db.Column(db.Interval, nullable = True)
    accountId = db.Column(db.Integer, db.ForeignKey('organizers.accountId'))

    organizer = db.relationship('Organizer', backref='events')
    country = db.relationship('Country', backref='events')

    def __init__(self, dateTime, title, description, countryCode, city, location, duration, displayImageSource, price, eventType, accountId):
        self.dateTime = dateTime
        self.title = title
        self.description = description
        self.countryCode = countryCode
        self.city = city
        self.location = location
        self.duration = duration
        self.displayImageSource = displayImageSource
        self.price = price
        self.eventType = eventType
        self.accountId = accountId 

class Review(db.Model):
    __tablename__ = 'reviews'  # Lowercase and plural table name

    reviewId = db.Column(db.Integer, primary_key=True)
    dateTime = db.Column(db.DateTime(timezone=True), nullable=False)
    comment = db.Column(db.String(250), nullable=False)
    accountId = db.Column(db.Integer, db.ForeignKey('visitors.accountId'))
    eventId = db.Column(db.Integer, db.ForeignKey('events.eventId'))

    visitor = db.relationship('Visitor', backref='reviews')
    event = db.relationship('Event', backref='reviews')

    def __init__(self, dateTime, comment, accountId, eventId):
        self.dateTime = dateTime
        self.comment = comment
        self.accountId = accountId
        self.eventId = eventId

class Payment(db.Model):
    __tablename__ = 'payments'  # Lowercase and plural table name

    paymentId = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, nullable=False)
    amount = db.Column(db.Float, nullable=False)
    paymentMethod = db.Column(db.String(10), nullable=False)
    accountId = db.Column(db.Integer, db.ForeignKey('organizers.accountId'))

    organizer = db.relationship('Organizer', backref='payments')

    def __init__(self,  date, amount, paymentMethod, accountId):
        self.date = date
        self.amount = amount
        self.paymentMethod = paymentMethod
        self.accountId = accountId

class Subscription(db.Model):
    __tablename__ = 'subscriptions'  # Lowercase and plural table name

    subscriptionId = db.Column(db.Integer, primary_key=True)
    startDate = db.Column(db.Date)
    expireDate = db.Column(db.Date, nullable=False)
    accountId = db.Column(db.Integer, db.ForeignKey('organizers.accountId'))

    organizer = db.relationship('Organizer', backref='subscriptions')

    def __init__(self, startDate, expireDate, accountId):

        self.startDate = startDate
        self.expireDate = expireDate
        self.accountId = accountId

class NotificationCountry(db.Model):
    __tablename__ = 'notification_countries'  # Lowercase and plural table name
    
    accountId = db.Column(db.Integer, db.ForeignKey('visitors.accountId'), primary_key=True, nullable=False)
    countryCode = db.Column(db.String(3), db.ForeignKey('countries.countryCode'), primary_key = True, nullable=False)

    visitor = db.relationship('Visitor', backref='notification_countries')
    country = db.relationship('Country', backref='notification_countries')

    def __init__(self, countryCode, accountId):
        self.countryCode = countryCode
        self.accountId = accountId
        
class NotificationEventType(db.Model):
    __tablename__ = "notification_eventtypes"

    eventType = db.Column(db.Integer, db.ForeignKey('eventtypes.typeId'), primary_key=True, nullable=False)
    accountId = db.Column(db.Integer, db.ForeignKey('visitors.accountId'), primary_key=True, nullable=False)

    visitor = db.relationship('Visitor', backref='notification_eventtypes')
    type = db.relationship('EventType' , backref = "notification_eventtypes")
    def __init__(self, eventType, accountId):
        self.eventType = eventType
        self.accountId = accountId
        
        
class EventType(db.Model):
    __tablename__ = "eventtypes"
    typeId = db.Column(db.Integer, primary_key = True, nullable = False)
    typeName = db.Column(db.String(50), nullable = False)
    

class EventMedia(db.Model):
    __tablename__ = 'event_media'  # Lowercase and plural table name

    mediaId = db.Column(db.Integer, autoincrement = True, primary_key=True)
    mediaType = db.Column(db.String(10), nullable=False)
    mediaSource = db.Column(db.String(150), nullable=False)
    eventId = db.Column(db.Integer, db.ForeignKey('events.eventId'), nullable=False)

    event = db.relationship('Event', backref='event_media')

    def __init__(self, mediaType, mediaSource, eventId):
        self.mediaType = mediaType
        self.mediaSource = mediaSource
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

class Data(db.Model):
    __tablename__ = 'data'
    
    entryName = db.Column(db.String(10),primary_key =True , nullable = False)
    value = db.Column(db.String(500), nullable = False)
@app.route('/')
def hello():
    return "Hello world!"




if __name__ == "__main__":
    app.run(debug=True)