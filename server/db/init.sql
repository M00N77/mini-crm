create table if not exists users (
    id serial primary key,
    name varchar(255) not null,
    email varchar(255) unique not null,
    hashedPassword varchar(255) not null,
    createdAt timestamp default now()
);

CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    userId INTEGER REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'pending',
    createdAt TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contacts (
    id serial primary key,
    name varchar(255) not null,
    email varchar(255),
    phone varchar(255),
    userId int references users(id) on DELETE cascade,
    createdAt timestamp default now()
);

create table if not exists notes (
    id serial primary key,
    content text not null,
    contactId int references contacts(id) on delete cascade,
    createdAt timestamp default now()
);

create table if not exists refresh_tokens (
    id serial primary key,
    userId int references users(id) on delete cascade,
    jti varchar(255) not null unique,
    tokenHash varchar(255),
    expiresAt timestamp,
    createdAt timestamp default now()
);
