


create table if not exists users (
    id serial primary key,
    name varchar(255) not null,
    email varchar(255) unique not null,
    hashed_password varchar(255) not null,
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

CREATE TABLE IF NOT EXISTS contacts (
    id serial primary key,
    name varchar(255) not null,
    email varchar(255) ,
    phone varchar(255) ,
    user_id int references users(id) on DELETE cascade ,
    created_at timestamp default now()
);

create table if not exists notes (
    id serial primary key,
    content text not null,
    contact_id int references contacts(id) on delete cascade,
    created_at timestamp default now()
);

create table if not exists refresh_tokens (
    id serial primary key,
    user_id int references  users(id) on delete cascade,
    token_hash varchar(255),
    expires_at timestamp,
    created_at timestamp default now()
) ;