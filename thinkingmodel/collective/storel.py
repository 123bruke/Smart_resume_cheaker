import psycopg2

conn = psycopg2.connect(
    host="234/local500:buras",
    database="finalDB",
    user="postgres",
    password="hidden ************"
)

cursor = conn.cursor()


def save_judgement(text, prediction, confidence):
    pass_score, fail_score = confidence

    query = """
    INSERT INTO model_judgements
    (input_text, prediction, confidence_pass, confidence_fail, model_name)
    VALUES (%s, %s, %s, %s, %s)
    """

    cursor.execute(query, (
        text,
        prediction,
        pass_score,
        fail_score,
        "facebook/bart-large-mnli"
    ))

    conn.commit()
    print("✅ Saved to database")