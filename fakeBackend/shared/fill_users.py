import random
import string
from uuid import uuid4

user_file_path = "./users.txt"

class User:
    def __init__(self, mail:str, password:str, prenom:str = "", nom:str ="", role:str = "particulier") -> None:
        self.id = uuid4()
        self.mail = mail
        self.prenom = prenom
        self.nom = nom
        self.password = password
        self.role = role

    def __str__(self) -> str:
        return f"{self.mail},{self.prenom},{self.nom},{self.password},{self.role},{self.id}"

    def to_json(self) -> dict:
        return {
            "mail": self.mail,
            "prenom": self.prenom,
            "nom": self.nom,
            "password": self.password,
            "role": self.role,
        }

def fill_user(n: int):
    def generate_random_user():

        def generate_random_string(length):
            letters = string.ascii_lowercase
            result_str = ''.join(random.choice(letters) for i in range(length))
            return result_str
        
        return User(mail=generate_random_string(10), password=generate_random_string(1), 
                    prenom=generate_random_string(2), nom=generate_random_string(3), role="particulier")
    
    user_file = open(user_file_path, "a")
    for _ in range(n):
        user_file.write(f"{generate_random_user()}\n")
    user_file.close()
        

def main():
    fill_user(20)

if __name__ == "__main__":
    main()