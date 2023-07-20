import random
from functools import wraps
from flask import request, jsonify
import jwt
from fakeBackend.authServer import utils
import fill_data
import json
from statistics import mean
from datetime import datetime, timedelta

# User related
user_file_path = "../shared/users.txt"


def find_user_from_mail(mail: str) -> utils.User:
	user_file = open(user_file_path, "r")
	for line in user_file:
		current_user = utils.parse_user(line)
		if current_user.mail == mail:
			return current_user
	return


def json_all_users() -> str:
	result = []
	user_file = open(user_file_path, "r")
	for line in user_file:
		current_user = utils.parse_user(line)
		result.append(current_user.to_json())
	return jsonify({"userList": result})


def modify_user_role(user_id) -> None:
	users_string = read_file(user_file_path)
	users = map(utils.parse_user, users_string)
	to_write = list()
	found = False
	for user in users:
		print(user, user.id)
		if user.id == user_id:
			print(found)
			user.role = "collectivite"
			found = True
		to_write.append(user)
	if not found:
		raise ValueError("Not found")
	with open(user_file_path, 'w') as user_file:
		for user in to_write:
			user_file.write(f"{user}\n")
		user_file.close()


def delete_user(user_id) -> None:
	users_string = read_file(user_file_path)
	users = map(utils.parse_user, users_string)
	to_write = list()
	found = False
	for user in users:
		if user.id == user_id:
			found = True
		else:
			to_write.append(user)
	if not found:
		raise ValueError("Not found")
	with open(user_file_path, 'w') as user_file:
		for user in to_write:
			user_file.write(f"{user}\n")
		user_file.close()


# Token related
def token_required(f):
	def read_secret():
		secret_file = open("../shared/secret.txt", "r")
		secret = secret_file.readline().strip("\n")
		secret_file.close()
		return secret

	@wraps(f)
	def decorated(*args, **kwargs):
		token = None
		# jwt is passed in the request header
		if 'token' in request.headers:
			token = request.headers['token']
		# return 401 if token is not passed
		if not token:
			return jsonify({'message': 'Token is missing !!'}), 401

		try:
			# decoding the payload to fetch the stored details
			data = jwt.decode(token, read_secret(), algorithms=["HS256"])
			current_user = find_user_from_mail(data["mail"])

		except:
			return jsonify({
				'message': 'Token is invalid !!'
			}), 401

		# returns the current logged-in users context to the routes
		return f(current_user, *args, **kwargs)

	return decorated


# Road related
road_path = "./roads.txt"


class Road:
	def __init__(self, id: str, street: str, wear_score: int, postal_code: int, city: str, position: list) -> None:
		self.id = id
		self.street = street
		self.wear_score = wear_score
		self.postal_code = postal_code
		self.city = city
		self.position = position

	def to_json(self) -> dict:
		return {
			"id": self.id,
			"name": {"city": self.city, "postalCode": self.postal_code, "streetName": self.street},
			"wearScore": self.wear_score,
			"roadPosition": self.position,
		}


def get_road_info(id: str):
	roads = map(json.loads, read_file("roads.txt"))
	for road in roads:
		if road["id"] == id:
			return {"road": road}
	raise ValueError("Not found")


# Sensor related
sensor_path = "./sensors.txt"


class Sensor:
	def __init__(self, id: str, position: [int, int], road_id: str) -> None:
		self.id = id
		self.position = position
		self.road_id = road_id

	def to_json(self):
		return {
			"id": self.id,
			"position": self.position,
			"road_id": self.road_id,
		}


