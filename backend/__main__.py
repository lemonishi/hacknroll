from flask import Flask, jsonify, request
import time
from flask_cors import CORS

# if a room does not respond in 2 minutes, mark as inactive
timeout = 120 # 2 minutes

app = Flask("Noise meter API")
CORS(app)

devices = {}

@app.route("/devices/list")
def list():
	current_time = int(time.time())
	returned_data = []
	for lamp in devices:
		if current_time - devices[lamp]["last_update"] > timeout:
			devices[lamp]["active"] = False
		final_device = dict(devices[lamp])
		final_device["lamp_id"] = lamp
		returned_data.append(final_device)
	return jsonify(devices)

@app.route("/devices/update", methods=["PUT"])
def update():
	data = request.get_json()
	lamp_id = data.get("lamp_id")
	label = data.get("label")
	value = data.get("value")
	
	if (not lamp_id) or (not value):
		return jsonify({"error": "lamp_id and value required"})
	elif lamp_id not in devices:
		devices[lamp_id] = {}
	devices[lamp_id]["label"] = label
	devices[lamp_id]["active"] = True
	devices[lamp_id]["last_update"] = int(time.time())
	
	try:
		value = float(value)
		if 0 <= value <= 100:
			devices[lamp_id]["value"] = value
		else:
			raise ValueError
	except ValueError:
		return jsonify({"error":"value must be an number from 0-100"})
	return jsonify(devices[lamp_id])

app.run(host="0.0.0.0", port=5001, debug=True)
