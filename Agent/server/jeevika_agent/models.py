from jeevika_agent import db, app, login_manager
from datetime import datetime

from flask_login import UserMixin
from itsdangerous.url_safe import URLSafeTimedSerializer as Serializer

@login_manager.user_loader
def load_user(user_id):
    return Agent.query.get(int(user_id))

class Medicine(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    medicine_id = db.Column(db.Integer, unique=True, nullable=False)
    medicine_name = db.Column(db.String(120), unique=True, nullable=False)
    price = db.Column(db.Integer,nullable = False)
    machines = db.relationship('Stock', backref = 'medicines', lazy = True)
    
class Pateint(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    pateint_id = db.Column(db.Integer, unique=True, nullable=False)
    name = db.Column(db.String(120), unique=True, nullable=False)
    age = db.Column(db.Integer, nullable=False)
    sex = db.Column(db.Boolean, nullable=False)
    dob = db.Column(db.DateTime, nullable=False, default=datetime.now)

class Agent(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    # image_file = db.Column(db.String(20), nullable=False, default='default.jpg')
    password = db.Column(db.String(60), nullable=False)

    def get_reset_token(self, timeout = 1800):
        s = Serializer(app.config['SECRET_KEY'], timeout)
        return s.dumps({'user_id' : self.id}).decode('utf-8')
    
    @staticmethod
    def verify_reset_token(token):
        s = Serializer(app.config['SECRET_KEY'])
        try:
            user = s.loads(token)['user_id']
        except:
            return None
        return Agent.query.get(user)

    def __repr__(self):
        return f"User('{self.username}', '{self.email}')"
