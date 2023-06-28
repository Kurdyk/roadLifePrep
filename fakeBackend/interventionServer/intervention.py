from flask import Blueprint, request, make_response, jsonify
from uuid import uuid4
from db import get_db, Intervention, default_date
from utils import collectivity_token_required

bp = Blueprint('intervertion', __name__, url_prefix='/intervention')

@bp.route("/new_intervention", methods=["POST"])
def add_new_intervention():
    json = request.get_json()
    road_name = json["roadName"]
    description = json["description"]
    first_name = json["firstName"]
    last_name = json["lastName"]
    mail = json["mail"]

    print(f"ROAD NAME : {road_name}")

    new_intervention = Intervention(road_name=road_name, description=description, 
                                    first_name=first_name, last_name=last_name, mail=mail)
    db = get_db()

    try :
        db.session.add(new_intervention)
        db.session.commit()
    except Exception as e:
        print(e)
        return make_response('DB Integrity Error', 505)
    else:
        return make_response("Fine", 200)
    
@bp.route("/all", methods=["GET"])
def get_interventions():
    db = get_db()
    try :
        interventions = db.session.query(Intervention).order_by(Intervention.date_ask)
        return make_response(jsonify({"content":[intervention.serialize for intervention in interventions]}), 200)
    except Exception as e:
        print(e)
        return make_response(jsonify({"message":"Error while recovering data"}), 400)
    
@bp.route("/accept/<id>", methods=["POST"])
@collectivity_token_required
def accept_intervention(id):
    db = get_db()
    try:
        intervention = db.session.query(Intervention).where(Intervention.id == id).first()
        print(intervention)
    except Exception as e:
        print(e)
        return make_response(jsonify({"message":"Intervention not found"}), 404)
    if (intervention.state != 0):
        return make_response(jsonify({"message":"Not in asked state"}), 403)
    intervention.state = 2
    intervention.date_validation = default_date()
    db.session.commit()
    return make_response(jsonify({"message":"Update accepted"}), 200)

@bp.route("/refuse/<id>", methods=["POST"])
@collectivity_token_required
def refuse_intervention(id):
    db = get_db()
    try:
        intervention = db.session.query(Intervention).where(Intervention.id == id).first()
        print(intervention)
    except Exception as e:
        print(e)
        return make_response(jsonify({"message":"Intervention not found"}), 404)
    if (intervention.state != 0):
        return make_response(jsonify({"message":"Not in asked state"}), 403)
    intervention.state = 1
    intervention.date_refusal = default_date()
    intervention.refusal_description = request.get_json()["content"]
    db.session.commit()
    return make_response(jsonify({"message":"Update accepted"}), 200)

@bp.route("/end/<id>", methods=["POST"])
@collectivity_token_required
def end_intervention(id):
    db = get_db()
    try:
        intervention = db.session.query(Intervention).where(Intervention.id == id).first()
        print(intervention)
    except Exception as e:
        print(e)
        return make_response(jsonify({"message":"Intervention not found"}), 404)
    if (intervention.state != 2):
        return make_response(jsonify({"message":"Not in asked state"}), 403)
    intervention.state = 3
    intervention.date_solved = default_date()
    intervention.intervention_report = request.get_json()["content"]
    db.session.commit()
    return make_response(jsonify({"message":"Update accepted"}), 200)

