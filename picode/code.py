from machine import ADC, Pin
import time
import config

import network
import socket
from time import sleep
import machine
import rp2
import sys

MIC_ADC = ADC(Pin(26))
LED = machine.Pin(22, machine.Pin.OUT)

WINDOW_MS = 50
SMOOTH_ALPHA = 0.90

SCALE = 0.008

LOUDNESS_THRESHOLD = 45.0

smoothed_level = 0.0

ssid = 'OPPO'
password = '12340000'

def clamp(x, lo, hi):
    return lo if x < lo else hi if x > hi else x

def connect():
    #Connect to WLAN
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    wlan.connect(ssid, password)
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

def loop():
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

        if level_pct > LOUDNESS_THRESHOLD:
            print("Too loud!")
            LED.toggle()
        else:
            print("It is peaceful and quiet.")
            LED.value(0)

        time.sleep_ms(50)

def main():
    connect()
    
main()
