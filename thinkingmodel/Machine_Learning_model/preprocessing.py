import torch
from transformers import AutoTokenizer, AutoModelForCausalLM, BitsAndBytesConfig

model_name = "Qwen/Qwen2.5-1.5B-Instruct"

device = "cuda" if torch.cuda.is_available() else "cpu"
print(f"🔥 Using device: {device}")

use_4bit = torch.cuda.is_available()

quant_config = None

if use_4bit:
    quant_config = BitsAndBytesConfig(
        load_in_4bit=True,                  # compress model
        bnb_4bit_compute_dtype=torch.float16,
        bnb_4bit_quant_type="nf4",          # best quality compression
        bnb_4bit_use_double_quant=True      # better accuracy
    )


tokenizer = AutoTokenizer.from_pretrained(
    model_name,
    use_fast=True,              
    trust_remote_code=True      
)

if tokenizer.pad_token is None:
    tokenizer.pad_token = tokenizer.eos_token

model = AutoModelForCausalLM.from_pretrained(
    model_name,

    # 🔥 speed + memory optimization
    torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32,

    # 🔥 automatically place model on GPU/CPU
    device_map="auto",

    # 🔥 trust remote architecture (Qwen needs it)
    trust_remote_code=True,

    # 🔥 quantization (only if GPU available)
    quantization_config=quant_config,

    low_cpu_mem_usage=True
)

model.eval()
def generate_text(prompt, max_tokens=200, temperature=0.3, top_p=0.9):
    messages = [{"role": "user", "content": prompt}]

    inputs = tokenizer.apply_chat_template(
        messages,
        add_generation_prompt=True,
        tokenize=True,
        return_tensors="pt"
    ).to(model.device)

    with torch.no_grad():  # 🔥 saves memory + faster
        outputs = model.generate(
            **inputs,
            max_new_tokens=max_tokens,
            temperature=temperature,
            top_p=top_p,
            do_sample=True,
            pad_token_id=tokenizer.eos_token_id
        )

    result = tokenizer.decode(
        outputs[0][inputs["input_ids"].shape[-1]:],
        skip_special_tokens=True
    )

    return result
if __name__ == "__main__":
    test_prompt = "Explain artificial intelligence in simple terms."

    response = generate_text(test_prompt)

    print("\n🧠 MODEL OUTPUT:\n")
    print(response)
