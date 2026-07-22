create table if not exists users (
    id serial primary key,
    name varchar(255) not null,
    email varchar(255) unique not null,
    hashedPassword varchar(255) not null,
    createdAt timestamp default now() not null
);

CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    userId INTEGER REFERENCES users(id) ON DELETE CASCADE not null,
    status VARCHAR(20) DEFAULT 'pending',
    createdAt TIMESTAMP DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_tasks_userid on tasks(userId);

CREATE TABLE IF NOT EXISTS contacts (
    id serial primary key,
    name varchar(255) not null,
    email varchar(255),
    phone varchar(255),
    userId int references users(id) on DELETE cascade not null,
    createdAt timestamp default now() not null
);
CREATE INDEX IF NOT EXISTS idx_contacts_userid ON contacts(userId);

create table if not exists notes (
    id serial primary key,
    content text not null,
    contactId int references contacts(id) on delete cascade not null,
    createdAt timestamp default now()
);
CREATE INDEX IF NOT EXISTS  idx_notes_contactid on notes(contactId);

create table if not exists refresh_tokens (
    id serial primary key,
    userId int references users(id) on delete cascade not null,
    jti varchar(255) not null unique,
    tokenHash varchar(255) not null,
    expiresAt timestamp not null,
    createdAt timestamp default now() not null
);
create INDEX if not exists idx_refreshes_userid on refresh_tokens(userId);
