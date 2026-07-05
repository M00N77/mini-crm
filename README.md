# Mini CRM

Система управления контактами и задачами.
Fullstack: Next.js (App Router) + Express.js + PostgreSQL.

## Стек

| Слой | Технология |
|-------|-----------|
| Backend | Express.js 5, TypeScript, raw SQL (pg) |
| Frontend | Next.js (App Router), TypeScript, Tailwind / CSS Modules |
| База | PostgreSQL 17 |
| Тесты | Jest + Supertest (58 тестов) |
| Rate Limit | express-rate-limit |
| Инфра | Docker Compose |

## Быстрый старт

```bash
cp .env.example .env    # настроить параметры БД
docker compose up --build

# Frontend (отдельный терминал)
cd client && npm run dev
```

- Backend API: http://localhost:3000
- Frontend: http://localhost:3001

## Структура

```
mini-crm/
  client/              # Frontend (Next.js)
  server/              # Backend (Express.js)
    controllers/       # Обработчики запросов
    middleware/         # auth (JWT), errorHandler
    routes/            # auth, contacts, tasks, notes, users
    services/          # Бизнес-логика + SQL
    types/             # TypeScript интерфейсы
    utils/             # AppError, asyncHandler, paginate
    index.ts           # Точка входа
    db.ts              # Pool (pg)
  db/
    init.sql           # Схема БД
  tests/
    auth.test.ts       # Базовые тесты auth (9)
    endpoints.test.ts  # Полные тесты всех эндпоинтов (49)
```

## API Endpoints

Все эндпоинты защищены `verificationAccessToken`, кроме регистрации, логина, рефреша и логаута.  
На `/auth/register` и `/auth/login` установлен `authLimiter` (5 запросов за 15 минут).

### Auth

| Метод | Путь | Тело | Описание |
|-------|------|------|----------|
| POST | `/auth/register` | `{ email, password, name }` | Регистрация (authLimiter) |
| POST | `/auth/login` | `{ email, password }` | Вход (authLimiter) |
| POST | `/auth/refresh` | Cookie: `token` | Ротация токенов |
| POST | `/auth/logout` | Cookie: `token` | Выход |

### Contacts

| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/contacts` | Все контакты (пагинация) |
| GET | `/contacts/:id` | Контакт по ID |
| POST | `/contacts` | Создать |
| PUT | `/contacts/:id` | Обновить |
| DELETE | `/contacts/:id` | Удалить |

### Tasks

| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/tasks` | Все задачи (пагинация) |
| GET | `/tasks/:id` | Задача по ID |
| POST | `/tasks` | Создать |
| PUT | `/tasks/:id` | Обновить |
| DELETE | `/tasks/:id` | Удалить |

### Notes

| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/notes` | Все заметки (пагинация) |
| GET | `/notes/:id` | Заметка по ID |
| POST | `/notes` | Создать |
| PUT | `/notes/:id` | Обновить |
| DELETE | `/notes/:id` | Удалить |

### Users

| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/users` | Все пользователи |
| GET | `/users/:id` | Пользователь по ID |
| POST | `/users` | `{ email, password, name }` | Создать пользователя |
| DELETE | `/users/:id` | Удалить |

## Аутентификация

- **Access Token** — JWT, живёт 15 минут, передаётся в `Authorization: Bearer <token>`
- **Refresh Token** — JWT + jti, живёт 7 дней, хранится в httpOnly cookie и БД (sha256)
- Ротация: старый refresh token удаляется из БД, выдаётся новая пара

## Тесты

```bash
npm test
# или
npm run test:watch
```
