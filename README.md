Perfect — I’ve added that detail to the relevant sections and emphasized the role of AWS in the infrastructure. Here’s the full updated README for JEEVIKA, including placeholders for hardware images and videos.

⸻

🩺 JEEVIKA - Intelligent Automatic Drug Dispenser System

Welcome to JEEVIKA, a complete ecosystem revolutionizing healthcare delivery through an integrated automatic drug dispensing system. It bridges doctors, patients, and pharmacy automation using modern technologies such as React.js, Flask, IIoT, and embedded systems — all backed by secure cloud infrastructure using AWS.

⸻

📑 Table of Contents
	•	Project Overview
	•	System Architecture
	•	Features
	•	1. Doctor Side Software
	•	2. Prescription Delivery via SMS
	•	3. Intelligent Vital Scan with Gemini
	•	4. Over the Counter (OTC) Medicine Purchase
	•	5. Billing System via SMS
	•	6. OTC Medicine Recommendation System
	•	Tech Stack
	•	Hardware Used
	•	Setup Instructions
	•	Demo Video
	•	Screenshots & Media
	•	Software UI
	•	Hardware Images & Workflow
	•	Contributing
	•	License

⸻

🚀 Project Overview

JEEVIKA is a smart healthcare automation system that:
	•	Allows doctors to register patients and generate digital prescriptions.
	•	Uploads prescriptions securely to AWS servers.
	•	Sends the prescription to the patient’s mobile via SMS with a QR code for easy retrieval.
	•	Enables automated dispensing of medicines via a smart machine using IIoT sensors and embedded systems.
	•	Provides real-time vital checks and recommendations using Gemini APIs.
	•	Lets users purchase OTC (Over-the-Counter) medicines without prescriptions.
	•	Supports a recommendation system for quick symptom-based OTC medicine suggestions.
	•	Ensures automated billing through SMS.

⸻

🏗️ System Architecture

Doctor App (React)  --->  Flask Backend  --->  AWS Server (Prescription storage)
                                                  |
Patient Side Device (Raspberry Pi + Arduino + IIOT + Gemini)
                                                  |
                               Automatic Drug Dispenser with UI + Payment



⸻

✨ Features

1. 👨‍⚕️ Doctor Side Software
	•	Built with React.js for an intuitive user interface.
	•	Doctors can:
	•	Register new patients.
	•	Fill out prescription details.
	•	Generate a digital prescription during patient consultation.
	•	Prescriptions are securely uploaded to AWS.
	•	Integration with backend services for data synchronization.

🖼️ [Add UI screenshots here]

⸻

2. 📩 Prescription Delivery via SMS
	•	After prescription is uploaded, an SMS is sent to the patient.
	•	The SMS contains:
	•	A QR code link.
	•	Link to the prescription page.
	•	Patient can scan QR code at the machine and instantly access their prescription.

🖼️ [Add demo of QR scan flow here]

⸻

3. 🧠 Intelligent Vital Scan with Gemini
	•	Patients can check vitals on-site using:
	•	IIoT-integrated sensors (e.g., heart rate, temperature, SPO2).
	•	Arduino and Raspberry Pi hardware stack.
	•	Vital data is processed via Gemini APIs.
	•	The system:
	•	Interprets results.
	•	Provides a simple explanation and quick advice.

🖼️ [Add video/image of vital scan workflow here]

⸻

4. 💊 Over the Counter (OTC) Medicine Purchase
	•	Patients can directly:
	•	Browse available medicines on the device.
	•	Select quantity.
	•	Pay via supported payment gateway.
	•	No prescription required.
	•	Medicine is dispensed automatically.

🖼️ [Add UI of OTC medicine selection and payment here]

⸻

5. 🧾 Billing System via SMS
	•	Once the transaction is complete:
	•	The system generates a digital bill.
	•	Sends it to the customer’s mobile via SMS.
	•	Ensures paperless and secure record keeping.

⸻

6. 🔍 OTC Medicine Recommendation System
	•	Built-in symptom checker with low-risk medicine suggestions.
	•	Based on:
	•	User-selected symptoms.
	•	Frequency and severity.
	•	Promotes safe self-medication for minor conditions.

🖼️ [Add image of recommendation UI and workflow here]

⸻

🧰 Tech Stack

Layer	Technology Used
Frontend	React.js
Backend	Flask (Python)
Cloud/Storage	AWS S3 / AWS Lambda / DynamoDB
Communication	Twilio / SMS Gateway
ML API	Gemini (for vitals interpretation)
Hardware Control	Arduino, Raspberry Pi
Sensors	Heart Rate, SPO2, Temp, BP (IIoT Sensors)
OS	Linux (Raspbian on Raspberry Pi)



⸻

🧱 Hardware Used
	•	Raspberry Pi 4 (Main control unit)
	•	Arduino Uno (Sensor interface)
	•	Sensors:
	•	Pulse Sensor
	•	IR Temp Sensor
	•	SPO2 Sensor
	•	Load Cell (for pill counting)
	•	Motor Drivers for pill dispensing
	•	Touchscreen Display (for patient UI)
	•	QR Code Scanner
	•	Power Supply Module
	•	3D Printed / CNC Frame (for medicine compartmentalization)

📸 [Add detailed images of the machine, wiring, components, pill trays, and casing here]

⸻

⚙️ Setup Instructions

Doctor Side Software
	1.	Clone the frontend repo:

git clone https://github.com/yourusername/jeevika-doctor-frontend
cd jeevika-doctor-frontend
npm install
npm start


	2.	Clone the backend (Flask) repo:

git clone https://github.com/yourusername/jeevika-backend
cd jeevika-backend
pip install -r requirements.txt
python app.py


	3.	Set up AWS credentials in .env:

AWS_ACCESS_KEY=xxx
AWS_SECRET_KEY=xxx
S3_BUCKET=jeevika-prescriptions



⸻

🎥 Demo Video

📽️ [Add demo video link here (YouTube, Drive, etc.)]

⸻

🖼️ Screenshots & Media

Software UI
	•	Patient registration
	•	Prescription form
	•	QR Code generation
	•	SMS Preview

📸 [Upload images here]

⸻

Hardware Images & Workflow
	•	Vital check station setup
	•	Dispenser machine (internal view)
	•	Arduino wiring layout
	•	Medicine slot mechanism

📸 [Upload photos here]

⸻

🤝 Contributing

Feel free to fork this repo, make your own additions, and submit a pull request!

⸻

📄 License

This project is licensed under the MIT License. See LICENSE for details.

⸻

Let me know if you’d like me to create a basic folder structure with this README included or generate some demo images/mockups.