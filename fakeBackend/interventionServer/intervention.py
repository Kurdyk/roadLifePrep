import random

from flask import Blueprint, request, make_response, jsonify
from db import get_db, Intervention, default_date
from utils import collectivity_token_required

bp = Blueprint('interventions', __name__, url_prefix='/interventions')


@bp.route("", methods=["POST"])
def add_new_intervention():
	json = request.get_json()
	road_id = json["roadId"]
	description = json["description"]
	first_name = json["firstName"]
	last_name = json["lastName"]
	mail = json["mail"]

	new_intervention = Intervention(road_id=road_id,
									road_url=f"http://localhost:5555/roads/{road_id}",
									description=description,
									first_name=first_name, last_name=last_name, mail=mail)
	db = get_db()

	try:
		db.session.add(new_intervention)
		db.session.commit()
	except Exception as e:
		print(e)
		return make_response('DB Integrity Error', 505)
	else:
		return make_response("Fine", 200)


@bp.route("", methods=["GET"])
def get_interventions():
	db = get_db()
	try:
		interventions = db.session.query(Intervention).order_by(Intervention.date_ask)
		return make_response(jsonify({"interventionList": [intervention.serialize for intervention in interventions]}),
							 200)
	except Exception as e:
		print(e)
		return make_response(jsonify({"message": "Error while recovering data"}), 400)


@bp.route("/<intervention_id>", methods=["PUT"])
@collectivity_token_required
def accept_intervention(intervention_id):
	db = get_db()
	try:
		intervention = db.session.query(Intervention).where(Intervention.id == intervention_id).first()
		print(intervention)
	except Exception as e:
		print(e)
		return make_response(jsonify({"message": "Intervention not found"}), 404)
	target_state = request.get_json()["newState"]
	description = request.get_json()["description"]
	if target_state == 2:  # to accepted
		if intervention.state != 0:
			return make_response(jsonify({"message": "Not in asked state"}), 403)
		intervention.state = 2
		intervention.date_validation = default_date()
	elif target_state == 1:  # to refused
		if intervention.state != 0:
			return make_response(jsonify({"message": "Not in asked state"}), 403)
		intervention.state = 1
		intervention.date_refusal = default_date()
		intervention.refusal_description = description
	else:  # to resolved
		if intervention.state != 2:
			return make_response(jsonify({"message": "Not in accepted state"}), 403)
		intervention.state = 3
		intervention.date_solved = default_date()
		intervention.intervention_report = description
		intervention.gain = random.randint(10, 45)
	db.session.commit()
	return make_response(jsonify({"message": "Update accepted"}), 200)
