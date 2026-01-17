from machine import ADC, Pin
import time

MIC_ADC = ADC(Pin(26))

WINDOW_MS = 50
SMOOTH_ALPHA = 0.90

SCALE = 0.008

LOUDNESS_THRESHOLD = 45.0

smoothed_level = 0.0

def clamp(x, lo, hi):
    return lo if x < lo else hi if x > hi else x

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
    else:
        print("It is peaceful and quiet.")

    time.sleep_ms(50)