def get_sensor_presentation(sensor_id: str):
	def recover_data(sensor_id: str):
		result = {"wears": None, "usages": None}
		wears_list = map(json.loads, read_file("wears.txt"))
		for wears in wears_list:
			if wears["sensorId"] == sensor_id:
				result["wears"] = wears["wearsList"]
		usages_list = map(json.loads, read_file("usages.txt"))
		for usages in usages_list:
			if usages["sensorId"] == sensor_id:
				result["usages"] = usages["usagesList"]
		return result

	def get_future_date(n):
		current_date = datetime.now().date()
		future_date = current_date + timedelta(days=n)
		return future_date

	def get_random_usage():
		year_prediction = random.randint(10000, 1000000)
		return [year_prediction, year_prediction // 12, year_prediction // 56, year_prediction // 365]

	def get_random_wear(current):
		delta = random.uniform(0.01, 0.4)
		return [min(current + delta * 365, 100), min(current + delta * 30, 100), min(current + delta * 7, 100)
			, min(current + delta, 100)]

	result = {
		"currentWear": None,
		"position": None,
		"roadId": None,
		"data": {"factualData": [], "prediction": get_future_date(random.randint(3, 56)),
				 "usagePrediction": get_random_usage(), "wearPrediction": list()}
	}

	sensor_list = map(json.loads, read_file(sensor_path))
	wanted_sensor = None
	for sensor in sensor_list:
		if sensor["id"] == str(sensor_id):
			wanted_sensor = sensor
	result["roadId"] = wanted_sensor["roadId"]
	if wanted_sensor is None:
		raise ValueError("Sensor not found")
	data = recover_data(sensor_id)
	result['currentWear'] = data["wears"][-1]
	result["data"]["wearPrediction"] = get_random_wear(result["currentWear"])
	result["position"] = wanted_sensor["position"]

	types = {"Wear", "Usage"}
	scales = {"Jour", "Semaine", "Mois", "Années"}
	for _type in types:
		for scale in scales:
			result["data"]["factualData"].append(
				{"scaledData": read_sensor_info(sensor_id, data_type=_type, scale=scale),
				 "dataType": _type, "dataScale": scale})
	return result


def read_file(path: str):
	result = list()
	file = open(path, "r")
	for line in file:
		result.append(line.strip("\n"))
	file.close()
	return result


# usage/wear
def read_sensor_info(sensor_id: str, data_type: str, scale: str):
	def find_sensor(sensor_id: str, data_type: str):
		if data_type == "Wear":
			file = open(fill_data.wears_path, "r")
		else:
			file = open(fill_data.usages_path, "r")
		for line in file:
			current_data = json.loads(line)
			if current_data["sensorId"] == sensor_id:
				file.close()
				return current_data
		raise ValueError("Sensor not found")

	def week_aggregation():
		weeks = list()
		i = 0
		while True:
			current = data[i * 7:(i + 1) * 7:]
			if len(current) != 7:
				if len(current) > 0:
					weeks.append(current)
				break
			weeks.append(current)
			i += 1
		return weeks

	def month_aggregation():
		months = list()
		i = 0
		current_month = 0
		while True:
			if i < len(data):
				if current_month in {0, 2, 4, 6, 7, 9, 11}:  # 31 days months
					current = data[i:i + 31:]
					i += 31
				elif current_month == 1:  # febuary
					current = data[i:i + 28:]
					i += 28
				else:  # the rest
					current = data[i:i + 30]
					i += 30
				months.append(current)
				current_month = (current_month + 1) % 12
			else:
				if len(data[i::]) > 0:
					months.append(data[i::])
				break
		return months

	def year_aggregation():
		years = list()
		i = 0
		while True:
			current = data[i * 365:(i + 1) * 365:]
			if len(current) != 365:
				if len(current) > 0:
					years.append(current)
				break
			years.append(current)
			i += 1
		return years

	data = find_sensor(sensor_id, data_type)["usagesList" if data_type == "Usage" else "wearsList"]

	if scale == "Jour":  # we'll return the last week
		return data[-30:]
	elif scale == "Semaine":  # we'll return the three last weeks and the prediction for this one
		return [sum(week) for week in week_aggregation()[-9::]] if data_type == "Usage" else [mean(week) for week in
																							  week_aggregation()[-9::]]
	elif scale == "Mois":  # we'll return the 11 last months and the prediction for this one
		return [sum(month) for month in month_aggregation()[-11::]] if data_type == "Usage" else [mean(month) for month
																								  in
																								  month_aggregation()[
																								  -11::]]
	elif scale == "Années":  # we'll return every years and the prediction for this one
		return [sum(year) for year in year_aggregation()[::]] if data_type == "Usage" else [mean(year) for year in
																							year_aggregation()[::]]
