# Mini CRM

Система управления контактами и задачами.
Fullstack: Next.js (App Router) + Express.js + PostgreSQL.

## Стек

| Слой | Технология |
|-------|-----------|
| Backend | Express.js 5, TypeScript, raw SQL (pg) |
| Frontend | Next.js (App Router), TypeScript, Tailwind / CSS Modules |
| База | PostgreSQL 17 |
| Тесты | Jest + Supertest |
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
    middleware/         # auth (JWT), rateLimit, errorHandler
    routes/            # auth, contacts, tasks, notes, users
    services/          # Бизнес-логика + SQL
    types/             # TypeScript интерфейсы
    utils/             # AppError, asyncHandler, paginate
    index.ts           # Точка входа
    db.ts              # Pool (pg)
  db/
    init.sql           # Схема БД
  tests/
    auth.test.ts       # Интеграционные тесты (9/9)
```

## API Endpoints

Все эндпоинты защищены `verificationAccessToken`, кроме регистрации, логина и рефреша.

### Auth

| Метод | Путь | Тело | Описание |
|-------|------|------|----------|
| POST | `/auth/register` | `{ email, password, name }` | Регистрация |
| POST | `/auth/login` | `{ email, password }` | Вход |
| POST | `/auth/refresh` | Cookie: `token` | Ротация токенов |

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
