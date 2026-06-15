create table if not exists users (
    id serial primary key,
    name varchar(100) not null,
    email varchar(255) unique not null,
    hashed_password varchar(60) not null,
    created_at timestamp default now()
    );

CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW()
);
