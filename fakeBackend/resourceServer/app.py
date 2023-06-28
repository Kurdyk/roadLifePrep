from flask import Flask, make_response, jsonify
from flask_cors import CORS
import utils

app = Flask(__name__)
CORS(app)

@app.route("/accessRoute", methods=["GET"])
@utils.token_required
def accessRoute(current_user):
    return make_response(jsonify({"Text":"CHAMPIONS"}), 200)

@app.route("/users", methods=["GET"])
@utils.token_required
def users(current_user):
    users = utils.json_all_users()
    return make_response(jsonify({"content":users}), 200)

@app.route("/roads", methods=["GET"])
def roads():
    roads = utils.read_file("./roads.txt")
    return make_response(jsonify({"content":roads}), 200)

@app.route("/sensors", methods=["GET"])
def sensors():
    sensors = utils.read_file("./sensors.txt")
    return make_response(jsonify({"content":sensors}), 200)

@app.route("/sensor/<sensor_id>/<data_type>/<scale>", methods=["GET"])
def sensors_info(sensor_id, data_type, scale):
    try:
        return make_response(jsonify({"content":utils.read_sensor_info(int(sensor_id), data_type, scale),
                                      "sensorInfo":utils.get_sensor_presentation(sensor_id)}), 200)
    except ValueError as e:
        print(e)
        return make_response(jsonify({"message":"Sensor not found"}), 404)
    
if __name__ == "__main__":
    app.run(host="localhost", port=5555, debug=True)