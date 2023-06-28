from .db import Intervention, get_db
from uuid import uuid4
import random
import datetime
import time
import click

streets = ["Route de Lyon", "Ruelle Sainte Barbe", "La place de la Fontaine", "Avenue de la Gare"]
descriptions = ["Plz fix", "A broken road", "I would have built it better"]
first_names = ["Tony", "Kevin", "Joe"]
last_names = ["A", "B", "C"]

    
def str_time_prop(start, end, time_format, prop):
    """Get a time at a proportion of a range of two formatted times.

    start and end should be strings specifying times formatted in the
    given format (strftime-style), giving an interval [start, end].
    prop specifies how a proportion of the interval to be taken after
    start.  The returned time will be in the specified format.
    """

    stime = time.mktime(time.strptime(start, time_format))
    etime = time.mktime(time.strptime(end, time_format))

    ptime = stime + prop * (etime - stime)

    return time.strftime(time_format, time.localtime(ptime))

def random_date(start, end, prop):
    return str_time_prop(start, end, '%d/%m/%Y %I:%M', prop)


def random_intervention():
    id = uuid4()
    road_name = random.sample(streets, 1)[0]
    description = random.sample(descriptions, 1)[0]
    first_name = random.sample(first_names, 1)[0]
    last_name = random.sample(last_names, 1)[0]
    mail = f"{first_name}.{last_name}@gmail.com"
    accepted = random.random() > 0.5
    if accepted:
        date_solved = random_date("20/06/2023 1:30", "20/07/2023 4:50", random.random())
        gain = random.randint(10, 40)
    else:
        date_solved = None
        gain = 0
    intervention = Intervention(id=id, 
                                road_name=road_name,
                                description=description, 
                                first_name=first_name,
                                last_name=last_name,
                                mail=mail, 
                                accepted=accepted,
                                date_solved=date_solved,
                                gain=gain)
    db = get_db()
    try:
        db.session.add(intervention)
        db.session.commit()
    except Exception as e:
        print(e)
    

def fill_intervention(n:int):
    for _ in range(n):
        random_intervention()

@click.command("fill_intervention")
def main():
    fill_intervention(20)
    
