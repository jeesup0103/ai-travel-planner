CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE,
    name VARCHAR(255),
    picture VARCHAR(255),
    role VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS user_preferences (
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    preference VARCHAR(255)
);
