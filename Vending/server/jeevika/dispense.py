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
                # GPIO.setup(input_pin[address-1],GPIO.IN)
                # GPIO.output(pin, GPIO.HIGH)
                # start = time.time()
                # time.sleep(0.05)
                # GPIO.output(pin,GPIO.LOW)
                # while True:
                #     curr = time.time()
                    # if(GPIO.input(input_pin[address-1]) == GPIO.HIGH):
                    #     print("dispensed")
                    #     break
                    # if (start - time.time() > 3):
                    #     raise e
                        # break

                print("dispensed successfully!")
                # GPIO.cleanup()
                time.sleep(0.5)
                
            except Exception as e:
                raise e
        
        
