import requests
import json

shop_id = "26750273"
token = "REDACTED-PRINTIFY-TOKEN"
headers = {"Authorization": f"Bearer {token}"}

ids = ["69b09bd522fd93f52e06281c", "69b09bd222fd93f52e06281a", "69b09a016d2baa18fc0b6ede"]

for pid in ids:
    url = f"https://api.printify.com/v1/shops/{shop_id}/products/{pid}.json"
    r = requests.get(url, headers=headers).json()
    print(f"\nProduct: {r.get('title')}")
    for v in r.get('variants', []):
        if 'is_enabled' in v and not v['is_enabled']: continue
        print(f"  {v.get('title')}: {v.get('sku')}")
