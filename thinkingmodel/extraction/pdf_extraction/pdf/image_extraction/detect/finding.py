import json
import shutil
import os
os.makedirs("saved_images", exist_ok=True)

with open("file.json", "r") as f:
    data = json.load(f)

for item in data:
    src = item["file_path"]
    dst = f"saved_images/{item['file_name']}"

    shutil.copy(src, dst)

print("All images copied sucess fully passed it")
from PIL import Image

image = Image.open(image_path)
# send to CLIP mo