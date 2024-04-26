import json
import os
from os.path import dirname

import qrcode
import base64
import json
# Data to be encoded
def gen_qr():

    filename = "/Volumes/Vivek Drive/heisenberg_project/jeevika/helper_func/data.json"
    
    with open(filename) as fp:
        data = json.load(fp)
        data = json.dumps(data)
        byte_data = data.encode('utf-8')
    
    encoded_data = base64.b64encode(byte_data)
    # Encoding data using make() function
    img = qrcode.make(encoded_data)

    # Saving as an image file
    img.save('QrJeevika.png')

    
def add_data(medicine_id,quantity):
    filename = '/Volumes/Vivek Drive/heisenberg_project/jeevika/helper_func/data.json'
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


