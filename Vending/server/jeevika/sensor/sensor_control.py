from multiprocessing import Process, Value
import RPi.GPIO as GPIO
GPIO.setmode(GPIO.BOARD)
sensor = 16

GPIO.setup(sensor,GPIO.IN)
def startSensor():
    print('sensor control')
    complete = False
    while not complete:
        
        data = Value('i', 0)
        temp = Process(target=read_temp, args = (data,))
        try:
            if not GPIO.input(sensor):
                    print('sensor start')
                    temp.start()
                    while temp.is_alive() or not GPIO.input(sensor):
                        if not temp.is_alive():
                            temp.join()
                            print("done")
                            print(data.value)
                            return data.value
                        if GPIO.input(sensor):
                            
                            temp.kill()
                            print("finger removed")
                            break
                            
        except():
            print('error')
            return
                
        
       

from smbus2 import SMBus
from mlx90614 import MLX90614

import time
def read_temp(data):
    try: 
        print('read_temp ')
        bus = SMBus(1)
        sensor = MLX90614(bus, address=0x5A)
        time.sleep(5)
        print ("Ambient Temperature :", sensor.get_amb_temp())
        print ("Object Temperature :",sensor.get_obj_temp())
        data.value = sensor.get_obj_temp()
        bus.close()
        print('done')
    except:
        raise Exception('error')
		
startSensor()

