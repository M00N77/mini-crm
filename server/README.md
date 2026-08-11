# Mini CRM — Backend

REST API мини-CRM для управления контактами, задачами и заметками. Express 5 + TypeScript + PostgreSQL 17, JWT-авторизация (access + refresh с ротацией).

Монорепозиторий: **`server`** (бэкенд) + **`client/mini-crm`** (фронтенд на Next.js).

## Содержание

- [Технологии](#технологии)
- [Структура](#структура)
- [Требования](#требования)
- [Быстрый старт](#быстрый-старт)
- [Переменные окружения](#переменные-окружения)
- [Тесты](#тесты)
- [API](#api)
- [Авторизация: как работает](#авторизация-как-работает)
- [Соглашения](#соглашения)
- [Скрипты](#скрипты)
- [Ограничения MVP](#ограничения-mvp)

## Технологии

| Слой | Стек |
| --- | --- |
| Рантайм | Node.js 18+, TypeScript, `ts-node` |
| HTTP | Express 5, `cors`, `cookie-parser`, `express-rate-limit` |
| БД | PostgreSQL 17, `pg` (пул соединений) |
| Валидация | `zod` |
| Auth | JWT (HS256): access-токен 15 мин (Bearer) + refresh-токен 7 дней (httpOnly-cookie `token`) с ротацией |
| Тесты | `vitest` + `supertest` |

## Структура

```
server/
├── index.ts                # точка входа, слушает :3000
├── app.ts                  # express-app: CORS, middleware, монтирование роутов
├── db.ts                   # пул pg; в test-режиме читает .env.test
├── routes/                 # auth · users · tasks · contacts · notes
├── controllers/            # тонкие: разбор req → вызов сервиса → ответ
├── services/               # бизнес-логика, SQL-запросы
├── repositories/           # (auth) низкоуровневые запросы с PoolClient
├── mappers/                # DTO: нормализация snake_case → camelCase
├── middleware/             # auth (JWT), validateUser, validate, validateId, errorHandler
├── schemas/                # zod-схемы тел запросов
├── utils/                  # paginate (транзакционный), sort (whitelist-маппер), generateTokenPair, AppError, asyncHandler
├── types/                  # TokenPayload и др.
├── db/init.sql             # схема БД: users, contacts, tasks, notes, refresh_tokens
├── tests/
│   ├── auth.test.ts        # unit: POST /auth/* (мок `pg`)
│   ├── endpoints.test.ts   # unit: контакты/задачи/заметки/пользователи (мок `pg`)
│   ├── sort.test.ts        # unit: resolveSort (whitelist-маппер сортировки)
│   └── integration/        # e2e против реальной Postgres
│       ├── auth.test.ts    #   auth: register / login / refresh
│       ├── resources.test.ts  #   contacts / tasks / notes (CRUD, изоляция владельцев)
│       └── helpers/db.ts   #   ensureSchema (drop + init.sql), truncateAll
├── vitest.config.ts
├── .env.test               # окружение для тестов (закоммичен)
└── README.md
```

## Требования

- **Node.js** 18+ (рекомендуется LTS)
- **PostgreSQL** 17 (локально или удалённо)

## Быстрый старт

Бэкенд не создаёт таблицы автоматически — схему применяем вручную:

```bash
# создать БД и применить схему (пример, имена/порты из server/.env)
createdb "mini-crm"
psql -d "mini-crm" -f server/db/init.sql

# запуск бэкенда на :3000
cd server
npm install
# создайте server/.env по разделу «Переменные окружения» (JWT_SECRET обязателен)
npm run dev
```

> Запускать через `npm run dev` (nodemon) или `npm start` (ts-node). CORS-разрешённый origin фронтенда настраивается через `CORS_ORIGIN` (по умолчанию `http://localhost:3001`, `credentials: true`).

## Переменные окружения

**Backend — `server/.env`** (в тестах `db.ts` автоматически грузит `.env.test`):

```
# Подключение к PostgreSQL — либо DATABASE_URL целиком, либо DB_* по частям
DATABASE_URL=postgres://user:password@localhost:5432/mini_crm
# или
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=1234
DB_NAME=mini_crm

# Обязательный секрет JWT — сервис падает при старте, если не задан
JWT_SECRET=change_me

# CORS-разрешённый origin фронтенда (credentials: true)
CORS_ORIGIN=http://localhost:3001

PORT=3000
```

> **`JWT_SECRET` обязателен.** Один секрет на оба токена; access и refresh различаются только полем `jti` и сроком жизни. Никакого дефолта в коде нет — старт без секрета завершится ошибкой.

**`.env.test`** (для тестов):

```
DB_HOST=localhost
DB_PORT=5433
DB_USER=postgres
DB_PASSWORD=1234
DB_NAME=mini_crm_test
JWT_SECRET=test-secret
```

## Тесты

Два уровня: unit (моки `pg`, без БД) и интеграционные (реальная Postgres на `:5433`, тестовая БД `mini_crm_test`).

```bash
cd server
npm run test:unit    # unit-тесты: tests/auth.test.ts, tests/endpoints.test.ts, tests/sort.test.ts
npm test             # интеграционные: tests/integration (auth, contacts, tasks, notes)
npm run test:all     # всё вместе
```

> Интеграционные тесты требуют запущенного PostgreSQL на `DB_PORT=5433` (см. `.env.test`). Схема тестовой БД пересоздаётся на каждый запуск из `db/init.sql` (`ensureSchema` дропает таблицы и применяет схему заново), поэтому всегда совпадает с текущим скриптом.

## API

Базовый URL: `http://localhost:3000`. Все прикладные эндпоинты требуют заголовок `Authorization: Bearer <accessToken>` и запрос с `credentials: 'include'`. Данные изолированы по `userId` из JWT: доступ к чужому ресурсу → `404`, чужая запись в `/users` → `403`.

**Ответ списков** всегда:

```json
{
  "data": [ /* ... */ ],
  "pagination": { "page": 1, "total": 42, "totalPages": 5, "hasMore": true }
}
```

Параметры списков:

- `?page=1&limit=10` — пагинация (`limit` до 100). `count(*)` и выборка данных выполняются в одной транзакции — снапшот консистентен.
- `?sortBy=<ключ>&order=asc|desc` — сортировка. Ключи задаются **whitelist-маппером** на стороне сервиса (см. таблицы ниже); неизвестный `sortBy` или `order` тихо игнорируются → сортировка по умолчанию (`id asc`). В `ORDER BY` попадают только проверенные колонки, клиентский ввод в SQL не интерполируется.

### Auth

| Метод | Путь | Тело | Ответ |
| --- | --- | --- | --- |
| POST | `/auth/register` | `{ name, email, password }` | 201: `{ user, accessToken }` + refresh в cookie |
| POST | `/auth/login` | `{ email, password }` | 200: `{ user, accessToken }` + refresh в cookie |
| POST | `/auth/refresh` | — (refresh-cookie) | 200: `{ accessToken }` + новый refresh в cookie |
| POST | `/auth/logout` | — | 200: сообщение |
| POST | `/auth/changepass` | `{ oldPassword, newPassword }` | 200 (отзывает все refresh-токены пользователя) |

> **Rate limit:** `/auth/login`, `/auth/register`, `/auth/logout`, `/auth/changepass` — 5 запросов за 15 минут. В тестах (`NODE_ENV=test`) лимит отключён.
> **Повторное использование refresh-токена:** валидный по подписи JWT, jti которого нет в БД → все сессии пользователя отзываются (`401 Token reuse detected`); уже отозванный токен → `401` без отзыва сессий.

### Users

| Метод | Путь | Ответ |
| --- | --- | --- |
| GET | `/users?page&limit&sortBy&order` | 200: `{ data, pagination }` — профиль текущего пользователя |
| GET | `/users/me` | 200: текущий пользователь (bootstrap сессии) |
| GET | `/users/:id` | 200 / `403` (не свой id) / `404` |
| DELETE | `/users/:id` | 200 / `403` / `404` |

> `POST /users` отсутствует намеренно — регистрация только через `/auth/register`. Список `/users` возвращает только профиль владельца токена. `sortBy` для списка: `email`, `name`, `createdAt`.

### Contacts

| Метод | Путь | Тело | Ответ |
| --- | --- | --- | --- |
| GET | `/contacts?page&limit&sortBy&order` | — | `{ data, pagination }` |
| GET | `/contacts/:id` | — | 200 / `404` |
| POST | `/contacts` | `{ name, email, phone, company?, jobPosition? }` | 201 |
| PUT | `/contacts/:id` | `{ name, email, phone, company?, jobPosition? }` | 200, полная замена |
| DELETE | `/contacts/:id` | — | 200 / `404` |

> Валидируются обязательные `name`/`email`/`phone`; `company` и `jobPosition` — опционально. `sortBy` для списка: `name`, `email`, `phone`, `company`, `jobPosition`, `createdAt`.

### Notes

| Метод | Путь | Тело | Ответ |
| --- | --- | --- | --- |
| GET | `/notes?page&limit&sortBy&order` | — | `{ data, pagination }` (JOIN notes + contacts, только свои) |
| GET | `/notes/:id` | — | 200 / `404` |
| POST | `/notes` | `{ contactId, content }` | 201 / `404` (чужой или несуществующий контакт) |
| PATCH | `/notes/:id` | `{ content }` | 200 / `404` |
| DELETE | `/notes/:id` | — | 200 / `404` |

> `POST /notes` атомарен: проверка владения контактом и вставка — одним запросом, без гонки. `PATCH /notes/:id` также атомарен (`UPDATE ... FROM`): проверка владения и изменение не разделяются на два запроса. `sortBy` для списка: `content`, `createdAt`.

### Tasks

| Метод | Путь | Тело | Ответ |
| --- | --- | --- | --- |
| GET | `/tasks?page&limit&sortBy&order` | — | `{ data, pagination }` |
| GET | `/tasks/:id` | — | 200 / `404` |
| POST | `/tasks` | `{ title, description?, status, position? }` | 201 |
| PUT | `/tasks/:id` | `{ title, description?, status, position }` | 200, полная замена |
| PATCH | `/tasks/:id` | любое подмножество полей (минимум одно) | 200, частичное обновление |
| DELETE | `/tasks/:id` | — | 200 / `404` |

> **`status` строго валидируется на двух уровнях:** zod-схема (`z.enum`) → `400` на невалидное значение, и CHECK-constraint `chk_tasks_status` в PostgreSQL (код ошибки `23514`) — защита на случай вставки мимо API. Допустимые значения: `pending`, `in_progress`, `done`.
>
> **Семантика методов:** `PUT` — идемпотентная полная замена (все поля обязательны, включая `position`). `PATCH` — частичное обновление (например, только `{ status }` для канбан-колонок); пустое тело → `400`.
>
> `sortBy` для списка: `title`, `status`, `position`, `createdAt`.

## Авторизация: как работает

1. **Вход/регистрация** → сервер кладёт refresh-токен в httpOnly-cookie `token` (7 дней) и возвращает access-токен (15 мин) + пользователя.
2. **Запросы** идут с `Authorization: Bearer` и `credentials: 'include'`.
3. **Протух access (401)** → фронт вызывает `/auth/refresh` (по cookie) → получает новый access → повторяет запрос.
4. **Ротация refresh**: при каждом refresh старый токен отзывается (`revoked_at`), выдаётся новая пара. Повторное использование отозванного токена в течение 15 секунд → `409 Concurrent refresh request` (анти-гонка параллельных рефрешей).
5. **Смена пароля** → отзыв всех refresh-токенов пользователя.
6. **Разлогин** → удаление refresh-токена из БД + очистка cookie.

## Соглашения

- **DTO-мапперы приводят ответы к camelCase** (`userId`, `jobPosition`, `createdAt`) — в базе snake_case, наружу camelCase. `hashed_password` наружу не попадает.
- **Тела запросов** — camelCase (например, `POST /notes` → `{ contactId, content }`).
- **Ошибки** — единый формат через `AppError` + `errorHandler`: `{ error: string }` со статусом 400/401/403/404/409/500.
- **Валидация** — zod-схемы на входе роутов; `validateId` — на параметр `:id`.
- **`paginate()`** — count и выборка в одной транзакции (консистентный снапшот). `fromClause` и `userIdColumn` — только из whitelist-наборов; `columns`, `orderBy`, `orderDir` проходят identifier-гейты и whitelist направления. Клиентский ввод (`?sortBy`, `?order`) до SQL не доходит — его транслирует `resolveSort` через whitelist-маппер.
- **Owner-проверки** — везде берутся из JWT (`req.user.userId`), параметрам/телу не доверяем.

## Скрипты

```bash
npm start        # прод-запуск через ts-node на :3000
npm run dev      # dev-режим (nodemon)
npm test         # интеграционные тесты
npm run test:unit    # unit-тесты
npm run test:all     # все тесты
npm run test:watch   # watch-режим интеграционных
```

## Ограничения MVP

- Пагинация — до 100 записей на страницу; полноценной серверной пагинации в UI пока нет.
- Сортировка — только по фиксированным whitelist-колонкам (без произвольных выражений, без сортировки по вложенным полям).
- Нет полноценного admin/role-контроля: `GET/DELETE /users/:id` ограничены владельцем, но ролевой модели нет.
- Rate limit — только на `/auth/*`; остальные эндпоинты без лимитов.
