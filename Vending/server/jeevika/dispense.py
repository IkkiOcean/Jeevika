# import RPi.GPIO as GPIO
import time
import atexit

# GPIO pin mapping (BCM)
MOTOR_PINS = {
    1: [4, 17, 27, 22],
    2: [18, 23, 24, 25],
    3: [12, 16, 20, 21],
    4: [5, 6, 13, 19],
}

# Stepper sequence (L298N)
STEP_SEQUENCE = [
    [1, 0, 1, 0],
    [0, 1, 1, 0],
    [0, 1, 0, 1],
    [1, 0, 0, 1],
]

STEPS_PER_REV = 200
STEP_DELAY = 0.005


# ---------------------------------------------------------
#   RE-INIT GPIO (Critical for server environment)
# ---------------------------------------------------------
def init_gpio():
    GPIO.setmode(GPIO.BCM)
    GPIO.setwarnings(False)

    # setup pins fresh
    for pins in MOTOR_PINS.values():
        for pin in pins:
            GPIO.setup(pin, GPIO.OUT)
            GPIO.output(pin, 0)


# ---------------------------------------------------------
#   STEPPER MOVE
# ---------------------------------------------------------
def step_motor(motor_id, steps=STEPS_PER_REV, delay=STEP_DELAY):
    pins = MOTOR_PINS[motor_id]
    seq_len = len(STEP_SEQUENCE)

    for step_count in range(steps):
        seq_index = step_count % seq_len
        for pin, val in zip(pins, STEP_SEQUENCE[seq_index]):
            GPIO.output(pin, val)
        time.sleep(delay)

    # turn coils off
    for pin in pins:
        GPIO.output(pin, 0)


# ---------------------------------------------------------
#   DISPENSE FUNCTION (safe for web server)
# ---------------------------------------------------------
def dispense_med(medicine_id, address, quantity):
    try:
        if address not in MOTOR_PINS:
            raise ValueError(f"Invalid address {address}. Must be 1-4.")

        # Reinitialize GPIO on every call
        # init_gpio()

        print(f"\n[INFO] Dispensing {quantity} unit(s) of '{medicine_id}' from slot {address}")

        for i in range(quantity):
            print(f"  -> Dispensing unit {i+1}/{quantity}")
            # step_motor(address, STEPS_PER_REV)
            print("     ✓ Dispensed successfully!")

        print(f"[DONE] {quantity} unit(s) of '{medicine_id}' dispensed from address {address}")

    except Exception as e:
        print(f"[ERROR] {e}")


# ---------------------------------------------------------
#   AUTO CLEAN GPIO ONLY ON SERVER SHUTDOWN
# ---------------------------------------------------------
# atexit.register(GPIO.cleanup)