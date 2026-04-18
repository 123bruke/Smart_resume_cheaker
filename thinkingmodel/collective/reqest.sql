CREATE TABLE model_judgements (
    id SERIAL PRIMARY KEY,
    input_text TEXT NOT NULL,
    prediction VARCHAR(10) NOT NULL CHECK (prediction IN ('PASS', 'FAIL')),
    confidence_pass FLOAT,
    confidence_fail FLOAT,
    model_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);