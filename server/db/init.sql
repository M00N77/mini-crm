create table if not exists users (
    id serial primary key,
    name varchar(255) not null,
    email varchar(255) unique not null,
    hashed_password varchar(255) not null,
    created_at timestamp default now() not null
);

CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    position INTEGER not null,
    description TEXT,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE not null,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_tasks_user_id on tasks(user_id);

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'chk_tasks_status'
    ) THEN
        ALTER TABLE tasks ADD CONSTRAINT chk_tasks_status
            CHECK (status IN ('pending', 'in_progress', 'done'));
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS contacts (
    id serial primary key,
    name varchar(255) not null,
    email varchar(255),
    phone varchar(255),
    company varchar(255),
    job_position varchar(255),
    user_id int references users(id) on DELETE cascade not null,
    created_at timestamp default now() not null
);
CREATE INDEX IF NOT EXISTS idx_contacts_user_id ON contacts(user_id);

create table if not exists notes (
    id serial primary key,
    content text not null,
    contact_id int references contacts(id) on delete cascade not null,
    created_at timestamp default now() not null
);
CREATE INDEX IF NOT EXISTS idx_notes_contact_id on notes(contact_id);

create table if not exists refresh_tokens (
    id serial primary key,
    user_id int references users(id) on delete cascade not null,
    jti varchar(255) not null unique,
    token_hash varchar(255) not null,
    expires_at timestamp not null,
    revoked_at timestamp null,
    created_at timestamp default now() not null
);
create INDEX if not exists idx_refresh_tokens_user_id on refresh_tokens(user_id);