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

CREATE TABLE IF NOT EXISTS chat_sessions (
    id SERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    chat_session_id BIGINT REFERENCES chat_sessions(id) ON DELETE CASCADE,
    text TEXT,
    sender VARCHAR(10),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ai_recommendations (
  message_id BIGINT PRIMARY KEY REFERENCES messages(id)      ON DELETE CASCADE,
  query TEXT NOT NULL,
  summary TEXT NOT NULL,
  routes JSONB NOT NULL,   -- e.g. [ {origin:…,destination:…,mode:…}, … ]
  places JSONB NOT NULL,   -- e.g. [ {name:…,address:…,rating:…,lat:…,lng:…}, … ]
  tips JSONB NOT NULL    -- e.g. [ “Book ahead…”, “Try the local fare”, … ]
);