from flask import Flask, request,jsonify, render_template, url_for, redirect, flash
from jeevika_agent import app, db, mail, bcrypt
from flask_cors import cross_origin
# from flask_login import login_user, current_user, logout_user, login_required
from jeevika_agent.models import Agent, Medicine, Patient
from jeevika_agent.form import InventoryForm, LoginForm, UpdateAccountForm, RequestResetForm,ResetPasswordForm
from flask_mail import Message
import requests
import img2pdf
from PIL import Image
import os
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
import base64
import io
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

    
# @app.route('/update_machine',methods = ['POST','GET'])

# def add_data():
#     forms = InventoryForm()
#     if request.method == "POST":
#         # stock1 = Stock(medicine_id = data['id'],medicine_name = data['name'], stock_count= data['count'],address = data['address'] )
#         for form in forms.inputfield:
#             if Stock.query.filter_by(medicine = form.medicine_id.data).first():
#                 stock = Stock.query.filter_by(medicine = form.medicine_id.data).first()
#                 stock.stock_count = form.stock_count.data
#                 stock.address = form.address.data
#             else:
#                 stock = Stock(machine_id = forms.machine_id.data, medicine = form.medicine_id.data, stock_count = 
#                           form.stock_count.data, address = form.address.data)
            
#                 db.session.add(stock)
#             db.session.commit()
        
#         flash("The inventory has been updated!", "success")
#         return render_template("layout.html",title = "Home")
   
#     return render_template("form.html", forms = forms, title = "Inventory Update")

# def send_reset_email(user):
#     token = user.get_reset_token()
#     msg = Message('Password Reset Request', sender='ikki.debug@gmail.com', recipients=[user.email])
#     msg.body = f'''To reset your password, visit the following link:
#     {url_for('reset_token', token = token, _external =True)}
#     if you didnt make this request then simply ignore this email'''
#     mail.send(msg)

# @app.route("/login", methods = ['GET', 'POST'])
# def login():
#     if current_user.is_authenticated:
#         print("jl")
#         return redirect(url_for('home'))
#     form = LoginForm()
#     if form.validate_on_submit():
#         user = Agent.query.filter_by(email = form.email.data).first()
#         if user and bcrypt.check_password_hash(user.password, form.password.data):
#             login_user(user, remember= form.remember.data)
#             next_page = request.args.get('next')

#             return redirect(next_page) if next_page else redirect(url_for('home'))
#         else:
#             flash('Login unsuccessfull. Please check your email and password', 'danger')

        
#     return render_template('login.html',title = 'Login',form = form)

# @app.route("/logout")
# @login_required
# def logout():
#     logout_user()
#     return redirect(url_for('home'))


# @app.route("/account", methods = ['GET', 'POST'])
# @login_required
# def account():
#     form = UpdateAccountForm()
#     if form.validate_on_submit():
#         # if form.picture.data:
#         #     picture_file = save_picture(form.picture.data)
#         #     current_user.image_file = picture_file
#         #     db.session.commit()
#         current_user.username = form.username.data
#         current_user.email = form.email.data
#         db.session.commit()
#         flash('Your account has been updated!', 'success')
#         return redirect(url_for('account'))
#     elif request.method == 'GET':
#         form.username.data = current_user.username
#         form.email.data = current_user.email
#     # image_file = url_for('static', filename = 'profile_pics/' + current_user.image_file)
#     return render_template('account.html', title = 'Account', form = form)





# @app.route("/reset_password", methods=['GET','POST'])
# def reset_request():
#     if current_user.is_authenticated:
#         return redirect(url_for('home'))
#     form = RequestResetForm()
#     if form.validate_on_submit():
#         user = Agent.query.filter_by(email= form.email.data).first()
#         print(user)
#         send_reset_email(user)
#         flash("Check your email to reset your password", 'info')
#         return redirect(url_for('login'))
#     return render_template('reset_request.html',form = form, title = 'Forgot Password')

# @app.route("/reset_password/<token>", methods=['GET','POST'])
# def reset_token(token):
#     if current_user.is_authenticated:
#         return redirect(url_for('home'))
    
#     user = Agent.verify_reset_token(token)
#     if user is None:
#         flash("The link is expired or invalid", 'warning')
#         return redirect(url_for('reset_request'))
#     form = ResetPasswordForm()
#     if form.validate_on_submit():
#         hashed_password = bcrypt.generate_password_hash(form.password.data).decode('utf-8')
#         user.password = hashed_password
#         db.session.commit()
#         flash (f'Your password has been updated. You can now login!', 'success')
#         return redirect(url_for('login'))

        
#     return render_template('reset_token.html',title = 'Reset Password', form = form)




# register
@app.route('/add_medicine',methods = ['POST'])
def add_data2():
        data = request.get_json()
        med = Medicine(medicine_name = data['medicine_name'], price = data['price'], tablets = data['tablet'], non_tablet = data['non_tablet'], quantity = data['quantity'] )
        db.session.add(med)
        db.session.commit()
        return "success",200


# @app.route('/update_machine_data',methods = ['POST'])
# def add_data2():
#         data = request.get_json()
#         med = Medicine.query.filter_by(medicine_id = data['medicine_id']).first()
#         stock1 = Stock(machine_id = data["machine_id"],medicines = med, stock_count= data['stock'],address = data['address'] )
#         db.session.add(stock1)
#         db.session.commit()
#         return "success", 200
   

# def register():
#             password = "PasswordForAgent"
#             email = "vivekprakashindia@gmail.com"
#             username = "Agent1"
#         # if verify_email(form.email.data):
#             hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
#             user = Agent(username = username, email = email, password = hashed_password)
#             db.session.add(user)
#             db.session.commit()
#             print(f'Your account has been created for {username}. You can now login!', 'success')
            
import requests
import vonage

def sendPrescription(patient):
        message = f"""
Hello {patient['name']},
Thank you for your visit today! Your prescription is now available.
Access Your Prescription: https://jeevika.s3.eu-north-1.amazonaws.com/{patient['path']}
Take care and get well soon!
Warm regards,  
Jeevika
"""
        client = vonage.Client(key="f3089296", secret="P7GCpDlnhMovkuOt")
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
