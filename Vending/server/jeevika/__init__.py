from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_mail import Mail

app = Flask(__name__)

app.config['SECRET_KEY'] = '5791628bb0b13ce0c676dfde280ba245'
# app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://hzzsxita:Zaeclydnal37FcYKmLLDJHkH3KOUjq8W@tiny.db.elephantsql.com/hzzsxita'
MAIL_SERVER= "smtp.googlemail.com"
MAIL_PORT= 587
MAIL_USE_TLS= True
MAIL_USERNAME= 'ikki.debug@gmail.com'
MAIL_PASSWORD= 'hqti jpcg ugoe lvxi'
mail = Mail()
db = SQLAlchemy(app)
from jeevika import route
with app.app_context():
    db.create_all()