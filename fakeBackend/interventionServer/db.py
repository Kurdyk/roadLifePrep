from flask import g
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import func, sql
import datetime
import uuid

db = SQLAlchemy()

def init_app(app):

    with app.app_context():
        db.init_app(app)
        db.create_all()


def get_db():
    if 'db' not in g:
        g.db = db
    return g.db

def default_date():
        current_date = datetime.date.today()
        return str(current_date).replace("-", "/")

class Intervention(db.Model):
    __tablename__ = "intervention"

    def default_id():
        return str(uuid.uuid4())

    id = db.Column(db.String(36), primary_key = True, default=default_id)
    road_name = db.Column(db.String(64), nullable=False)
    description = db.Column(db.String(2048), nullable=False)
    refusal_description = db.Column(db.String(2048), nullable=True, default=sql.null())
    first_name = db.Column(db.String(64), nullable=False)
    last_name = db.Column(db.String(128), nullable=False)
    mail = db.Column(db.String(128), nullable=False)
    date_ask = db.Column(db.String(10), default=default_date, nullable=False)
    state = db.Column(db.Integer, nullable=False, default=0)
    date_solved = db.Column(db.String(10), nullable=True, default=sql.null())
    gain = db.Column(db.Integer, nullable=True, default=sql.null())
    date_validation = db.Column(db.String(64), nullable=True, default=sql.null())
    date_refusal = db.Column(db.String(64), nullable=True, default=sql.null())
    intervention_report = db.Column(db.String(4000), nullable=True, default=sql.null())


    @property
    def serialize(self):
        return {
            "interventionId": self.id,
            "roadLocalisation": self.road_name,
            "description" : self.description,
            "refusalDescription": self.refusal_description,
            "askDate" : self.date_ask,
            "dateRefusal" : self.date_refusal,
            "dateValidation" : self.date_validation,
            "state" : self.state,
            "dateSolved": self.date_solved,
            "gain" : self.gain,
            "report" : self.intervention_report,
        }

