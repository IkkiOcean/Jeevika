# import RPi.GPIO as GPIO
import time


raspberry_map = [(1,17),(2,23),(3,24),(4,6)]
input_pin = [27,22,16,5]


def dispense_med(medicine_id, address, quantity):
        # GPIO.setmode(GPIO.BCM)
        

        for i in range(quantity):
            try:
                pin = raspberry_map[address-1][1]
                print(pin)
                # GPIO.setup(pin,GPIO.OUT)
                # GPIO.output(pin, GPIO.HIGH)
                # time.sleep(1)
                # while(GPIO.input(input_pin[address-1]) == GPIO.LOW):
                #      print("dispensing")
                # print("dispensed successfully!")
                # time.sleep(1)
                
            except Exception as e:
                raise e
        # GPIO.cleanup()
        
