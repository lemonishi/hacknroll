from machine import ADC, Pin
import time

import network
import socket
from time import sleep
import machine
import rp2
import sys
import config
import urequests as requests

MIC_ADC = ADC(Pin(26))
LED = machine.Pin(22, machine.Pin.OUT)

WINDOW_MS = 50
SMOOTH_ALPHA = 0.90

SCALE = 0.008

LOUDNESS_THRESHOLD = 45.0

smoothed_level = 0.0

def clamp(x, lo, hi):
    return lo if x < lo else hi if x > hi else x

def connect():
    network.hostname(config.uuid)
    #Connect to WLAN
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    wlan.connect(config.ssid, config.password)
    while wlan.isconnected() == False:
        if rp2.bootsel_button() == 1:
            sys.exit()
        print('Waiting for connection...')
        #pico_led.on()
        sleep(0.5)
        #pico_led.off()
        sleep(0.5)
    ip = wlan.ifconfig()[0]
    print(f'Connected on {ip}')
    #pico_led.on()
    return ip

def post_reading(level, is_loud):
    url = config.server_ip + "/api/reading"
    payload = {
        "lamp_id": config.uuid,
        "level": level,
        "is_loud": is_loud
    }

    try:
        requests.post(url, json=payload, timeout=0.1) # Short timeout
        print("Data sent")
    except OSError as e:
        print(f"Network error: {e}")
    except Exception as e:
        print(f"Other error: {e}")

def loop():
    smoothed_level = 0.0
    
    while True:
        start = time.ticks_ms()
        min_val = 65535
        max_val = 0

        # Collect min/max for WINDOW_MS
        while time.ticks_diff(time.ticks_ms(), start) < WINDOW_MS:
            v = MIC_ADC.read_u16()
            if v < min_val:
                min_val = v
            if v > max_val:
                max_val = v

        peak_to_peak = max_val - min_val

        # EMA smoothing
        smoothed_level = (SMOOTH_ALPHA * smoothed_level) + ((1.0 - SMOOTH_ALPHA) * peak_to_peak)

        # Map to 0..100
        level_pct = clamp(smoothed_level * SCALE, 0.0, 100.0)

        print("{:.1f}%".format(level_pct))
        too_loud = level_pct > LOUDNESS_THRESHOLD
        
        if too_loud:
            print("Too loud!")
            LED.toggle()
        else:
            print("It is peaceful and quiet.")
            LED.value(0)
        post_reading("{:.1f}%".format(level_pct), too_loud)
        time.sleep_ms(50)

def main():
    connect()
    loop()
    
main()
