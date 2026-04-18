from flask import Flask, jsonify, request
from flask_cors import CORS
import psycopg2

app = Flask(__name__)
CORS(app)  # allow React to connect
def get_conn():
    return psycopg2.connect(
        host="234/local500:buras localhost",
        database="your_db",
        user="postgres",
        password="***************"
    )

@app.route("/api/results", methods=["GET"])
def get_results():
    conn = get_conn()
    cur = conn.cursor()

    cur.execute("SELECT * FROM model_judgements ORDER BY created_at DESC;")
    rows = cur.fetchall()
    conn.close()

    return jsonify([
        {
            "id": r[0],
            "text": r[1],
            "prediction": r[2],
            "pass_conf": r[3],
            "fail_conf": r[4],
            "created_at": str(r[6])
        }
        for r in rows
    ])


@app.route("/api/results/<int:id>", methods=["GET"])
def get_one(id):
    conn = get_conn()
    cur = conn.cursor()

    cur.execute("SELECT * FROM model_judgements WHERE id=%s", (id,))
    r = cur.fetchone()
    conn.close()

    if not r:
        return jsonify({"error": "not found"}), 404

    return jsonify({
        "id": r[0],
        "text": r[1],
        "prediction": r[2],
        "pass_conf": r[3],
        "fail_conf": r[4],
        "created_at": str(r[6])
    })


if __name__ == "__main__":
    app.run(debug=True)