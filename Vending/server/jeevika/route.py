from flask import Flask, request,jsonify
from jeevika import app, db
from flask_cors import cross_origin
from jeevika.dispense import dispense_med
from jeevika.models import Stock, Bill, Medicine
from jeevika.utils import process_bill
from jeevika.sensor_control import startSensor
# CORS(app, resources={r"dispense": {"origins": "http://localhost:5000"}},supports_credentials=True, headers=['Content-Type', 'Authorization'])


MACHINE_ID = "007"

@app.route('/dispense', methods = ["POST"])
@cross_origin()
def handle_medicine():
    data = request.get_json()
    item_list = []
    print(data)
    for meds in data:
        med = Medicine.query.filter_by(medicine_id = meds['data']['medicine_id']).first()
        stock = Stock.query.filter_by(medicine = med.medicine_id).first()
        try:
            dispense_med(med.medicine_id, stock.address, meds['qty'])
            print(f"{meds['qty']} {med.medicine_name} dispensed\n")
            stock.stock_count -= meds['qty']
            db.session.commit()
            item = {
                "medicine_name" : stock.medicines.medicine_name,
                "stock" : meds['qty'],
                "price" : stock.medicines.price,
            }
            item_list.append(item)
            if stock.stock_count < 5: 
                 medicine_alaram(med.medicine_id, stock.machine_id)
        
        except Exception as e:
            print(e)
    process_bill(item_list)
    return "medicine recieved", 204

def medicine_alaram(med_id, mec_id):
    try:
        data = { 
            "machine_id" : mec_id,
            "medicine_id" : med_id
            }
        url = 'http://server.com'
        headers = {'Content-type': 'text/html; charset=UTF-8'}
        # response = requests.post(url, data=data, headers=headers)
    except:
        print("failed alarm")

@app.route('/get_data/<int:machine_id>', methods = ["GET"])
@cross_origin()
def get_data(machine_id):
    stocks = Stock.query.filter_by(machine_id = machine_id)
    data_set = []
    for stock in stocks:
        data = {
            "medicine_id" : stock.medicines.medicine_id,
            "medicine_name" : stock.medicines.medicine_name,
            "stock" : stock.stock_count,
            "price" : stock.medicines.price
        }
        data_set.append(data)
    return data_set

@app.route('/stock/<int:medicine_id>', methods = ["GET"])
@cross_origin()
def stock(medicine_id):
    stocks = Stock.query.filter_by(medicine = medicine_id)
    data_set = []
    for stock in stocks:
        data = {
            "medicine_id" : stock.medicines.id,
            "medicine_name" : stock.medicines.medicine_name,
            "stock" : stock.stock_count,
            "price" : stock.medicines.price
        }
        data_set.append(data)
    return data_set[0]

@app.route('/vitals', methods = ["GET"])
@cross_origin()
def get_vitals():
    temp = startSensor()
    vital_data = {
        "temp" : temp
    }
    return vital_data 


