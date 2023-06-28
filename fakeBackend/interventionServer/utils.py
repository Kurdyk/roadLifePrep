from functools import wraps

from flask import jsonify, request
import jwt

# Token related
def collectivity_token_required(f):

    def read_secret():
        secret_file = open("../shared/secret.txt", "r")
        secret = secret_file.readline().strip("\n")
        secret_file.close()
        return secret

    @wraps(f)
    def decorated(*args, **kwargs):

        print("TOKEN CHECK")
        token = None
        # jwt is passed in the request header
        if 'Token' in request.headers:
            token = request.headers['Token']
        # return 401 if token is not passed
        if not token:
            return jsonify({'message' : 'Token is missing !!'}), 401
        try:
            # decoding the payload to fetch the stored details
            data = jwt.decode(token, read_secret(), algorithms=["HS256"])
            role = data["role"]
            if role != "collectivite":
                 return jsonify({
                'message' : "Insufficient permissions"
            }), 401

        except Exception as e:
            return jsonify({
                'message' : 'Token is invalid !!'
            }), 401
        # returns the current logged in users context to the routes
        return  f(*args, **kwargs)
  
    return decorated