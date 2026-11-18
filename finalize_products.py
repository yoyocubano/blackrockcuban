import requests
import json
import os

shop_id = "26750273"
token = os.environ.get("PRINTIFY_TOKEN")
headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}

def update_product(p_id, data):
    url = f"https://api.printify.com/v1/shops/{shop_id}/products/{p_id}.json"
    r = requests.put(url, headers=headers, json=data)
    return r.json()

def create_product(data):
    url = f"https://api.printify.com/v1/shops/{shop_id}/products.json"
    r = requests.post(url, headers=headers, json=data)
    return r.json()

# UPDATE HOODIE
hoodie_id = "69b09a016d2baa18fc0b6ede"
hoodie_update = {
    "title": "Iron Cage Hoodie - Premium Weight",
    "description": "Authentic Iron Cage gear. Heavyweight fleece, red-lined hoodie. Built for the grind.",
}
print("Updating Hoodie...")
print(update_product(hoodie_id, hoodie_update))

# CREATE SHORTS
shorts_data = {
    "title": "Mat Pro Shorts - BRC Athletic",
    "description": "Triple-Reinforced Tech Fabric. Authentic Cuban American Legacy Gear.",
    "blueprint_id": 1574,
    "print_provider_id": 39,
    "variants": [
        {"id": 110285, "price": 5500, "is_enabled": True},
        {"id": 110290, "price": 5500, "is_enabled": True},
        {"id": 110295, "price": 5500, "is_enabled": True},
        {"id": 110300, "price": 5500, "is_enabled": True},
        {"id": 110305, "price": 5500, "is_enabled": True}
    ],
    "print_areas": [
        {
            "variant_ids": [110285, 110290, 110295, 110300, 110305],
            "placeholders": [
                {
                    "position": "front",
                    "images": [
                        {
                            "id": "69b09ba0f5cf535951e6c3ad",
                            "x": 0.5,
                            "y": 0.5,
                            "scale": 0.4,
                            "angle": 0
                        }
                    ]
                }
            ]
        }
    ]
}
print("Creating Shorts...")
print(create_product(shorts_data))

# CREATE TEE (Blueprint 1382, Provider 29)
tee_data = {
    "title": "Grizzly Core Tee - B+C 3010",
    "description": "Premium Unisex Oversized Boxy Tee - Bella+Canvas 3010. Authentic Cuban American Legacy Gear.",
    "blueprint_id": 1382,
    "print_provider_id": 29,
    "variants": [
        {"id": 103518, "price": 4500, "is_enabled": True},
        {"id": 103519, "price": 4500, "is_enabled": True},
        {"id": 103520, "price": 4500, "is_enabled": True},
        {"id": 103521, "price": 4500, "is_enabled": True},
        {"id": 103522, "price": 4500, "is_enabled": True}
    ],
    "print_areas": [
        {
            "variant_ids": [103518, 103519, 103520, 103521, 103522],
            "placeholders": [
                {
                    "position": "front",
                    "images": [
                        {
                            "id": "69b099cb8344b67bcc155e11",
                            "x": 0.5,
                            "y": 0.3,
                            "scale": 0.5,
                            "angle": 0
                        }
                    ]
                }
            ]
        }
    ]
}
print("Creating Tee...")
print(create_product(tee_data))
