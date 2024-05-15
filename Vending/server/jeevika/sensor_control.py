from multiprocessing import Process, Value
import RPi.GPIO as GPIO
import jeevika.max30102 as max30102
import jeevika.hrcalc as hrcalc
GPIO.setmode(GPIO.BCM)

m = max30102.MAX30102()

hr2 = 0
sp2 = 0
sensor = 24

GPIO.setup(sensor,GPIO.IN)
def startSensor():
    print('sensor control')
    complete = False
    while not complete:
        
        temp_data = Value('i', 0)
        hr_data = Value('i',0)
        sp_data = Value('i',0)
        temp = Process(target=read_temp, args = (temp_data,))
        oxy = Process(target=read_oxy,args = (hr_data,sp_data,))
        print("entered while not complete")
        try:
            if not GPIO.input(sensor):
                    print('sensor start')
                    temp.start()
                    oxy.start()
                    while temp.is_alive() or oxy.is_alive() or not GPIO.input(sensor):
                        if not temp.is_alive() and not oxy.is_alive():
                            temp.join()
                            oxy.join()
                            print("done")
                            return temp_data.value,hr_data.value,sp_data.value
                        if GPIO.input(sensor):
                            oxy.kill()
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
        tempC= int(sensor.get_obj_temp())
        data.value = tempC
        bus.close()
        print('done')
    except:
        raise Exception('error')
    
def read_oxy(hr_data,sp_data):
    red, ir = m.read_sequential()
    
    hr,hrb,sp,spb = hrcalc.calc_hr_and_spo2(ir, red)

    print("hr detected:",hrb)
    print("sp detected:",spb)
    
    if(hrb == True and hr != -999):
        hr2 = int(hr)
        hr_data.value = hr2
        print("Heart Rate : ",hr2)
    if(spb == True and sp != -999):
        sp2 = int(sp)
        sp_data.value = sp2
        print("SPO2       : ",sp2)


