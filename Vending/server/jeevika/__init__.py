from flask import Flask
from flask_sqlalchemy import SQLAlchemy


app = Flask(__name__)

app.config['SECRET_KEY'] = '5791628bb0b13ce0c676dfde280ba245'
# app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://hzzsxita:Zaeclydnal37FcYKmLLDJHkH3KOUjq8W@tiny.db.elephantsql.com/hzzsxita'

db = SQLAlchemy(app)
from jeevika import route
with app.app_context():
    db.create_all()