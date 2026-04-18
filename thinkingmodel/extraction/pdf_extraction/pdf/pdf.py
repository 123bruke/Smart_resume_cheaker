

import fitz  # PyMuPDF
import logging
from typing import Dict, List
import json
import logging
import os
from pdf_extractor import PDFTextExtractor 


class PDFTextExtractor:

    def __init__(self, file_path: str) -> None:
      
        self.file_path = file_path

    def extract_text(self) -> Dict[str, List[Dict[str, str]]]:
        try:
            document = fitz.open(self.file_path)
        except Exception as error:
            logging.error(f"Failed to open PDF file: {error}")
            raise RuntimeError(f"Unable to open PDF file: {self.file_path}")

        extracted_data = {
            "file_name": self.file_path,
            "total_pages": len(document),
            "pages": []
        }

        for page_number, page in enumerate(document, start=1):
            text = page.get_text("text")
            extracted_data["pages"].append({
                "page_number": page_number,
                "text": text.strip() if text else ""
            })

        document.close()
        logging.info(f"Successfully extracted text from {self.file_path}")
        return extracted_data
# after the file extraction aslo have been create 

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)


def save_to_json(data: dict, output_path: str) -> None:
    
    try:
        with open(output_path, "w", encoding="utf-8") as json_file:
            json.dump(data, json_file, indent=4, ensure_ascii=False)
        logging.info(f"Data successfully saved to {output_path}")
    except Exception as error:
        logging.error(f"Failed to save JSON file: {error}")
        raise RuntimeError("Error saving JSON file.")


def main() -> None:

    # ✅ Variable for file entered (modify this path as needed)
    pdf_file_path = "data/sample_resume.pdf"

    # Validate file existence
    if not os.path.isfile(pdf_file_path):
        logging.error(f"File not found: {pdf_file_path}")
        raise FileNotFoundError(f"The file '{pdf_file_path}' does not exist.")

    # Initialize extractor
    extractor = PDFTextExtractor(pdf_file_path)

    # Extract text
    extracted_data = extractor.extract_text()

    # Output JSON file path
    output_json_path = os.path.splitext(pdf_file_path)[0] + ".json"

    # Save extracted text to JSON
    save_to_json(extracted_data, output_json_path)

    # Display a preview of the extracted text
    print("\n--- Extraction Summary ---")
    print(f"File Name   : {extracted_data['file_name']}")
    print(f"Total Pages : {extracted_data['total_pages']}")
    print("\n--- Preview (First Page) ---")
    print(extracted_data["pages"][0]["text"][:500])


if __name__ == "__main__":
    main()