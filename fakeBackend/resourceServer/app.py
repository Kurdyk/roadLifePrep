from flask import Flask, make_response, jsonify, request
from flask_cors import CORS
import utils

app = Flask(__name__)
CORS(app)


@app.route("/accessRoute", methods=["GET"])
@utils.token_required
def accessRoute(current_user):
	return make_response(jsonify({"Text": "CHAMPIONS"}), 200)


@app.route("/users", methods=["GET"])
@utils.token_required
def users(current_user):
	users = utils.json_all_users()
	return make_response(users, 200)


@app.route("/users/<user_id>", methods=["PUT", "DELETE"])
@utils.token_required
def modify_user(user, user_id):
	if request.method == "PUT":
		try:
			utils.modify_user_role(user_id)
			return make_response(jsonify({"message":"Modification done"}), 200)
		except ValueError:
			return make_response(jsonify({"message": "User not found"}), 404)
	elif request.method == "DELETE":
		try:
			utils.delete_user(user_id)
			return make_response(jsonify({"message":"Modification done"}), 200)
		except ValueError:
			return make_response(jsonify({"message": "User not found"}), 404)

@app.route("/roads", methods=["GET"])
def roads():
	roads = utils.read_file("./roads.txt")
	return make_response(jsonify({"roadList": roads}), 200)


@app.route("/roads/<id>", methods=["GET"])
def road_info(id):
	try:
		road = utils.get_road_info(id)
		return make_response(jsonify(road), 200)
	except ValueError:
		return make_response(jsonify({"message": "Road not found"}), 404)


@app.route("/sensors", methods=["GET"])
def sensors():
	sensors = utils.read_file("./sensors.txt")
	return make_response(jsonify({"sensorList": sensors}), 200)


@app.route("/sensors/<sensor_id>", methods=["GET"])
def sensors_info(sensor_id):
	try:
		return make_response(jsonify({"sensor": utils.get_sensor_presentation(sensor_id)}), 200)
	except ValueError as e:
		return make_response(jsonify({"message": "Sensor not found"}), 404)


if __name__ == "__main__":
	app.run(host="localhost", port=5555, debug=True)
