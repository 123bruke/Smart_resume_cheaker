from transformers import AutoProcessor, AutoModelForZeroShotImageClassification
# model of the transformation from hugging face 

processor = AutoProcessor.from_pretrained("openai/clip-vit-base-patch32")
model = AutoModelForZeroShotImageClassification.from_pretrained("openai/clip-vit-base-patch32")