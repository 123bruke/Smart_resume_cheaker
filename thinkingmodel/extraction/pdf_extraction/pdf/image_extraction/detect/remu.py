import json
from PIL import Image

# Load JSON
with open("file.json", "r") as f:
    data = json.load(f)

# Loop through images
for item in data:
    image_path = item["file_path"]

    image = Image.open(image_path)
    image.show()

    print("Label:", item["predicted_label"])
    print("Confidence:", item["confidence"])
