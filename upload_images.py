import requests
import base64
import json

token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIzN2Q0YmQzMDM1ZmUxMWU5YTgwM2FiN2VlYjNjY2M5NyIsImp0aSI6IjY0OGI1NjIwODg1ZTFmMDk2NGNjZjY1NTM3MzE5NmZkNWVlOGFiMzhkMWQ2NDQ1ZDJkNWY5N2VjMjAyNzlkY2U5NDFhNzYzMWQ0NzVlZWZjIiwiaWF0IjoxNzczMTc5MzU0LjI2NDYzOCwibmJmIjoxNzczMTc5MzU0LjI2NDY0MSwiZXhwIjoxODA0NzE1MzU0LjI1NDg3Miwic3ViIjoiMjY1OTgyODUiLCJzY29wZXMiOlsic2hvcHMubWFuYWdlIiwic2hvcHMucmVhZCIsImNhdGFsb2cucmVhZCIsIm9yZGVycy5yZWFkIiwib3JkZXJzLndyaXRlIiwicHJvZHVjdHMucmVhZCIsInByb2R1Y3RzLndyaXRlIiwid2ViaG9va3MucmVhZCIsIndlYmhvb2tzLndyaXRlIiwidXBsb2Fkcy5yZWFkIiwidXBsb2Fkcy53cml0ZSIsInByaW50X3Byb3ZpZGVycy5yZWFkIiwidXNlci5pbmZvIl19.f5B_8E6paj5nv0be0EBky46uA8OEtjQgzaMwlBWNPmJhzJSIKu9eTYp35NQuOXACgr7X5jIMTMfPR0WcqG3GvtShV1dERCHdrFp7mPgIxyd0Q7T1IKUdwZ_Ws2yx-TzzJQtGLCXrte2tHTO3yyV2oLNbAEw_bTf6PVjXaAN3yWeR_O2KcVH_7qfvpEF00z4XZHFV4uqIByawEDBTdm5YBHktQxwvgc1TWmpyGC642LuuBGWCdtKASCtJtqESF_dFEveDkppo8ylkl3qBDNme2bPFwk7fpOYhehsTvQ2AbLM3lbJjOFpI0yKsVhSxk-W_He83YdGzamIXrZ2rXisp_5hILEuBtItxUBROqbmSDyd9tMK5qbM2YhqoaJWyFb-KWRNPS059xjgQlwON9JcpSf8uQG1Mj3HTWAbKXHhGAqbifA1QvmacQTbMFdpUZ9p1y2n1kuhq10RqA0KPsk-qBMcpOS5EqhRRi8cpmVI6JeJlST82Wc-scZzZEWKk6SkDzN0X6nlXqYArVZD1Mzk1_KUj0b79OhkExYDOhyU16wts_vAkvbYSY3BKMqcu6gND51cJ3CnyUFXVOIAtpL5m9EDpIlay8TgPvsmI4cADl2h148ns4FpSy8MRe6XhEo3dboYsNMbOv87ILBqayGuownjuiJpXDDgVy9dg176EGAA"
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
