--- major file name 
CREATE TABLE ai_responses (
    id SERIAL PRIMARY KEY,
    prompt TEXT NOT NULL,
    response TEXT NOT NULL,
    model_name VARCHAR(100),
    category VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


 --- creational data base 