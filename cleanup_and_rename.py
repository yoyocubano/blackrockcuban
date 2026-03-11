import requests
import json

shop_id = "26750273"
token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIzN2Q0YmQzMDM1ZmUxMWU5YTgwM2FiN2VlYjNjY2M5NyIsImp0aSI6IjY0OGI1NjIwODg1ZTFmMDk2NGNjZjY1NTM3MzE5NmZkNWVlOGFiMzhkMWQ2NDQ1ZDJkNWY5N2VjMjAyNzlkY2U5NDFhNzYzMWQ0NzVlZWZjIiwiaWF0IjoxNzczMTc5MzU0LjI2NDYzOCwibmJmIjoxNzczMTc5MzU0LjI2NDY0MSwiZXhwIjoxODA0NzE1MzU0LjI1NDg3Miwic3ViIjoiMjY1OTgyODUiLCJzY29wZXMiOlsic2hvcHMubWFuYWdlIiwic2hvcHMucmVhZCIsImNhdGFsb2cucmVhZCIsIm9yZGVycy5yZWFkIiwib3JkZXJzLndyaXRlIiwicHJvZHVjdHMucmVhZCIsInByb2R1Y3RzLndyaXRlIiwid2ViaG9va3MucmVhZCIsIndlYmhvb2tzLndyaXRlIiwidXBsb2Fkcy5yZWFkIiwidXBsb2Fkcy53cml0ZSIsInByaW50X3Byb3ZpZGVycy5yZWFkIiwidXNlci5pbmZvIl19.f5B_8E6paj5nv0be0EBky46uA8OEtjQgzaMwlBWNPmJhzJSIKu9eTYp35NQuOXACgr7X5jIMTMfPR0WcqG3GvtShV1dERCHdrFp7mPgIxyd0Q7T1IKUdwZ_Ws2yx-TzzJQtGLCXrte2tHTO3yyV2oLNbAEw_bTf6PVjXaAN3yWeR_O2KcVH_7qfvpEF00z4XZHFV4uqIByawEDBTdm5YBHktQxwvgc1TWmpyGC642LuuBGWCdtKASCtJtqESF_dFEveDkppo8ylkl3qBDNme2bPFwk7fpOYhehsTvQ2AbLM3lbJjOFpI0yKsVhSxk-W_He83YdGzamIXrZ2rXisp_5hILEuBtItxUBROqbmSDyd9tMK5qbM2YhqoaJWyFb-KWRNPS059xjgQlwON9JcpSf8uQG1Mj3HTWAbKXHhGAqbifA1QvmacQTbMFdpUZ9p1y2n1kuhq10RqA0KPsk-qBMcpOS5EqhRRi8cpmVI6JeJlST82Wc-scZzZEWKk6SkDzN0X6nlXqYArVZD1Mzk1_KUj0b79OhkExYDOhyU16wts_vAkvbYSY3BKMqcu6gND51cJ3CnyUFXVOIAtpL5m9EDpIlay8TgPvsmI4cADl2h148ns4FpSy8MRe6XhEo3dboYsNMbOv87ILBqayGuownjuiJpXDDgVy9dg176EGAA"
headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}

def delete_product(p_id):
    url = f"https://api.printify.com/v1/shops/{shop_id}/products/{p_id}.json"
    requests.delete(url, headers=headers)

def update_product(p_id, data):
    url = f"https://api.printify.com/v1/shops/{shop_id}/products/{p_id}.json"
    requests.put(url, headers=headers, json=data)

to_delete = ["69b09bc86d2baa18fc0b6f57", "69b09bc33665ce33d20476b9", "69b09b922a25577f290b584b"]
for pid in to_delete:
    print(f"Deleting {pid}...")
    delete_product(pid)

print("Updating Hoodie...")
update_product("69b09a016d2baa18fc0b6ede", {
    "title": "Iron Cage Hoodie - Premium Weight",
    "description": "Authentic Iron Cage gear. Heavyweight fleece, red-lined hoodie. Built for the grind."
})
