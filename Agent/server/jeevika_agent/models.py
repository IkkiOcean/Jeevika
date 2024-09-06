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
    tablets = db.Column(db.Integer,nullable = True)
    non_tablet = db.Column(db.Boolean, nullable = True, default= False)
    quantity = db.Column(db.Integer, nullable = True)
    machines = db.relationship('Stock', backref = 'medicines', lazy = True)
class Stock(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    machine_id = db.Column(db.Integer, unique = False, nullable = False)
    stock_count = db.Column(db.Integer, unique=False, nullable=False)
    address = db.Column(db.Integer, nullable=False)
    expire = db.Column(db.DateTime, nullable=False)
    __table_args__ = (db.UniqueConstraint('machine_id','address'),)
    medicine = db.Column(db.Integer, db.ForeignKey('medicine.id'), nullable =  False)

    def __repr__(self):
        return f"Stock('{self.medicine.medicine_id}', '{self.stock_count}', '{self.address}')"


class Patient(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, unique=True, nullable=False)
    name = db.Column(db.String(120), unique=True, nullable=False)
    sex = db.Column(db.Boolean, nullable=False)
    dob = db.Column(db.DateTime, nullable=False, default=datetime.now)
    mobile = db.Column(db.String(10), nullable= False)
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
