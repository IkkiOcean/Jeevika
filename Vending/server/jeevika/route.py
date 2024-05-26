from flask import Flask, request,jsonify
from jeevika import app, db
from flask_cors import cross_origin
from jeevika.dispense import dispense_med
from jeevika.models import Stock, Bill, Medicine, Order
from jeevika.utils import process_bill
from jeevika.gemini import getReport
# from jeevika.sensor_control import startSensor
# CORS(app, resources={r"dispense": {"origins": "http://localhost:5000"}},supports_credentials=True, headers=['Content-Type', 'Authorization'])


MACHINE_ID = "007"

@app.route('/dispense', methods = ["POST"])
@cross_origin()
def handle_medicine():
    data = request.get_json()
    item_list = []
    print(data)
    for meds in data:
        med = Medicine.query.filter_by(medicine_id = meds['medicine_id']).first()
        stock = Stock.query.filter_by(medicine = med.medicine_id).first()
        try:
            dispense_med(med.medicine_id, stock.address, meds['quantity'])
            print(f"{meds['quantity']} {med.medicine_name} dispensed\n")
            stock.stock_count -= meds['qty']
            db.session.commit()
            item = {
                "medicine_name" : stock.medicines.medicine_name,
                "stock" : meds['quantity'],
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
        data = {""
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
    # temp,hr,sp = startSensor()
    # report = getReport(temp,sp,hr)
    # vital_data = {
    #     "temp" : temp,
    #     "oxygen" : sp,
    #     "heart" : hr,
    #     "report" : report,
    #     }
    report = getReport(40,97,120)
    vital_data = {
        "temp" : 36,
        "oxygen" : 97,
        "heart" : 101,
        "report" : report
         
    }
    
    
    # print(report)
    return vital_data

from cashfree_pg.models.create_order_request import CreateOrderRequest
from cashfree_pg.api_client import Cashfree
from cashfree_pg.models.customer_details import CustomerDetails
from cashfree_pg.models.order_meta import OrderMeta

Cashfree.XClientId = "TEST10198495e07a6b117a8e0896e4ab59489101"
Cashfree.XClientSecret = "cfsk_ma_test_8265d1ffb19d223b33d38d8df367862d_e67ab70f"
Cashfree.XEnvironment = Cashfree.SANDBOX
x_api_version = "2023-08-01"


@app.route('/create-order', methods = ["POST"])
@cross_origin()
def create_order():
        order = request.get_json()
        # print(order)
        obj = db.session.query(Order).order_by(Order.id.desc()).first()
        if obj == None:
            order_id = 1
        else:
            order_id = obj.id + 1
        medicine_id = []
        medicine_qty = []
        for meds in order['medicine']:
            medicine_id.append(meds['data']['medicine_id'])
            medicine_qty.append(meds['qty'])
        orderDB = Order(order_id = f'Order-{str(order_id)}', medicine_id = medicine_id, quantity = medicine_qty)
        db.session.add(orderDB)
        db.session.commit()
        
        customerDetails = CustomerDetails(customer_id=order['orderDetail']['customer_id'], customer_phone="9116532218")

        createOrderRequest = CreateOrderRequest(order_id=f'Order-{str(order_id)}', order_amount=order['orderDetail']['amount'], order_currency="INR", customer_details=customerDetails)

        orderMeta = OrderMeta()
        orderMeta.return_url = "https://www.cashfree.com/devstudio/preview/pg/web/checkout?order_id={order_id}";
        createOrderRequest.order_meta = orderMeta

        try:
            api_response = Cashfree().PGCreateOrder(x_api_version, createOrderRequest, None, None)
            response = {
                'payment_session_id' : api_response.data.payment_session_id,
                'order_id' : api_response.data.order_id
            }
            print(api_response.data)
            # type(api_response.data)
            return response , 200
        except Exception as e:
            print(e)
            # return "error" , 404
        return "done", 200

@app.route('/fetch-order')
@cross_origin()
def fetch_order():
    print("hello")
    order_id = request.args.get('id')
    order = db.session.query(Order).filter(Order.order_id == order_id).first()
    print(order)
    orderDetail = {
        'order_id' : order.order_id,
        'medicine_id' : order.medicine_id,
        'quantity' : order.quantity
    }
    print(orderDetail)
    return orderDetail,200



