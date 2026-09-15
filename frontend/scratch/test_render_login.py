import urllib.request
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')
url = "https://quan-ly-phong-tro-backend-iqv1.onrender.com/api/auth"

def test_login(username, password):
    payload = json.dumps({"username": username, "password": password}).encode("utf-8")
    req = urllib.request.Request(f"{url}/login", data=payload, headers={"Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req) as res:
            data = json.loads(res.read().decode("utf-8"))
            print(f"[SUCCESS] Login '{username}' OK! Role: {data.get('role')}")
            return True
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8")
        print(f"[HTTP {e.code}] Login '{username}' failed. Body: {body}")
        return False

def test_register():
    reg_data = {
        "username": "khachthue01",
        "password": "Password123!",
        "fullName": "Nguyen Van Khach",
        "phone": "0987654321",
        "email": "khachthue01@gmail.com"
    }
    payload = json.dumps(reg_data).encode("utf-8")
    req = urllib.request.Request(f"{url}/register", data=payload, headers={"Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req) as res:
            data = json.loads(res.read().decode("utf-8"))
            print(f"[REGISTER SUCCESS] Registered tenant 'khachthue01'! Role: {data.get('role')}")
            return True
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8")
        print(f"[HTTP {e.code}] Register failed. Body: {body}")
        return False

print("=== TESTING RENDER BACKEND API ===")
test_login("admin", "admin123")
test_login("admin", "amdin123")
test_register()
test_login("khachthue01", "Password123!")
