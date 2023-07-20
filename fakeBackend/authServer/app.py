from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
import utils

app = Flask(__name__)
CORS(app)


@app.route("/login", methods=["POST"])
def login():
    json = request.get_json()
    try:
        user = utils.parse_json(json)
    except ValueError:
        return jsonify("Bad request"), 400
    try:
        user = utils.verify_login(user)
        token = utils.generate_token(user)
    except ValueError:
        return jsonify("Invalid password"), 401
    except KeyError:
        return jsonify("User not found"), 404
    return make_response(jsonify({"token":token}), 200)


@app.route("/register", methods=["POST"])
def register():
    json = request.get_json()
    print(f"received : {json}")
    user = utils.parse_json(json)
    print("parsed")
    try:
        utils.add_new_user(user)
        token = utils.generate_token(user)
    except ValueError as err:
        return jsonify("User already exists"), 409
    return make_response(jsonify({"token": token}), 201)

if __name__ == "__main__":
    app.run(host="localhost", port=4444, debug=True)