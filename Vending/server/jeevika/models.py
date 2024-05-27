from jeevika import db
from datetime import datetime




class Medicine(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    medicine_id = db.Column(db.Integer, unique=True, nullable=False)
    medicine_name = db.Column(db.String(120), unique=True, nullable=False)
    price = db.Column(db.Integer,nullable = False)
    image = db.Column(db.String,nullable = True)
    machines = db.relationship('Stock', backref = 'medicines', lazy = True)
    

class Stock(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    machine_id = db.Column(db.Integer, unique = False, nullable = False)
    stock_count = db.Column(db.Integer, unique=False, nullable=False)
    address = db.Column(db.Integer, nullable=False)
    __table_args__ = (db.UniqueConstraint('machine_id','address'),)
    medicine = db.Column(db.Integer, db.ForeignKey('medicine.id'), nullable =  False)

    def __repr__(self):
        return f"Stock('{self.medicine.medicine_id}', '{self.stock_count}', '{self.address}')"

class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.String(120), unique = True, nullable = False)
    medicine_id = db.Column(db.ARRAY(db.Integer), unique=False, nullable=False)
    quantity = db.Column(db.ARRAY(db.Integer), nullable=False)
    # __table_args__ = (db.UniqueConstraint('machine_id','address'),)
    # medicine = db.Column(db.Integer, db.ForeignKey('medicine.id'), nullable =  False)

    def __repr__(self):
        return f"Order('{self.id}', '{self.medicine_id}', '{self.quantity}')"


class Bill(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    medicine_id = db.Column(db.Integer, nullable=False)
    amount = db.Column(db.Integer, nullable=False)
    date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    def __repr__(self):
        return f"Bill('{self.name}', '{self.amount}')"