from machine import ADC, Pin
import time
import config

MIC_ADC = ADC(Pin(26))
LED = machine.Pin(22, machine.Pin.OUT)

WINDOW_MS = 50
SMOOTH_ALPHA = 0.90

SCALE = 0.008

LOUDNESS_THRESHOLD = 45.0

smoothed_level = 0.0

def clamp(x, lo, hi):
    return lo if x < lo else hi if x > hi else x    

def connect_wifi():
	import network
	import time

	wlan = network.WLAN(network.STA_IF) # Station interface
	wlan.active(True) # Activate the interface

	ssid = config.ssid # Your Wi-Fi network name (SSID)
	password = config.password # Your Wi-Fi password

	wlan.connect(ssid, password)

	# Wait for connection
	max_wait = 10
	while max_wait > 0:
			if wlan.status() < 0 or wlan.status() >= 3:
				break
			max_wait -= 1
			print('waiting for connection...')
			time.sleep(1)

		# Print connection status and IP address
		if wlan.status() != 3:
			raise RuntimeError('network connection failed')
		else:
			print('Connected to', ssid)
			print('IP Address:', wlan.ifconfig()[0])
			
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

