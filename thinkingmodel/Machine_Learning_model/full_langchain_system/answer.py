def summarize_text(pdf_extraction_text, dataset_context):
    
    prompt = f"""
You are an expert AI summarizer.

Use both:
1. User extracted PDF text
2. Knowledge base from dataset

TASK:
- Merge understanding
- Remove noise
- Give VERY SHORT summary (3-6 lines max)

---

📄 PDF TEXT:
{pdf_extraction_text}

---

📚 DATASET CONTEXT:
{dataset_context}

---

✍️ FINAL SHORT SUMMARY:
"""

    messages = [
        {"role": "user", "content": prompt},
    ]

    inputs = tokenizer.apply_chat_template(
        messages,
        add_generation_prompt=True,
        tokenize=True,
        return_dict=True,
        return_tensors="pt",
    ).to(model.device)

    outputs = model.generate(
        **inputs,
        max_new_tokens=120,
        temperature=0.3,
        top_p=0.9
    )

    result = tokenizer.decode(
        outputs[0][inputs["input_ids"].shape[-1]:],
        skip_special_tokens=True
    )

    return result
if __name__ == "__main__":

    # Example: text from PDF extraction system
    pdf_extraction = """
    Artificial intelligence is widely used in healthcare for diagnosis,
    prediction of diseases, and medical imaging analysis. It improves
    efficiency in hospitals and reduces human error.
    """

    print("📥 Loading dataset...")
    dataset_context = load_dataset("model_data")

    print("🧠 Generating summary...")
    summary = summarize_text(pdf_extraction, dataset_context)

    print("\n===== FINAL SUMMARY =====")
    print(summary)