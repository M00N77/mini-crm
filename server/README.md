# Mini CRM

Мини-CRM для управления контактами, задачами и заметками. Готовый по дизайну фронтенд на Next.js подключён к REST API на Express + PostgreSQL с JWT-авторизацией (access + refresh с ротацией).

Монорепозиторий: **`client/mini-crm`** (фронтенд) + **`server`** (бэкенд).

## Содержание

- [Возможности](#возможности)
- [Технологии](#технологии)
- [Структура репозитория](#структура-репозитория)
- [Требования](#требования)
- [Быстрый старт](#быстрый-старт)
- [Переменные окружения](#переменные-окружения)
- [API](#api)
- [Архитектура фронтенда](#архитектура-фронтенда)
- [Авторизация: как работает](#авторизация-как-работает)
- [Соглашения и подводные камни](#соглашения-и-подводные-камни)
- [Скрипты](#скрипты)
- [Ограничения MVP](#ограничения-mvp)
- [Дальнейшие планы](#дальнейшие-планы)

## Возможности

- 🔐 **Авторизация** — регистрация, вход, выход; сессия переживает перезагрузку страницы (bootstrap через refresh + декод JWT).
- 👤 **Контакты** — список с клиентским поиском, создание/редактирование/удаление, боковой drawer с деталями.
- 📝 **Заметки** — привязаны к контакту, создание и удаление прямо из drawer'а.
- ✅ **Задачи** — канбан-доска с тремя колонками (Todo / In Progress / Done) и **drag-and-drop** для смены статуса, а также создание/редактирование/удаление.
- 📊 **Дашборд** — сводные метрики (контакты, задачи по статусам), последние контакты, ближайшие задачи, быстрое добавление задачи.

## Технологии

| Слой | Стек |
| --- | --- |
| Frontend | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4 |
| Drag-and-drop | `@hello-pangea/dnd` |
| Backend | Express 5, TypeScript (ts-node), PostgreSQL 17, `pg` |
| Auth | JWT access-токен (15 мин, Bearer) + refresh-токен в httpOnly-cookie `token` с ротацией |

## Структура репозитория

```
mini-crm/
├── client/
│   └── mini-crm/               # Next.js фронтенд
│       ├── middleware.ts       # гейт приватных роутов по наличию cookie `token`
│       ├── app/
│       │   ├── layout.tsx      # root layout + AuthProvider
│       │   ├── login/ , register/
│       │   ├── (main)/
│       │   │   ├── layout.tsx  # auth-гейт + AppShell
│       │   │   ├── dashboard/page.tsx
│       │   │   ├── contacts/page.tsx
│       │   │   └── tasks/page.tsx
│       │   └── components/      # прикладные компоненты
│       │       ├── ContactDrawer.tsx
│       │       ├── ContactFormModal.tsx
│       │       ├── TaskFormModal.tsx
│       │       ├── TaskBoard.tsx        # DnD-канбан
│       │       └── SettingsView.tsx
│       └── src/
│           ├── lib/
│           │   ├── api/         # client.ts · refresh.ts · tokenStore.ts · errors.ts
│           │   ├── auth/        # jwt.ts · bootstrap.ts · events.ts
│           │   ├── constants/   # pagination.ts
│           │   └── utils/       # time.ts (timeAgo)
│           ├── types/           # dto.ts (сырые) · domain.ts (чистые)
│           ├── features/        # contacts · tasks · notes · dashboard · auth (api.ts + mapper.ts)
│           ├── context/         # AuthProvider.tsx
│           └── components/       # UI-kit: atoms → molecules → organisms → pages
└── server/
    ├── index.ts                # точка входа, CORS, монтирование роутов
    ├── routes/                 # auth · contacts · notes · tasks
    ├── controllers/
    ├── services/
    └── db/
        └── init.sql            # схема БД (users, tasks, contacts, notes, refresh_tokens)
```

## Требования

- **Node.js** 18+ (рекомендуется LTS)
- **PostgreSQL** 17 (запущенный локально или удалённо)
- **npm**

## Быстрый старт

Нужно два терминала: один для бэкенда (порт **3000**), один для фронтенда (порт **3001**).

### 1. База данных

Бэкенд **не создаёт таблицы автоматически** — схему нужно применить вручную:

```bash
# создать БД (пример)
createdb mini_crm

# применить схему
psql -d mini_crm -f server/db/init.sql
```

Схема создаёт таблицы: `users`, `contacts`, `tasks`, `notes`, `refresh_tokens`.

### 2. Backend

```bash
cd server
npm install
# настроить подключение к PostgreSQL (см. раздел «Переменные окружения»)
npm start        # запуск через ts-node на :3000
```

> ⚠️ Запускать именно `npm start`. Проверьте, что CORS на бэкенде разрешает origin `http://localhost:3001` с `credentials: true` — иначе refresh-cookie не будет работать.
> 

### 3. Frontend

```bash
cd client/mini-crm
npm install
# файл .env.local с адресом API (см. ниже)
npm run dev      # :3001
```

Откройте <http://localhost:3001>, зарегистрируйте пользователя и войдите.

## Переменные окружения

**Frontend** — `client/mini-crm/.env.local`:

```
NEXT_PUBLIC_API_ROOT=http://localhost:3000
```

**Backend** — `server/.env` (значения под свою среду; названия переменных сверьте в конфиге сервера):

```
# Подключение к PostgreSQL
DATABASE_URL=postgres://user:password@localhost:5432/mini_crm
# Секреты JWT
JWT_ACCESS_SECRET=change_me
JWT_REFRESH_SECRET=change_me
PORT=3000
```

## API

Базовый URL: `http://localhost:3000`. Все прикладные эндпоинты требуют заголовок `Authorization: Bearer <accessToken>` и запрос с `credentials: 'include'`. Данные всех сущностей изолированы по `user_id` из JWT.

**Ответ списков** всегда в форме:

```json
{
  "data": [ /* ... */ ],
  "pagination": { "page": 1, "limit": 100, "offset": 0, "total": 42, "totalPages": 1, "hasMore": false }
}
```

Параметры пагинации: `?page=1&limit=10` (limit до 100).

### Auth

| Метод | Путь | Тело | Ответ |
| --- | --- | --- | --- |
| POST | `/auth/register` | `{ name, email, password }` | пользователь + access-токен (refresh в cookie) |
| POST | `/auth/login` | `{ email, password }` | пользователь + access-токен (refresh в cookie) |
| POST | `/auth/refresh` | — (refresh-cookie) | `{ accessToken }` |
| POST | `/auth/logout` | — | JSON-подтверждение |
| GET | `/users/me` | — (access-токен) | пользователь по токену (bootstrap сессии) |
| GET | `/users/:id` | — | пользователь (используется при bootstrap для получения `name`) |

> **Rate limit:** `/auth/login` и `/auth/register` — 5 запросов за 15 минут.
> 

### Contacts

| Метод | Путь | Тело | Ответ |  |
| --- | --- | --- | --- | --- |
| GET | `/contacts?page&limit` | — | `{ data, pagination }` |  |
| GET | `/contacts/:id` | — | `Contact \ | null` |
| POST | `/contacts` | `{ name, email, phone }` | 201, созданный контакт |  |
| PUT | `/contacts/:id` | `{ name, email, phone }` | 201, полная замена |  |
| DELETE | `/contacts/:id` | — | 200, удалённый контакт \ | null |

Поля контактов приходят в **snake_case** (`user_id`, `created_at`).

### Notes

| Метод | Путь | Тело | Ответ |
| --- | --- | --- | --- |
| GET | `/notes?page&limit` | — | `{ data, pagination }` (JOIN notes + contacts) |
| POST | `/notes` | `{ contactId, content }` | 201 |
| PUT | `/notes/:id` | `{ content }` | 200 |
| DELETE | `/notes/:id` | — | 200 |

> `GET /notes` — это JOIN: поля обеих таблиц в snake_case, при коллизии `id`/`created_at` побеждают поля из `notes`. Тело POST — **camelCase** (`contactId`), в отличие от остальных snake_case-эндпоинтов.
> 

### Tasks

| Метод | Путь | Тело | Ответ |  |
| --- | --- | --- | --- | --- |
| GET | `/tasks?page&limit` | — | `{ data, pagination }` |  |
| GET | `/tasks/:id` | — | `Task \ | null` |
| POST | `/tasks` | `{ title, description, status }` | 201 |  |
| PUT | `/tasks/:id` | `{ title, description, status }` | 201, **полная замена** |  |
| DELETE | `/tasks/:id` | — | 200, удалённая задача \ | null |

> Поля задач приходят в **camelCase** (`userId`, `createdAt`). `status` — обычный VARCHAR **без валидации на бэке**; допустимые значения задаёт фронтенд: `pending` / `in_progress` / `done` (по умолчанию `pending`). `PUT` перезаписывает все три поля — всегда отправляйте их целиком.
> 

## Архитектура фронтенда

Ответственность строго разделена: **транспорт** (`lib/api`) ≠ **авторизация** (`lib/auth`) ≠ **фичи** (`features`) ≠ **типы** (`types`).

- **DTO ≠ Domain.** `types/dto.ts` — сырые ответы сервера (snake/camel как есть). Каждый `features/*/mapper.ts` нормализует их в чистые camelCase-типы из `types/domain.ts`. **snake_case в UI не попадает никогда.**
- **`tokenStore` — in-memory замыкание** (`lib/api/tokenStore.ts`), а не React-контекст: access-токен нужен синхронно в не-React коде и не должен вызывать ре-рендеры. UI-сессия (`status`, `user`) живёт отдельно в `AuthProvider`.
- **`client.ts`** — обёртка `request<T>()` + `api.get/post/put/delete`: подставляет baseURL, `credentials: 'include'` и Bearer-токен; на `401` прозрачно рефрешит токен и повторяет запрос один раз.
- **Анти-гонка рефреша:** параллельные `401` ждут один общий `refreshAccessToken()` (флаг + очередь подписчиков), а не запускают несколько рефрешей.
- **Разлогин через event-bus** (`lib/auth/events.ts`): при неуспешном рефреше чистится токен и эмитится `logout`, на который `AuthProvider` сбрасывает пользователя и кэш данных.
- **Единый паттерн загрузки** на экранах: `status: 'idle' | 'loading' | 'success' | 'error'` вместо россыпи булевых флагов.
- **`DEFAULT_PAGE_SIZE = 100`** (`lib/constants/pagination.ts`); при `total > 100` экран показывает предупреждение «показаны первые 100».
- **Дашборд** ходит за данными через единый фасад `features/dashboard/api.ts` (`getDashboardData()` c `Promise.all`), а не дёргает `contactsApi`/`tasksApi` напрямую.

## Авторизация: как работает

1. **Вход/регистрация** → сервер кладёт refresh-токен в httpOnly-cookie `token` и возвращает access-токен + пользователя. Access хранится in-memory.
2. **Запросы** идут с `Authorization: Bearer` и `credentials: 'include'`.
3. **Протух access (401)** → `client.ts` вызывает `/auth/refresh` (по cookie) → получает новый access → повторяет исходный запрос.
4. **Перезагрузка страницы** (access потерян) → `bootstrapSession()`: `refresh` → декод JWT (`userId`) → `GET /users/:id` (получить `name`) → восстановление сессии.
5. **Разлогин** — при `401`/`403 Token Expired`/`No token provided` сессия считается завершённой: токен чистится, кэш сбрасывается, редирект на `/login`.
6. **Гейт роутов** — `middleware.ts` не пускает в приватные разделы без cookie `token` (убирает «моргание» лейаута), а реальный bootstrap/refresh делает `AuthProvider`.

## Соглашения и подводные камни

- **Алиас импортов:** `@/src/...`.
- **Разный нейминг полей:** `contacts` и `users` — snake_case; `tasks` — camelCase. Нормализация — обязанность мапперов.
- **Даты — строки ISO**, не `Date`. Относительное время считает утилита `timeAgo()` (`lib/utils/time.ts`).
- **Notes:** тело POST — camelCase `{ contactId, content }`; листинг — JOIN со snake_case.
- **Tasks PUT — полная замена:** всегда слать `{ title, description, status }` целиком.
- **CORS:** бэкенд должен разрешать origin `http://localhost:3001` с `credentials: true`.
- **В интеграции UI-kit не меняется** — только подключение данных.

## Скрипты

**Frontend** (`client/mini-crm`):

```bash
npm run dev     # дев-сервер на :3001
npm run build   # прод-сборка
npm run lint    # линт
npm start       # запуск прод-сборки
```

**Backend** (`server`):

```bash
npm start       # запуск через ts-node на :3000
```

## Ограничения MVP

- Пагинация — один запрос до 100 записей; полноценной серверной пагинации в UI пока нет (есть предупреждение при `total > 100`).
- Обратная связь об ошибках — нативные `alert()`/`confirm()` (тосты запланированы в редизайне).
- Поиск по контактам — клиентский (в пределах загруженной страницы).
- Порядок задач внутри колонки не сохраняется (на бэке нет поля порядка) — DnD персистит только смену статуса.
- У контактов нет полей «должность/компания» и «последняя активность» — в дашборде показываются email/телефон и дата создания.
- Тема оформления — только тёмная.

## Известные проблемы бэкенда

- **`controllers/auth.ts`** — отсутствует импорт `AppError` в `changePassword` (упадёт в рантайме); файл повреждён null-байтами.
- **`routes/users.ts`** — `/me` зарегистрирован после `/:id`, запрос `GET /me` никогда не достигает `getUserInfo`.
- **`controllers/users.ts`** — `getUserInfo` оборачивает ответ в `{ message: result }` вместо прямой отправки.
- **404 на not found** — contacts/tasks/notes сервисы возвращают `null`, контроллеры шлют 200 с пустым телом (в users — корректно 404).
- **HTTP статус PUT** — `updateContact` / `updateTask` возвращают 201 Created вместо 200 OK.
- **SQL-инъекция** — `utils/paginate.ts` интерполирует `fromClause` напрямую в `count(*)`.
- **Разный нейминг полей в API** — Tasks в camelCase, всё остальное в snake_case.
- **Нет валидации `/:id`** — ни один роут не проверяет, что id — положительное число.
- **Нет валидации `POST /users`** — отсутствует `validate()` middleware.
- **Pagination users** — `getAllUsers()` не использует `req.query.page/limit`.

## Дальнейшие планы

### Бэкенд — унификация
- Привести все ответы API к единому case (camelCase).
- Единый обработчик 404 (сервис кидает `AppError`, контроллер не проверяет `null`).
- Единый HTTP-статус для PUT (200).
- Единый нейминг функций в services/controllers.
- Явная проекция SELECT вместо `select *`.
- Валидация `/:id` через zod.
- Вынести `if (!req.user)` в middleware.

### Фронтенд — редизайн/полировка
Скелетоны вместо спиннеров, микроанимации, hover/focus-состояния, пустые состояния с иллюстрациями, тосты вместо `alert`, адаптив, опциональная светлая тема.

---

Подробный список — в `.mentor/roadmap.md`.