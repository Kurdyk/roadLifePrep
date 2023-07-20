from random import randint, sample, uniform, random

sensor_path = "./sensors.txt"
road_path = "./roads.txt"
usages_path = "./usages.txt"
wears_path = "./wears.txt"

streets = ["Route de Lyon", "Ruelle Sainte Barbe", "La place de la Fontaine", "Avenue de la Gare"]
postalCodes = [75008, 46092, 94023, 21760]
cities = ["Reims", "Paris", "Lille", "Bordeaux"]

# Shared 
def generate_random_coordinates(baseCoord:list, max_delta:float, n_wanted:int):
	result = list()
	for _ in range(n_wanted):
		signe_x, signe_y = 1 if random() > 0.5 else -1, 1 if random() > 0.5 else -1
		delta_x, delta_y = uniform(0, max_delta), uniform(0, max_delta)
		result.append([baseCoord[0] + signe_x * delta_x, baseCoord[1] + signe_y * delta_y])
	return result

# Road related
class Road:
	def __init__(self, id:str, street:str, wear_score:int, postal_code:int, city:str, position: list) -> None:
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

	def __str__(self):
		return str(self.to_json()).replace("'", '"')
# Sensor related
class Sensor:
	def __init__(self, id:str, position: [int, int], road_id:str) -> None:
		self.id = id
		self.position = position
		self.road_id = road_id

	def to_json(self):
		return {
			"id": self.id,
			"position": self.position,
			"roadId": self.road_id,
		}

	def __str__(self):
		return str(self.to_json()).replace("'", '"')

# Wears related
class dailyWears:
	def __init__(self, sensor_id:str, wears_list:list) -> None:
		"""
		We consider the wears from the 1st of january 2018, the list's index will give the exact date.
		"""
		self.sensor_id = str(sensor_id)
		self.wears_list = wears_list

	def __str__(self) -> str:
		return "{" + f""""sensorId":"{self.sensor_id}", "wearsList":{self.wears_list}""" + "}"

# Usage related 
class dailyUsage:
	def __init__(self, sensor_id:str, usages_list:list) -> None:
		self.sensor_id = str(sensor_id)
		self.usages_list = usages_list

	def __str__(self) -> str:
		return "{" + f""""sensorId":"{self.sensor_id}", "usagesList":{self.usages_list}""" + "}"

# fill functions
def fill_roads(n:int):
	free_id = set(range(2*n))
	road_file = open(road_path, "w")  # put a to append, w to overwrite current data
	for i in range(n):
		ids = sample(list(free_id), 2)
		free_id = free_id - set(ids)
		current_road = Road(id=str(i), street=sample(streets, 1)[0],
							postal_code=sample(postalCodes, 1)[0],
							city=sample(cities, 1)[0],
							position=generate_random_coordinates([48.866, 2.333], 0.01, 3),
							wear_score=randint(10, 80))
		road_file.write(f"{current_road}\n")
	road_file.close()

def fill_sensors(n:int):
	coordinates = generate_random_coordinates([48.866, 2.333], 0.01, n)
	sensors_file = open(sensor_path, "w") # put a to append, w to overwrite current data
	for i in range(n):
		current_sensor = Sensor(id=str(i), position=coordinates[i], road_id=str(sample(range(n //
																							 2), 1)[0]))
		sensors_file.write(f"{current_sensor}\n")
	sensors_file.close()

def fill_usages_wears(n_sensors:int):

	def simulate_intervention(current_wear:int):
		if current_wear > 70:
			return 0
		if uniform(0, current_wear) > 50:
			return 0
		return current_wear

	usages_file = open(usages_path, "w") # put a to append, w to overwrite current data
	wears_file = open(wears_path, "w") # put a to append, w to overwrite current data

	number_of_days = 365 * 5
	for i in range(n_sensors):
		usages_list = [None] * number_of_days
		wears_list = [uniform(0, 60)] + [None] * (number_of_days - 1)
		frequentation_type = sample(range(1, 6), 1)[0]
		for j in range(number_of_days):
			usages_list[j] = frequentation_type * randint(20, 100)
			if j >= 1:
				wears_list[j] = simulate_intervention(wears_list[j - 1]) + (1 / abs(frequentation_type - 7)) * 5e-1
		current_usage = dailyUsage(sensor_id=str(i), usages_list=usages_list)
		current_wears = dailyWears(sensor_id=str(i), wears_list=wears_list)
		usages_file.write(f"{current_usage}\n")
		wears_file.write(f"{current_wears}\n")

	usages_file.close()
	wears_file.close()


def main():
	n = 20
	fill_roads(n)
	fill_sensors(2*n)
	fill_usages_wears(2*n)

if __name__ == "__main__":
	main()