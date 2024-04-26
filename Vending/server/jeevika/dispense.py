# import RPi.GPIO as GPIO
import time


raspberry_map = [(1,11),(2,13),(3,15),(4,29),(5,31),(6,37),(7,36),(8,22),(9,18),(10,16)]



def dispense_med(medicine_id, address, quantity):
        # GPIO.setmode(GPIO.BOARD)
        

        for i in range(quantity):
            try:
                pin = raspberry_map[address-1][1]
                print(pin)
                # GPIO.setup(pin,GPIO.OUT)
                # GPIO.output(pin, GPIO.HIGH)
                # time.sleep(10)
                # GPIO.output(pin, GPIO.LOW)
                # time.sleep(5)
                
            except Exception as e:
                print(e)
                raise e
        # GPIO.cleanup()
        
