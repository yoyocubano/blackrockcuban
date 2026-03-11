import os
import requests
import re
import subprocess

def download_image(url, filename, folder):
    if not url.startswith('http'): return
    try:
        response = requests.get(url, stream=True)
        if response.status_code == 200:
            path = os.path.join(folder, filename)
            with open(path, 'wb') as f:
                for chunk in response.iter_content(1024): f.write(chunk)
            return path
    except: return None

dest_folder = os.path.expanduser("~/Desktop/BRC_Ready_to_Print")
os.makedirs(dest_folder, exist_ok=True)

with open("/Users/yoyocubano/Documents/ANTIGRAVITY_CORE_DO_NOT_DELETE/blackrockcuban-project/index.html", "r") as f:
    html = f.read()

patterns = {
    "Cage_Lifting.png": r'src="(https://lh3.googleusercontent.com/[^"]+)"\s+alt="Lifting"',
    "Cage_Slam.png": r'src="(https://lh3.googleusercontent.com/[^"]+)"\s+alt="Slam"',
    "Cage_Training.png": r'src="(https://lh3.googleusercontent.com/[^"]+)"\s+alt="Training"',
    "Cage_Weights.png": r'src="(https://lh3.googleusercontent.com/[^"]+)"\s+alt="Weights"',
    "Grizzly_Tee_Model.png": r'src="(https://lh3.googleusercontent.com/[^"]+)"\s+/>.*Grizzly Core Tee',
    "Iron_Cage_Hoodie_Model.png": r'src="(https://lh3.googleusercontent.com/[^"]+)"\s+/>.*Iron Cage Hoodie',
    "Mat_Pro_Shorts_Model.png": r'src="(https://lh3.googleusercontent.com/[^"]+)"\s+alt="Shorts"',
    "Grizzly_Watermark.png": r'src="(https://lh3.googleusercontent.com/[^"]+)"\s+alt="Grizzly Watermark"'
}

for filename, pattern in patterns.items():
    match = re.search(pattern, html, re.DOTALL)
    if match: download_image(match.group(1), filename, dest_folder)

# Final transparency logic
for f in os.listdir(dest_folder):
    if f.lower().endswith(('.png', '.jpg', '.jpeg')):
        path = os.path.join(dest_folder, f)
        try:
            # Detect corner
            color = subprocess.check_output(['magick', path+'[1x1+0+0]', '-format', '%[pixel:u]', 'info:'], stderr=subprocess.DEVNULL).decode().strip()
            # aggressive transparent + trim
            temp_out = os.path.join(dest_folder, 'FINAL_'+os.path.splitext(f)[0]+'.png')
            subprocess.run(['magick', path, '-fuzz', '35%', '-transparent', color, '-fuzz', '35%', '-transparent', 'white', '-trim', '+repage', temp_out])
            os.remove(path)
            os.rename(temp_out, os.path.join(dest_folder, os.path.splitext(f)[0]+'.png'))
        except: continue
