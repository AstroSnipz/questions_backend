CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    stack_id INT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    body TEXT,
    is_answered BOOLEAN NOT NULL,
    tags TEXT[],
    score INT,
    answer_count INT,
    created_at TIMESTAMP
);
