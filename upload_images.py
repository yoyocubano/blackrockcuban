import requests
import base64
import json
import os

token = os.environ.get("PRINTIFY_TOKEN")
headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}

def upload(file_path, name):
    with open(file_path, "rb") as f:
        content = base64.b64encode(f.read()).decode("utf-8")
    data = {"file_name": name, "contents": content}
    r = requests.post("https://api.printify.com/v1/uploads/images.json", headers=headers, json=data)
    return r.json()

shorts_img = upload("/Users/yoyocubano/.gemini/antigravity/brain/4dce0980-bda4-4101-aa4e-372da763a536/grizzly_shorts_design_1773179763752.png", "shorts_design.png")
hoodie_img = upload("/Users/yoyocubano/.gemini/antigravity/brain/4dce0980-bda4-4101-aa4e-372da763a536/iron_cage_hoodie_design_1773179777249.png", "hoodie_design.png")

print(json.dumps({"shorts_id": shorts_img.get("id"), "hoodie_id": hoodie_img.get("id")}))
