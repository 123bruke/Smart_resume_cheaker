import os
import io
import json
import logging
from typing import List, Dict
import fitz  # PyMuPDF
from PIL import Image
import torch
from transformers import AutoProcessor, AutoModelForZeroShotImageClassification
Upload = "font_upload.html"  # Replace with the path to the uploaded PDF

# Output directory for extracted images
OUTPUT_DIR = "output_images"
RESULT_JSON = "image_classification_results.json"

# Candidate labels for zero-shot classification
CANDIDATE_LABELS = [
    "person",
    "chart",
    "diagram",
    "logo",
    "table",
    "medical image",
    "x-ray",
    "graph",
    "signature",
    "text document"
]

# Logging configuration
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)


logging.info("Loading CLIP model...")
processor = AutoProcessor.from_pretrained("openai/clip-vit-base-patch32")
model = AutoModelForZeroShotImageClassification.from_pretrained(
    "openai/clip-vit-base-patch32"
)

device = "cuda" if torch.cuda.is_available() else "cpu"
model.to(device)
model.eval()
logging.info(f"Model loaded successfully on {device}.")



def extract_images_from_pdf(pdf_path: str, output_dir: str) -> List[Dict]:
    if not os.path.exists(pdf_path):
        raise FileNotFoundError(f"PDF file not found: {pdf_path}")

    os.makedirs(output_dir, exist_ok=True)

    document = fitz.open(pdf_path)
    extracted_images = []

    image_index = 0

    for page_number in range(len(document)):
        page = document[page_number]
        image_list = page.get_images(full=True)

        logging.info(f"Page {page_number + 1}: Found {len(image_list)} images.")

        for img in image_list:
            xref = img[0]
            base_image = document.extract_image(xref)
            image_bytes = base_image["image"]
            image_ext = base_image["ext"]

            image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
            image_filename = f"image_{image_index}.{image_ext}"
            image_path = os.path.join(output_dir, image_filename)

            image.save(image_path)

            extracted_images.append({
                "image_id": image_index,
                "file_name": image_filename,
                "file_path": image_path,
                "page_number": page_number + 1
            })

            logging.info(f"Saved image: {image_filename}")
            image_index += 1

    document.close()
    return extracted_images

def classify_image(image_path: str, candidate_labels: List[str]) -> Dict:
    image = Image.open(image_path).convert("RGB")

    inputs = processor(
        images=image,
        text=candidate_labels,
        return_tensors="pt",
        padding=True
    ).to(device)

    with torch.no_grad():
        outputs = model(**inputs)
        logits = outputs.logits_per_image
        probabilities = logits.softmax(dim=1).cpu().numpy()[0]

    best_index = probabilities.argmax()

    return {
        "predicted_label": candidate_labels[best_index],
        "confidence": float(probabilities[best_index]),
        "all_scores": {
            label: float(score)
            for label, score in zip(candidate_labels, probabilities)
        }
    }



def save_results_to_json(results: List[Dict], output_file: str) -> None:

    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=4, ensure_ascii=False)

    logging.info(f"Results saved to {output_file}")

def main() -> None:

    logging.info("Starting PDF image extraction and classification...")

    # Step 1: Extract images
    extracted_images = extract_images_from_pdf(Upload, OUTPUT_DIR)

    if not extracted_images:
        logging.warning("No images found in the PDF.")
        return

    # Step 2: Classify each image
    results = []
    for image_info in extracted_images:
        classification = classify_image(
            image_info["file_path"],
            CANDIDATE_LABELS
        )

        result = {
            **image_info,
            **classification
        }
        results.append(result)

        logging.info(
            f"Image {image_info['file_name']} classified as "
            f"{classification['predicted_label']} "
            f"(confidence: {classification['confidence']:.2f})"
        )

    # Step 3: Save results
    save_results_to_json(results, RESULT_JSON)

    logging.info("Processing completed successfully.")


if __name__ == "__main__":
    main()