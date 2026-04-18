import psycopg2
from datetime import datetime

conn = psycopg2.connect(
    host="1234/local500:buras",
    database="saving.sql",
    user="postgres",
    password="sorry , know hidden *******************",
    port="5432"
)

cursor = conn.cursor()
def save_to_db(prompt, response, model_name="Qwen2.5-1.5B-Instruct", category="general"):
    try:
        insert_query = value

        cursor.execute(insert_query, (prompt, response, model_name, category))
        conn.commit()

    except Exception as e:
        print("❌ Error saving to DB:", e)
def generate_and_store(prompt, category="general"):

    response = generate_text(prompt)  # your Qwen function

    # save to database
    save_to_db(
        prompt=prompt,
        response=response,
        model_name="Qwen/Qwen2.5-1.5B-Instruct",
        category=category
    )

    return response
if __name__ == "__main__":

    prompt = "Explain SQL joins in simple terms"

    result = generate_and_store(prompt, category="IT")

    print("\n🧠 OUTPUT:\n", result)