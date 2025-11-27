from flask import Flask, request,jsonify
from jeevika_agent import app, db
from flask_cors import cross_origin
from jeevika_agent.models import Medicine, Patient
import requests
import vonage
from PIL import Image
import os
import base64
import io
from dotenv import load_dotenv
load_dotenv()
@app.route('/fetch_data/<int:machine_id>', methods = ['GET'])
@cross_origin()
def fetch_data(machine_id):
    # data = request.get_json()
    # print(data)
    print(machine_id)
    data_set = {
            "medicine" : "okay"
    }
    return data_set

@app.route('/fetch_medicine_name', methods = ['GET'])
@cross_origin()
def fetch_medname():
        meds = Medicine.query.all()
        med_list = []
        for med in meds:
               med_dict = {
                      'id': med.medicine_id,
                      'name': med.medicine_name
                      }
               med_list.append(med_dict)
        return jsonify(med_list)

@app.route('/fetch_patientlist', methods = ['GET'])
@cross_origin()
def fetch_patname():
        patients = Patient.query.all()
        patient_list = []
        for patient in patients:
                patient_dict = {
                'id': patient.patient_id,
                'name': patient.name,
                'sex': patient.sex,
                'dob': patient.dob,
                'mobile': patient.mobile
                }
                patient_list.append(patient_dict)
        return jsonify(patient_list)

@app.route('/add_patient',methods = ['POST'])
@cross_origin()
def add_patient():
        data = request.get_json()
        print(data)
        try:
                pat = Patient(name = data['name'], sex = data['sex'], dob = data['dob'], mobile = data['mobile'])
                db.session.add(pat)
                db.session.commit()
                return jsonify({'message': 'Patient added successfully', 'id': pat.to_dict()}), 200  
        except Exception as e:
                db.session.rollback()
                return jsonify({'message': 'Error adding patient', 'error': str(e)}), 400
@app.route('/delete_patient', methods=['DELETE'])
@cross_origin()
def delete_patient():
    data = request.get_json()
    try:
        name = data['name']
        patient = Patient.query.filter_by(name=name).first()

        if patient:
            db.session.delete(patient)
            db.session.commit()
            return jsonify({'message': f'Patient "{name}" deleted successfully'}), 200
        else:
            return jsonify({'message': f'No patient found with name "{name}"'}), 404

    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Error deleting patient', 'error': str(e)}), 400
@app.route('/drop_patient_table', methods=['DELETE'])
@cross_origin()
def drop_patient_table():
    try:
        Patient.__table__.drop(db.engine)  # Drops the entire table
        return jsonify({'message': 'Patient table dropped successfully.'}), 200
    except Exception as e:
        return jsonify({'message': 'Error dropping patient table', 'error': str(e)}), 400

@app.route('/upload_pdf', methods=['POST'])
@cross_origin()
def upload_pdf():
    data = request.get_json()
    try:
        img_data = data['img']
        while len(img_data) % 4 != 0:
            img_data += '='
        img = base64.b64decode(img_data)
        
        image = Image.open(io.BytesIO(img))
        path = f'prescription_{data["patientId"]}_{data["date"]}.pdf'
        path = path.replace("/",".")
        image.save(path)
        file = open(path,'rb')  # Open in binary mode
        headers = {
            'x-amz-acl': 'public-read',
            'Content-Type': 'application/pdf'
        }
        bucket_name = 'jeevika'
        amz_url = os.environ.get("AMAZON_URL")
        url = f'{amz_url}/put/{bucket_name}/{path}'
        try:
              
                response = requests.put(url, data=file,headers=headers)
        except Exception as e:
              return 'Error uploading PDF', 500
        patient = {
              'date': data['date'],
              'mobile' : data['mobile'],
              'name' : data['name'],
              'path' : path
        }
        pres_response = sendPrescription(patient)
        print("hello")
        
        return "successfull", 200
    except Exception as e:
        print(e)
        return 'Error uploading PDF', 500

 
# register
@app.route('/add_medicine',methods = ['POST'])
def add_data2():
        data = request.get_json()
        med = Medicine(medicine_name = data['medicine_name'], price = data['price'], tablets = data['tablet'], non_tablet = data['non_tablet'], quantity = data['quantity'] )
        db.session.add(med)
        db.session.commit()
        return "success",200


def sendPrescription(patient, awsurl):
        message = f"""
Hello {patient['name']},
Thank you for your visit today! Your prescription is now available.
Access Your Prescription: {awsurl}/{patient['path']}
Take care and get well soon!
Warm regards,  
Jeevika
"""
        client = vonage.Client(key="f3089296", secret="")
        sms = vonage.Sms(client)
        responseData = sms.send_message(
        {
                "from": "Vonage APIs",
                "to": "91"+patient['mobile'],
                "text": message,
        }
        )

        if responseData["messages"][0]["status"] == "0":
                print("Message sent successfully.")
        else:
                print(f"Message failed with error: {responseData['messages'][0]['error-text']}")

