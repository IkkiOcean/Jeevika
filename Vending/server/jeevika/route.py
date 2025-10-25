from flask import Flask, request,jsonify
from jeevika import app, db
from flask_cors import cross_origin
from jeevika.dispense import dispense_med
from jeevika.models import Stock, Bill, Medicine, Order
from jeevika.utils import process_bill
from jeevika.gemini import getReport
from datetime import datetime
import pytz
import base64
import os
from cashfree_pg.models.create_order_request import CreateOrderRequest
from cashfree_pg.api_client import Cashfree
from cashfree_pg.models.customer_details import CustomerDetails
from cashfree_pg.models.order_meta import OrderMeta

Cashfree.XClientId = "TEST10198495e07a6b117a8e0896e4ab59489101"
Cashfree.XClientSecret = "cfsk_ma_test_8265d1ffb19d223b33d38d8df367862d_e67ab70f"
Cashfree.XEnvironment = Cashfree.SANDBOX
x_api_version = "2023-08-01"
# from jeevika.sensor_control import startSensor
# CORS(app, resources={r"dispense": {"origins": "http://localhost:5000"}},supports_credentials=True, headers=['Content-Type', 'Authorization'])


MACHINE_ID = "007"

@app.route('/', methods = ["GET"])
@cross_origin()
def index():
    return "Welcome to Jeevika Vending Machine API", 200

@app.route('/health', methods = ["GET"])
@cross_origin()
def health_check():
    return jsonify({"status": "healthy"}), 200
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
            stock.stock_count -= meds['quantity']
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
    print(machine_id)
    stocks = Stock.query.filter_by(machine_id = machine_id)
    data_set = []
    for stock in stocks:
        data = {""
            "medicine_id" : stock.medicines.medicine_id,
            "medicine_name" : stock.medicines.medicine_name,
            "stock" : stock.stock_count,
            "price" : stock.medicines.price,
            # "image" : stock.medicines.image
        }
        data_set.append(data)
    print(data_set)
    return data_set

@app.route('/stock/<int:medicine_id>', methods = ["GET"])
@cross_origin()
def stock(medicine_id):
    stocks = Stock.query.filter_by(medicine = medicine_id)
    data_set = []
    for stock in stocks:
        data = {
            "medicine_id" : stock.medicines.medicine_id,
            "medicine_name" : stock.medicines.medicine_name,
            "stock" : stock.stock_count,
            "price" : stock.medicines.price
        }
        data_set.append(data)
    return data_set[0]

@app.route('/vitals', methods = ["GET"])
@cross_origin()
def get_vitals():
    print("Fetching vitals")
    # UNCOMMENT BELOW WHEN HARDWARE IS CONNECTED
    # temp,hr,sp = startSensor()
    # report = getReport(temp,sp,hr)
    # vital_data = {
    #     "temp" : temp,
    #     "oxygen" : sp,
    #     "heart" : hr,
    #     "report" : report,
    #     }
    # THIS IS TEST CASE
    report = getReport(36,97,120)
    vital_data = {
        "temp" : 36,
        "oxygen" : 97,
        "heart" : 120,
        "report" : report
         
    }
    
    
    # print(report)
    return vital_data




@app.route('/create-order', methods = ["POST"])
@cross_origin()
def create_order():
    order = request.get_json()
    
    # ✅ Generate unique order ID using IST datetime
    ist = pytz.timezone('Asia/Kolkata')
    current_time = datetime.now(ist)
    
    # Format: YYMMDDHHMMSS + milliseconds (last 3 digits)
    # Example: ORD-2510260148123 (25 Oct 26, 01:48:12.3)
    order_id = current_time.strftime('ORD-%y%m%d%H%M%S') + str(current_time.microsecond)[:3]
    
    # Alternative shorter format: YYMMDDHHMMSS only
    # order_id = current_time.strftime('ORD-%y%m%d%H%M%S')
    
    medicine_id = []
    medicine_qty = []
    for meds in order['medicine']:
        medicine_id.append(meds['data']['medicine_id'])
        medicine_qty.append(meds['qty'])
    
    orderDB = Order(
        order_id=order_id, 
        medicine_id=medicine_id, 
        quantity=medicine_qty
    )
    db.session.add(orderDB)
    db.session.commit()
    
    customerDetails = CustomerDetails(
        customer_id=order['orderDetail']['customer_id'], 
        customer_phone="9116532218"
    )

    createOrderRequest = CreateOrderRequest(
        order_id=order_id,
        order_amount=order['orderDetail']['amount'], 
        order_currency="INR", 
        customer_details=customerDetails
    )

    orderMeta = OrderMeta()
    orderMeta.return_url = "https://www.cashfree.com/devstudio/preview/pg/web/checkout?order_id={order_id}"
    createOrderRequest.order_meta = orderMeta

    try:
        api_response = Cashfree().PGCreateOrder(x_api_version, createOrderRequest, None, None)
        response = {
            'payment_session_id': api_response.data.payment_session_id,
            'order_id': api_response.data.order_id
        }
        print(api_response.data)
        return response, 200
    except Exception as e:
        print(e)
        return {"error": str(e)}, 500
    
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


