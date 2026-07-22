# Roadmap — Mini CRM

---

## 🔙 Backend (Express + PostgreSQL)

### Auth

- [x] POST /api/auth/register — создание пользователя + httpOnly refresh-cookie
- [x] POST /api/auth/login — JWT access + httpOnly refresh-cookie
- [x] POST /api/auth/logout — очистка refresh-куки
- [x] POST /api/auth/refresh — продление access через httpOnly refresh-cookie
- [x] Rate limit: auth (5/15m) на register/login/logout/changepass
- [x] Фикс SQL-инъекции в logout (параметризованный запрос)
- [x] POST /auth/changepass — смена пароля (oldPassword + newPassword), проверка совпадения старого пароля и различия нового от старого
- [x] /me — получение профиля по токену
- [ ] POST /auth/forgot-password + /auth/reset-password — сброс пароля без логина через одноразовый токен на email (требует SMTP-сервис, пока не настроен — отложено)
- [x] Валидация входных данных через zod — auth-роуты, contacts/tasks/notes

### Contacts

- [x] CRUD endpoint'ы (GET list с пагинацией, GET by id, POST, PUT, DELETE)

### Tasks

- [x] CRUD endpoint'ы (GET list с пагинацией, GET by id, POST, PUT, DELETE)

### Notes

- [x] CRUD endpoint'ы (GET list с пагинацией, GET by id, POST, PUT, DELETE, привязка к contact)

### 🐛 Известные баги / долг

- [x] Нет валидации входа — ни на одном роуте, ни zod, ни ручной проверки
- [x] SQL-инъекция в `utils/paginate.ts` — `fromClause` интерполируется напрямую в `count(*)`, сейчас источники контролируемые, но риск при расширении
- [x] `types/types.ts`: `Notes.contentId` → `contactId` (исправлено)
- [x] Inconsistent error handling — часть сервисов кидает `AppError`, часть возвращает `null` без проверки в контроллере (например `getContactById`, `getTaskByIdAndUserId` могут отдать 200 с пустым телом вместо 404)
- [x] **`controllers/auth.ts`** — отсутствует импорт `AppError` в `changePassword` (упадёт в рантайме)
- [x] **`controllers/auth.ts`** — файл повреждён null-байтами в конце
- [x] **`routes/users.ts`** — `/me` зарегистрирован после `/:id`, запрос `GET /me` уходит в `getUser` с `id="me"` (никогда не достигает `getUserInfo`)
- [x] **`controllers/users.ts:37`** — `getUserInfo` оборачивает ответ в `{ message: result }` вместо прямой отправки `result`
- [x] `controllers/auth.ts` → `logoutUser`: `res.clearCookie("token", refreshToken)` — пофикшено, второй аргумент — объект опций
- [x] Проект не собирается — нет `node_modules`, кривые пути в `tsconfig.json` (`rootDir` и `include` дублируют `server/`), `zod` не добавлен в `package.json`

### 🔄 Unification — привести к единому виду

- [x] **Case в API ответах**: camelCase через переименование колонок в БД
- [x] **404 на not found**: сервисы кидают `AppError(404)`, контроллеры не проверяют `null`
- [x] **HTTP статус update (PUT)**: уже 200 OK
- [x] **res.send vs return res.send**: единый паттерн `return res.status().send()`
- [x] **Нейминг services**: единый шаблон `getXxx`, `getXxxById`, `createXxx`, `updateXxx`, `deleteXxx`
- [x] **Нейминг controllers**: единый шаблон — совпадает с сервисами
- [x] **Валидация `/:id`**: middleware `validateId` на всех `/:id` роутах
- [x] **Валидация `POST /users`**: добавлен `validate(createUserSchema)`
- [x] **Pagination у users**: добавлены `page`/`limit` из `req.query`
- [x] **Сигнатуры update**: разные поля — разные сигнатуры, ок
- [x] **Проекция SQL**: явный `select notes.*` в JOIN-запросах
- [ ] **Дублирование валидации**: `checkNewPasswordDiffers` в `middleware/auth.ts` дублирует zod-схему (`changePassSchema` уже проверяет old/newPassword)
- [x] **Язык сообщений**: английский — везде
- [ ] **Поле порядка задач**: в таблице `tasks` нет поля `position`/`sort_order` — DnD персистит только смену статуса, порядок внутри колонки не сохраняется
- [ ] **Поля контактов**: нет полей «должность/компания» и «последняя активность» — в дашборде показываются только email/телефон и дата создания
- [x] **`paginate()` возвращает `offset`**: убран из ответа
- [x] **`getUserById` не возвращает `name`**: пофикшено в `3f73407`
- [ ] **`req.user` boilerplate**: каждый контроллер проверяет `if (!req.user) throw...`. Вынести в middleware

---

## 🎨 Frontend (Next.js 16 + React 19 + TS + Tailwind v4)

- [] Атомы: Button, Input, Badge, Avatar, IconButton, Divider, Typography, Spinner, **Toggle**
- [] Молекулы: Card, FormField, NavItem, SearchInput, Tabs, TimelineItem, StatCard
- [] Организмы: Header, Sidebar, Modal, Drawer, KanbanColumn
- [] Layouts: AppShell
- [] Views: DashboardView, ContactsView, TasksView

---

## 🔗 Frontend Integration

### Этап 0 — фундамент

- [ ] Решение по cross-origin cookie (Next rewrites-прокси vs CORS+credentials)
- [ ] `lib/api.ts` — обёртка над fetch (baseURL, credentials, JSON, нормализация ошибок)
- [ ] Стратегия хранения access-токена (in-memory)

### Этап 1 — Auth

- [ ] AuthContext (user, accessToken, login/register/logout, isLoading)
- [ ] Login/Register end-to-end + ошибки бэка
- [ ] Authorization: Bearer во все защищённые запросы
- [ ] Refresh-флоу (401 → /refresh → retry, single-flight, fail → /login)
- [ ] Защита роутов + восстановление сессии после F5
- [ ] Logout

### Этап 2 — Contacts end-to-end (шаблон)

- [ ] GET list, Create (Modal), Edit, Delete, Notes timeline
- [ ] Решение по data-layer (useEffect vs react-query/SWR)

### Этап 3 — тиражирование

- [ ] Tasks, Dashboard (агрегаты), Settings (profile/password/logout)

### Этап 4 — качество

- [ ] loading/error/empty состояния, zod-валидация, оптимистичные апдейты
