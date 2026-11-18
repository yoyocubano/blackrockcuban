import requests
import json
import os

shop_id = "26750273"
token = os.environ.get("PRINTIFY_TOKEN")

headers = {
    "Authorization": f"Bearer {token}",
    "Content-Type": "application/json"
}

def create_product(data):
    url = f"https://api.printify.com/v1/shops/{shop_id}/products.json"
    response = requests.post(url, headers=headers, json=data)
    return response.json()

# GRIZZLY CORE TEE
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

# MAT PRO SHORTS
shorts_data = {
    "title": "Mat Pro Shorts",
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
                            "id": "69b099cb8344b67bcc155e11",  # Need to upload the shorts design image first
                            "x": 0.5,
                            "y": 0.5,
                            "scale": 0.3,
                            "angle": 0
                        }
                    ]
                }
            ]
        }
    ]
}

print("Creating Tee...")
print(json.dumps(create_product(tee_data), indent=2))

