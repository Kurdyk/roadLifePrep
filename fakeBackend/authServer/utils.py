import json
from os import replace
import jwt
from time import time
from uuid import uuid4
user_file_path = "../shared/users.txt"

### USER RELATED
class User:
    def __init__(self, mail:str, password:str, prenom:str = "", nom:str ="", id:str = uuid4(), role:str = "particulier") -> None:
        self.mail = mail
        self.prenom = prenom
        self.nom = nom
        self.password = password
        self.role = role
        self.id = id

    def __str__(self) -> str:
        return f"{self.mail},{self.prenom},{self.nom},{self.password},{self.role},{self.id}"
    
    def to_json(self) -> dict:
        return {
            "mail": self.mail,
            "prenom": self.prenom,
            "nom": self.nom,
            "password": self.password,
            "role": self.role,
            "id": self.id,
        }

def parse_user(user_str:str) -> User:   # format : mail, prenom, nom, password
    split = user_str.strip(" ").strip("\n").split(",")
    return User(mail=split[0], prenom=split[1], nom=split[2], password=split[3], role=split[4], id=split[5])

def parse_json(user_json:str) -> User:
    try:
        return User(mail=user_json["mail"], password=user_json["password"], prenom=user_json["prenom"], nom=user_json["nom"], )
    except KeyError:
        try:
            return User(mail=user_json["mail"], password=user_json["password"])
        except:
            raise ValueError("Bad request")
        
def find_user(user:User) -> bool:
    user_file = open(user_file_path, 'r')
    for line in user_file:
        current_user = parse_user(line)
        if current_user.mail == user.mail:
            user_file.close()
            return True
    user_file.close()
    return False

def add_new_user(new_user:User):
    if find_user(new_user):
        raise ValueError("Mail already known")
    user_file = open(user_file_path, "a")
    user_file.write(f"{new_user}\n")  # should hash and salt password 
    user_file.close()
    return

def delete_user(user:User):
    user_file = open(user_file_path, 'r')
    new_file = open("tmp.txt", "w")
    for line in user_file:
        current_user = parse_user(line)
        if current_user.mail == user.mail:
            continue
        new_file.write(line)
    user_file.close()
    new_file.close()
    replace("tmp.txt", user_file_path)
    return

### LOGIN RELATED     
def verify_login(user:User) -> User:
    user_file = open(user_file_path, 'r')
    for line in user_file:
        current_user = parse_user(line)
        if current_user.mail == user.mail:
            if current_user.password == user.password:
                user_file.close()
                return current_user
            user_file.close()
            raise ValueError("Invalid password")
    user_file.close()
    raise KeyError("User not found")

def generate_token(user:User) -> str:

    def read_secret():
        secret_file = open("../shared/secret.txt", "r")
        secret = secret_file.readline().strip("\n")
        secret_file.close()
        return secret
    
    def registerToken(token:str, mail:str):
        tokens_file = open("../shared/validTokens.txt", "a")
        tokens_file.write(f"{token}\n")
        tokens_file.close()
        return
    
    current_time = time()
    validity = 60 * 60 * 24 # 1 day
    token = jwt.encode({"exp":current_time + validity, "mail":user.mail, "role":user.role}, read_secret(), algorithm="HS256")
    return token

### TESTING
def test():
    global user_file_path
    user_file_path = "./users_test.txt"
    # testing variable
    test_str0 = "l0@test.com,p0,n0,psw0,particulier"
    test_str1 = "l1@test.fr,p1,n1,psw1,collectivite"
    test_str2 = "l2@test.eu,p2,n2,psw2,particulier"
    test_str3 = "l3@google.com,p3,n3,psw3,collectivite"
    test_str4 = "l4@yahoo.fr,p4,n4,psw4,particulier"
    all_test = [test_str0, test_str1, test_str2, test_str3, test_str4]
    # test parsing
    print("Test parsing")
    for index, test in enumerate(all_test):
        print(f"test {index}: {parse_user(test)}")
    # test add_new_user
    print("Test add (adding 0 to 2)")
    for index, test in enumerate(all_test[:3]):
        try:
            print(f"test {index}: {add_new_user(parse_user(test))}")
        except ValueError:
            print("Already there")
    # test find user
    print("Test find")
    for index, test in enumerate(all_test):
        print(f"test {index}: {find_user(parse_user(test))}")
    # test delete
    print("Test delete")
    for index, test in enumerate(all_test[:2]):
        print(f"test {index}: {delete_user(parse_user(test))}")
    # test jsonify
    for index, test in enumerate(all_test):
        print(f"test {index}: {(parse_user(test)).to_json()}")
    # test token generation
    print("Test token generation")
    print(generate_token(parse_user(test_str0)))
    


if __name__ == "__main__":
    test()