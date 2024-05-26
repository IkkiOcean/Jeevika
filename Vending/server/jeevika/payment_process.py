import requests
import json
import urllib.parse
import webbrowser
callback_url = "https://localhost:3000/success"  # your callback url

payload_data = {
    'key': "a87eccab-8631-47f4-aba4-11238567e968",  # replace with your live API KEY
    'client_txn_id': "0123456789",
    'amount': "10",
    'p_info': "medicines",
    'customer_name': "Jeevika",
    'customer_email': "ikki.debug@gmail.com",
    'customer_mobile': "9116532219",
    'redirect_url': callback_url
}

jsonPayloadData = json.dumps(payload_data)

headers = {
    'Content-Type': 'application/json'
}

response = requests.post('https://api.ekqr.in/api/create_order', headers=headers, data=jsonPayloadData)

res = response.json()

if res.get('status'):
    order_id = res['data']['order_id']
    payUrl = res['data']['payment_url']
    upi_hash = res['data']['upi_id_hash']
    

    webbrowser.open(payUrl)
    ('Location: ' + payUrl)
    print()
else:
    print("Error: " + res.get('message'))