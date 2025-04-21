from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_mail import Mail
from dotenv import load_dotenv
import os
load_dotenv()
app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')
# app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('SQLALCHEMY_DATABASE_URI')
MAIL_SERVER= os.environ.get('MAIL_SERVER')
MAIL_PORT= 587
MAIL_USE_TLS= True
MAIL_USERNAME= os.environ.get('MAIL_USERNAME')
MAIL_PASSWORD= os.environ.get('MAIL_PASSWORD')
mail = Mail()
db = SQLAlchemy(app)
from jeevika import route
with app.app_context():
    db.create_all()