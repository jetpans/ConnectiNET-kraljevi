import os
from datetime import timedelta 

class Config:
    SECRET_KEY = "secret"
    JWT_SECRET_KEY = "secret"
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=1)
    #SQLALCHEMY_TRACK_MODIFICATIONS = False

class DevelopmentConfig(Config):
    SQLALCHEMY_DATABASE_URI = os.environ.get('DB_CONNECT_URL_DEV')
    DEBUG = True

class ProductionConfig(Config):
    SQLALCHEMY_DATABASE_URI = os.environ.get('DB_CONNECT_URL_PROD')
    DEBUG = False
