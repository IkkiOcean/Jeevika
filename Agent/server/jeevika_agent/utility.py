import requests
import vonage

def sendPrescription(patient):
    message = f"""
Hello {patient['name']},

Thank you for your visit today! Your prescription is now available.

To conveniently purchase your prescribed medicines, please use the Jeevika Automatic Drug Dispenser. 
Simply click the link below to access your prescription and proceed with the purchase by scanning the QR Code:

(Access Your Prescription: )[https://jeevika.s3.eu-north-1.amazonaws.com/{patient['path']}]

If you have any questions or need further assistance, feel free to contact us.

Take care and get well soon!

Warm regards,  
Jeevika
"""
    client = vonage.Client(key="f3089296", secret="P7GCpDlnhMovkuOt")
    sms = vonage.Sms(client)
    responseData = sms.send_message(
    {
        "from": "Jeevika",
        "to": "91"+patient['mobile'],
        "text": message,
    }
    )

    if responseData["messages"][0]["status"] == "0":
        print("Message sent successfully.")
    else:
        print(f"Message failed with error: {responseData['messages'][0]['error-text']}")