-- ── UP: Migration 001 — Add Google OAuth support to users table ──
BEGIN;

-- 1. Разрешаем NULL для пароля (для пользователей, авторизованных исключительно через Google)
ALTER TABLE users ALTER COLUMN hashed_password DROP NOT NULL;

-- 2. Добавляем колонку google_sub с уникальным индексом
ALTER TABLE users ADD COLUMN IF NOT EXISTS google_sub VARCHAR(255) UNIQUE;

-- 3. Добавляем CHECK constraint: пользователь обязан иметь хотя бы один способ входа
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'auth_method_required'
    ) THEN
        ALTER TABLE users ADD CONSTRAINT auth_method_required 
            CHECK (hashed_password IS NOT NULL OR google_sub IS NOT NULL);
    END IF;
END $$;

COMMIT;
