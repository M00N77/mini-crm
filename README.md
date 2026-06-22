# Mini CRM

Система управления контактами и задачами для небольших команд.
Fullstack: Next.js (App Router) + Express.js + PostgreSQL.

## Стек

| Слой | Технология |
|-------|-----------|
| Backend | Express.js, TypeScript, raw SQL (pg) |
| Frontend | Next.js (App Router), TypeScript, Tailwind / CSS Modules |
| База | PostgreSQL 17 |
| Инфра | Docker Compose |

## Быстрый старт

```bash
# Backend + БД
docker compose up --build

# Frontend (отдельный терминал)
cd client && npm run dev
```

- Backend API: http://localhost:3000
- Frontend: http://localhost:3001 (Next.js dev)

## Структура

```
mini-crm/
  client/          # Frontend (Next.js)
    src/
      app/         # Страницы (App Router)
      components/  # UI-компоненты
      api/         # Fetch-обёртки к Express
      tokens/      # Дизайн-токены (CSS variables)
  server/          # Backend (Express.js)
    controllers/
    middleware/
    routes/        # auth, contacts, tasks, notes
    services/
    types/
  db/              # SQL миграции
  compose.yaml     # Docker Compose
```

## API Endpoints

| Метод | Путь | Описание |
|--------|------|----------|
| POST | `/api/auth/register` | Регистрация |
| POST | `/api/auth/login` | Вход |
| POST | `/api/auth/refresh` | Обновление токена |
| GET | `/api/contacts` | Все контакты |
| POST | `/api/contacts` | Создать контакт |
| GET | `/api/contacts/:id` | Контакт + заметки |
| GET | `/api/tasks` | Все задачи |
| POST | `/api/tasks` | Создать задачу |
| PATCH | `/api/tasks/:id/status` | Обновить статус |
| GET | `/api/notes/:contactId` | Заметки контакта |
| POST | `/api/notes` | Добавить заметку |

## Frontend Roadmap

Фронтенд строится в 6 этапов:

1. **Фундамент** — Next.js, дизайн-токены, иконки, Storybook
2. **Примитивы** — Button, Input, Badge, Avatar, Typography, Divider
3. **Составные компоненты** — Card, SearchInput, IconButton
4. **Оверлеи** — Drawer, Dropdown
5. **Страницы и роутинг** — App Router
6. **API-интеграция** — подключение к Express

Подробнее: `.mentor/concepts/frontend-roadmap.md`.
