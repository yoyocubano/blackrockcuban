import requests
import json
import os

shop_id = "26750273"
token = os.environ.get("PRINTIFY_TOKEN")
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
