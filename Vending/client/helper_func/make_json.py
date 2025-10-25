import json
import os
from os.path import dirname

import qrcode
import base64
import json
# Data to be encoded
def gen_qr():
    filename = "./data.json"
    with open(filename, encoding="utf-8") as fp:
        data = json.load(fp)
    json_str = json.dumps(data, separators=(',', ':'))  # compact
    b64 = base64.b64encode(json_str.encode('utf-8')).decode('ascii')  # plain string
    # Or, URL-safe:
    # b64 = base64.urlsafe_b64encode(json_str.encode('utf-8')).decode('ascii')
    img = qrcode.make(b64)
    img.save('QrJeevika2.png')

    
def add_data(medicine_id,quantity):
    filename = './data.json'
    list = []
    data = {
        "medicine_id" : medicine_id,
        "quantity" : quantity
    }
    if not os.path.isfile(filename):
        list.append(data)
        with open(filename,mode='w') as f:
            f.write(json.dumps(list,indent=4))
    else:
        with open(filename) as json_file:
            file = json.load(json_file)
        
        file.append(data)
        with open(filename,mode='w') as f:
            f.write(json.dumps(file, indent=4))

    

    

    print('added to json file')


def delete_data():
    os.remove('/Volumes/Vivek Drive/heisenberg_project/jeevika/helper_func/data.json')


