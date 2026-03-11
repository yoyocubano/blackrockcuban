import requests
import json

shop_id = "26750273"
token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIzN2Q0YmQzMDM1ZmUxMWU5YTgwM2FiN2VlYjNjY2M5NyIsImp0aSI6IjY0OGI1NjIwODg1ZTFmMDk2NGNjZjY1NTM3MzE5NmZkNWVlOGFiMzhkMWQ2NDQ1ZDJkNWY5N2VjMjAyNzlkY2U5NDFhNzYzMWQ0NzVlZWZjIiwiaWF0IjoxNzczMTc5MzU0LjI2NDYzOCwibmJmIjoxNzczMTc5MzU0LjI2NDY0MSwiZXhwIjoxODA0NzE1MzU0LjI1NDg3Miwic3ViIjoiMjY1OTgyODUiLCJzY29wZXMiOlsic2hvcHMubWFuYWdlIiwic2hvcHMucmVhZCIsImNhdGFsb2cucmVhZCIsIm9yZGVycy5yZWFkIiwib3JkZXJzLndyaXRlIiwicHJvZHVjdHMucmVhZCIsInByb2R1Y3RzLndyaXRlIiwid2ViaG9va3MucmVhZCIsIndlYmhvb2tzLndyaXRlIiwidXBsb2Fkcy5yZWFkIiwidXBsb2Fkcy53cml0ZSIsInByaW50X3Byb3ZpZGVycy5yZWFkIiwidXNlci5pbmZvIl19.f5B_8E6paj5nv0be0EBky46uA8OEtjQgzaMwlBWNPmJhzJSIKu9eTYp35NQuOXACgr7X5jIMTMfPR0WcqG3GvtShV1dERCHdrFp7mPgIxyd0Q7T1IKUdwZ_Ws2yx-TzzJQtGLCXrte2tHTO3yyV2oLNbAEw_bTf6PVjXaAN3yWeR_O2KcVH_7qfvpEF00z4XZHFV4uqIByawEDBTdm5YBHktQxwvgc1TWmpyGC642LuuBGWCdtKASCtJtqESF_dFEveDkppo8ylkl3qBDNme2bPFwk7fpOYhehsTvQ2AbLM3lbJjOFpI0yKsVhSxk-W_He83YdGzamIXrZ2rXisp_5hILEuBtItxUBROqbmSDyd9tMK5qbM2YhqoaJWyFb-KWRNPS059xjgQlwON9JcpSf8uQG1Mj3HTWAbKXHhGAqbifA1QvmacQTbMFdpUZ9p1y2n1kuhq10RqA0KPsk-qBMcpOS5EqhRRi8cpmVI6JeJlST82Wc-scZzZEWKk6SkDzN0X6nlXqYArVZD1Mzk1_KUj0b79OhkExYDOhyU16wts_vAkvbYSY3BKMqcu6gND51cJ3CnyUFXVOIAtpL5m9EDpIlay8TgPvsmI4cADl2h148ns4FpSy8MRe6XhEo3dboYsNMbOv87ILBqayGuownjuiJpXDDgVy9dg176EGAA"

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