# development routes


@app.route('/database', methods = ["GET"]) #Adds dummy data to postgress
@cross_origin()
def database():
    medicines = ['Crocin','Disprin','Vicks Action 500','Saridon','Dolo 650','Calpol 650','Omez','Digene']
    price = [20,13,58,47,34,30,64,27]
    # for i in range(1,9):
    #     filename = os.path.join('jeevika/med-images', f'image_{i}.jpg')
    #     with open(filename, 'rb') as f:
    #         image_data = f.read()
    #     base64_string = base64.encodebytes(image_data)
    #     print(base64_string)
    #     medicine = Medicine(medicine_id = i,medicine_name = medicines[i-1], price = price[i-1], tablets = 20, non_tablet = False, quantity = 100 )
    #     db.session.add(medicine)
    #     db.session.commit()
    for i in range (1,9):
        medicine = Medicine.query.filter_by(medicine_id = i).first()
        print(medicine.medicine_name)
    return "done",200
    # med = Medicine.query.filter_by(medicine_id = meds['medicine_id']).first()

@app.route('/update_machine_data',methods = ['POST'])
def add_data2():
        datas = request.get_json()
        for i in range(len(datas)):
            med = Medicine.query.filter_by(medicine_id = datas[i]['medicine_id']).first()
            stock1 = Stock(machine_id = 1,medicines = med, stock_count= 100,address = datas[i]['address'] )
            db.session.add(stock1)
            db.session.commit()
        return "success", 200

@app.route('/add_medicine',methods = ['POST'])
def add_data3():
        datas = request.get_json()
        for data in datas:
             
            med = Medicine(medicine_name = data['medicine_name'], price = data['price'], tablets = data['tablets'], non_tablet = data['non_tablet'], quantity = data['quantity'] )
            db.session.add(med)
            db.session.commit()
        return "success",200

@app.route('/add_medicines_batch', methods=['POST'])
def add_medicines_batch():
    try:
        medicines_list = request.get_json()
        
        if not isinstance(medicines_list, list):
            return {"error": "Request body must be a list"}, 400
        
        medicine_objects = []
        for data in medicines_list:
            med = Medicine(
                medicine_name=data['medicine_name'], 
                price=data['price'], 
                tablets=1 if data['tablet'] else 0,  # Convert bool to int
                non_tablet=1 if data['non_tablet'] else 0,  # Convert bool to int
                quantity=data['quantity']
            )
            medicine_objects.append(med)
        
        db.session.bulk_save_objects(medicine_objects)
        db.session.commit()
        
        return {
            "success": True, 
            "count": len(medicine_objects)
        }, 200
        
    except Exception as e:
        db.session.rollback()
        return {"error": str(e)}, 500


@app.route('/update_machine_data', methods=['POST'])
def add_machine_stock():
    try:
        data = request.get_json()
        
        # Single medicine addition
        if isinstance(data, dict):
            med = Medicine.query.filter_by(medicine_id=data['medicine_id']).first()
            if not med:
                return {"error": f"Medicine with id {data['medicine_id']} not found"}, 404
            
            stock1 = Stock(
                machine_id=data["machine_id"],
                medicines=med, 
                stock_count=data['stock'],
                address=data['address']
            )
            db.session.add(stock1)
            db.session.commit()
            return {"success": True, "message": "Stock added"}, 200
        
        # Batch addition
        elif isinstance(data, list):
            stock_objects = []
            for item in data:
                med = Medicine.query.filter_by(medicine_id=item['medicine_id']).first()
                if not med:
                    return {"error": f"Medicine with id {item['medicine_id']} not found"}, 404
                
                stock_obj = Stock(
                    machine_id=item["machine_id"],
                    medicines=med,
                    stock_count=item['stock'],
                    address=item['address']
                )
                stock_objects.append(stock_obj)
            
            db.session.bulk_save_objects(stock_objects)
            db.session.commit()
            return {"success": True, "count": len(stock_objects)}, 200
        
        else:
            return {"error": "Invalid request format"}, 400
            
    except Exception as e:
        db.session.rollback()
        return {"error": str(e)}, 500
