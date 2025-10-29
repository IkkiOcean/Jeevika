# import RPi.GPIO as GPIO
# import time

# # GPIO pin mapping (BCM)
# MOTOR_PINS = {
#     1: [4, 17, 27, 22],
#     2: [5, 6, 13, 19],
#     3: [18, 23, 24, 25],
#     4: [12, 16, 20, 21],
# }

# # Full-step sequence for stepper motor
# STEP_SEQUENCE = [
#     [1, 0, 1, 0],
#     [0, 1, 1, 0],
#     [0, 1, 0, 1],
#     [1, 0, 0, 1],
# ]

# STEPS_PER_REV = 200    # steps per full revolution
# STEP_DELAY = 0.005     # control motor speed

# # GPIO setup
# GPIO.setmode(GPIO.BCM)
# GPIO.setwarnings(False)

# for pins in MOTOR_PINS.values():
#     for pin in pins:
#         GPIO.setup(pin, GPIO.OUT)
#         GPIO.output(pin, 0)


# def step_motor(motor_id, steps=STEPS_PER_REV, delay=STEP_DELAY):
#     """Rotate a specific motor by given steps."""
#     pins = MOTOR_PINS[motor_id]
#     seq_len = len(STEP_SEQUENCE)
#     for step_count in range(steps):
#         seq_index = step_count % seq_len
#         for pin, val in zip(pins, STEP_SEQUENCE[seq_index]):
#             GPIO.output(pin, val)
#         time.sleep(delay)
#     for pin in pins:
#         GPIO.output(pin, 0)


def dispense_med(medicine_id, address, quantity):
#     """
#     Dispense a given quantity of medicine from a specific address.
#     Each revolution represents one unit dispensed.
#     """
#     try:
#         if address not in MOTOR_PINS:
#             raise ValueError(f"Invalid address {address}. Must be 1–4.")
        
        print(f"\n[INFO] Dispensing {quantity} unit(s) of medicine '{medicine_id}' from slot {address}")

#         for i in range(quantity):
#             print(f"  -> Dispensing unit {i+1}/{quantity}")
#             step_motor(address, STEPS_PER_REV)
#             print("     ✅ Dispensed successfully!")
#             time.sleep(0.5)  # short delay between each dispense

#         print(f"[DONE] {quantity} unit(s) of '{medicine_id}' dispensed from address {address}")

#     except Exception as e:
#         print(f"[ERROR] {e}")

#     finally:
#         GPIO.cleanup()
#         print("GPIO cleaned up.")
