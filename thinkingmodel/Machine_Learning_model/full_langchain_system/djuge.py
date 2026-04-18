from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch

model_name = "facebook/bart-large-mnli"

tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSequenceClassification.from_pretrained(model_name)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)
model.eval()
def judge_pass_fail(text):
    
    labels = ["PASS", "FAIL"]
    hypotheses = [
        f"This sentence means PASS",
        f"This sentence means FAIL"
    ]

    scores = []

    for hypothesis in hypotheses:
        inputs = tokenizer(
            text,
            hypothesis,
            return_tensors="pt",
            truncation=True
        ).to(device)

        with torch.no_grad():
            logits = model(**inputs).logits

        # convert logits → probability
        probs = torch.softmax(logits, dim=1)

        # take "entailment" score (index 2 for MNLI models)
        score = probs[0][2].item()
        scores.append(score)

    # choose best label
    best_index = scores.index(max(scores))

    return labels[best_index], scores

if __name__ == "__main__":

    sentence = summary

    result, confidence = judge_pass_fail(sentence)

    print("🧠 Sentence:", sentence)
    print("📊 Result:", result)
    print("📈 Confidence:", confidence)