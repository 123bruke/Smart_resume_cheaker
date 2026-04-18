def load_dataset(base_path="model_data"):
    all_texts = []

    for root, dirs, files in os.walk(base_path):
        for file in files:
            if file.endswith(".json"):
                file_path = os.path.join(root, file)

                try:
                    with open(file_path, "r", encoding="utf-8") as f:
                        data = json.load(f)

                        # Convert JSON → text safely
                        text_block = json.dumps(data, ensure_ascii=False)

                        all_texts.append(text_block)

                except Exception as e:
                    print(f"Error reading {file_path}: {e}")

    return "\n".join(all_texts)
