# Roadmap — Mini CRM

---

## 🔙 Backend (Express + PostgreSQL)

### Auth
- [x] POST /api/auth/register — создание пользователя + httpOnly refresh-cookie
- [x] POST /api/auth/login — JWT access + httpOnly refresh-cookie
- [x] POST /api/auth/logout — очистка refresh-куки
- [x] POST /api/auth/refresh — продление access через httpOnly refresh-cookie
- [x] Rate limit: global (100/15m) + auth (10/15m)
- [x] Фикс SQL-инъекции в logout (параметризованный запрос)
- [x] POST /auth/changepass — смена пароля (oldPassword + newPassword), проверка совпадения старого пароля и различия нового от старого
- [ ] /me — получение профиля по токену
- [ ] POST /auth/forgot-password + /auth/reset-password — сброс пароля без логина через одноразовый токен на email (требует SMTP-сервис, пока не настроен — отложено)
- [ ] Валидация входных данных через zod — начать с auth-роутов (register, login, changepass), затем contacts/tasks/notes

### Contacts
- [ ] CRUD endpoint'ы

### Tasks
- [ ] CRUD endpoint'ы

### Notes
- [ ] CRUD endpoint'ы

---

## 🎨 Frontend (Next.js 16 + React 19 + TS + Tailwind v4)

- [x] Атомы: Button, Input, Badge, Avatar, IconButton, Divider, Typography, Spinner, **Toggle**
- [x] Молекулы: Card, FormField, NavItem, SearchInput, Tabs, TimelineItem, StatCard
- [x] Организмы: Header, Sidebar, Modal, Drawer, KanbanColumn
- [x] Layouts: AppShell
- [x] Views: DashboardView, ContactsView, TasksView

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

### 🎯 Текущий фокус
**Этап 0 + Login/Register end-to-end (без refresh-флоу)**
