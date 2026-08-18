# ⚡ Nexus CRM (Mini-CRM)

Полнофункциональная Fullstack CRM-система для управления контактами, задачами (Kanban-доска) и заметками с двухфакторной моделью авторизации (Email/Password + Google OAuth 2.0), командной палитрой быстрого поиска, персистентным центром уведомлений и бескомпромиссной 90° швейцарской визуальной геометрией.

---

## 🏗️ Архитектурные решения и инженерные практики

### 1. Архитектура фронтенда: Feature-Sliced Design (FSD)
Клиентское приложение построено по методологии **FSD**, обеспечивающей слабую связанность (loose coupling) и высокую масштабируемость:
* **`app/`** — инициализация приложения, глобальные стили, роутинг (Next.js 16 App Router) и контекстные провайдеры (`QueryProvider`, `ModalProvider`, `ThemeProvider`).
* **`widgets/`** — самостоятельные композиционные блоки интерфейса (`KanbanBoard`, `ContactsTable`, `NotesGrid`, `DashboardOverview`, `Navbar`, `Sidebar`, `ProfileDropdown`, `NotificationsPopover`).
* **`features/`** — интерактивные пользовательские сценарии (`CommandPalette`, `AuthByEmail`, `AccountSettings`, `ContactManagement`, `TaskMutations`, `NoteActions`).
* **`entities/`** — бизнес-сущности (`Contact`, `Task`, `Note`, `User`), их типизация, мапперы и React Query хуки.
* **`shared/`** — переиспользуемый базис (UI-Kit с `rounded-none`, Axios/Fetch-клиент с интерцепторами, Zustand сторы, утилиты сортировки).

---

### 2. Безопасность и модель авторизации (Dual-Token + Google OAuth 2.0)
* **Access & Refresh JWT (HS256):**
  * **`accessToken`** (15 мин) хранится исключительно в оперативной памяти клиента (Zustand store), защищая от XSS.
  * **`refreshToken`** (7 дней) хранится в безопасной `HttpOnly` / `SameSite: lax` cookie.
  * **Ротация рефреш-токенов в PostgreSQL:** при каждом обновлении старый токен отзывается (`revoked_at = now()`), генерируется новый `jti` (UUID).
  * **Защита от компрометации с Grace Period (Token Reuse Detection):**
    * Если отозванный токен приходит повторно в течение **15-секундного окна** (`diffTime < 15s`), система классифицирует это как *сетевую гонку параллельных запросов* из соседних вкладок браузера и возвращает `409 Concurrent refresh request`, не трогая сессии.
    * Если отозванный токен приходит спустя **более 15 секунд**, это распознается как *попытка атаки повторного воспроизведения (Replay Attack)* $\rightarrow$ немедленно аннулируются **все** активные сессии пользователя в базе данных (`DELETE FROM refresh_tokens WHERE user_id = $1`).
* **Single-Flight Refresh Queue:** на клиенте реализован шлюз, объединяющий все одновременные 401-запросы в один промис обновления токена, исключая лавинные запросы к `/auth/refresh`.
* **Google OAuth 2.0 Authorization Code Flow:**
  * Генерация криптографически стойкого `state` (`crypto.randomBytes(32)`) с сохранением в cookie для защиты от CSRF.
  * Серверный обмен `authorization_code` на `id_token` и `access_token` от Google.
  * **Паттерн Account Linking:** если email уже зарегистрирован по паролю и подтвержден Google (`email_verified: true`), Google-профиль безопасно связывается с существующей учетной записью без дублирования записей.

---

### 3. Реляционная база данных и транзакционные миграции (PostgreSQL 17)
* **Работа без тяжелых ORM:** прямой доступ через пул соединений `pg.Pool` с параметризованными SQL-запросами (защита от SQL Injection и максимальная производительность).
* **Схема данных и ограничения целостности:**
  ```sql
  -- users: поддержка пароля и OAuth без антипаттерна "фейковых паролей"
  hashed_password VARCHAR(255) NULL,
  google_sub VARCHAR(255) UNIQUE NULL,
  CONSTRAINT auth_method_required CHECK (hashed_password IS NOT NULL OR google_sub IS NOT NULL)
  ```
* **Каскадные связи (`ON DELETE CASCADE`):** удаление пользователя автоматически очищает связанные контакты, задачи, заметки и токены.
* **Индексация:** B-Tree индексы на внешние ключи (`idx_contacts_user_id`, `idx_tasks_user_id`, `idx_notes_contact_id`, `idx_refresh_tokens_user_id`) для быстрого поиска и джойнов.
* **Собственный runner транзакционных миграций:** версионируемые `.sql`-скрипты с транзакциями `BEGIN...COMMIT`.

---

### 4. Дизайн-система и UI/UX инженерия (Swiss Industrial Precision)

* **Бескомпромиссная 90° геометрия (`Zero Border-Radius Baseline`):**
  * Полный отказ от скруглений (`border-radius: 0px` / `rounded-none`) для всех интерактивных элементов: кнопок, модальных окон, таблиц, полей ввода, карточек Kanban и выпадающих меню.
  * Обеспечивает строгий инженерный вид высокоплотного терминала без визуального шума.
* **Кастомное выделение текста (Custom Text Selection Highlight):**
  * Стилизация псевдоэлемента `::selection` в фирменном индустриальном стиле (`selection:bg-accent/20 selection:text-accent`), создающая цельный монолитный образ интерфейса при выделении любого текста или фрагментов таблиц.
* **Интерактивный живой CRM-кокпит на лендинге:**
  * Полноценный встроенный эмулятор рабочего окружения на посадочной странице: живой поиск по таблице контактов с подсчетом совпадений, интерактивная Kanban-доска с мгновенной сменой статусов по клику и просмотр протоколов переговоров без авторизации.
* **Двухсторонняя адаптивная тема (Light/Dark Zero-Flash Dual-Theme):**
  * Переключение тем на уровне CSS-токенов (`--bg-canvas`, `--bg-surface`, `--accent`, `--border-subtle`) без мерцания (*zero flash*) через `next-themes`.
* **Оптимистичные мутации (Optimistic UI):**
  * Drag-and-Drop и смена статусов задач в Канбан-доске обновляются мгновенно (0ms латентности), синхронизируясь в фоновом режиме через TanStack Query.
* **Мемоизированный O(1) поиск связей в Заметках:**
  * Хэш-мапа `contactsMap` для связывания заметок с реляционными контактами за $O(1)$ без вложенных квадратичных итераций.

---

### 5. Оптимизация Core Web Vitals и клиентского кэша

| Метрика | Значение | Статус | Инженерная реализация |
| :--- | :---: | :---: | :--- |
| **LCP** *(Largest Contentful Paint)* | **< 0.8s** | 🟢 Идеально | Статический рендер SSG, приоритетная предзагрузка шрифтов (`preload: true`), отказ от тяжелой растровой графики |
| **CLS** *(Cumulative Layout Shift)* | **0.000** | 🟢 Идеально | `adjustFontFallback: true` с калибровкой метрик `size-adjust` / `ascent-override`, Suspense-скелетоны с фиксированными слотами, `tabular-nums` |
| **INP** *(Interaction to Next Paint)* | **< 30ms** | 🟢 Идеально | Оптимистичные апдейты TanStack Query, O(1) Map-индексация, ленивая изоляция модалок |
| **FCP** *(First Contentful Paint)* | **< 0.4s** | 🟢 Идеально | Мгновенная доставка пререндеренного HTML с Edge CDN без блокирующих трекеров |
| **TTFB** *(Time to First Byte)* | **~11-45ms** | 🟢 Идеально | Статическая генерация страниц (Next.js 16) и быстрый HTTP-стриминг |

* **Стратегия кэширования TanStack Query (`staleTime: 60_000`):**
  * Глобальный `staleTime = 60s` предотвращает повторные сетевые запросы при переключении между вкладками браузера (`refetchOnWindowFocus: false`).
  * `gcTime = 5min` обеспечивает мгновенное отображение данных из памяти при повторном открытии страниц.
  * Инвалидация кэша (`invalidateQueries`) срабатывает исключительно при реальных мутациях (создание, редактирование, удаление).

---

### 6. Алгоритмическая оптимизация: Merge Sort $O(n \log n)$ против Quick Sort
* **Почему именно Merge Sort для UI-таблиц:**
  * **Стабильность (Stable Sort):** при повторной сортировке по столбцу (например, «Компания») Merge Sort сохраняет исходный порядок строк с одинаковыми значениями (например, порядок по дате добавления). Quick Sort нестабилен и хаотично перетасовывает строки с равными ключами.
  * **Гарантия времени выполнения $\Theta(n \log n)$:** Merge Sort никогда не деградирует в худшем случае, в то время как наивный Quick Sort на почти отсортированных пользовательских данных или массивах с дубликатами может деградировать до $O(n^2)$.
* **Особенности реализации:** естественная сортировка кириллицы (`Intl.Collator` / `localeCompare('ru', { numeric: true })`), ISO-дат и корректная обработка `null`/`undefined` значений.

---

### 7. Keyboard-First UX: Командная палитра (`⌘K` / `Ctrl+K`)
* Глобальный перехватчик событий с модальной палитрой команд.
* Сквозной поиск в реальном времени по всей CRM: контакты, задачи Kanban, заметки, быстрые действия (`Alt+C`, `Alt+T`) и навигация.
* Полная поддержка навигации стрелками клавиатуры ($\uparrow \downarrow$) и `Enter`.

---

### 8. Оптимизация шрифтов и нулевой сдвиг макета (Zero-CLS & Font Metric Overrides)
В приложении реализована комплексная система типографической оптимизации на базе `next/font/google` и современных CSS-стандартов:
* **Предзагрузка шрифтов (`preload: true`):**
  * Генерирует `<link rel="preload">` в `<head>` для приоритетной загрузки веб-шрифтов (`Geist` и `JetBrains Mono`) в первом же HTTP-потоке.
* **Предотвращение невидимого текста (`display: "swap"`):**
  * Исключает FOIT (*Flash of Invisible Text*), обеспечивая мгновенную отрисовку текста системным шрифтом до окончания загрузки кастомного.
* **Автоматический подгон метрик фоллбека (`adjustFontFallback: true`):**
  * Turbopack на этапе сборки анализирует геометрию глифов и генерирует синтетический `@font-face` для системного шрифта (`Arial` / `system-ui`) с точными CSS-модификаторами (`size-adjust`, `ascent-override`, `descent-override`, `line-gap-override`).
  * **Результат:** системный и кастомный шрифт занимают одинаковую площадь и высоту строки, полностью устраняя сдвиг контента при свопе (**Cumulative Layout Shift / CLS = 0.000**).
* **Балансировка и защита от висячих строк:**
  * `text-wrap: balance` для заголовков (`h1`–`h6`) — гармоничное выравнивание длины строк.
  * `text-wrap: pretty` для абзацев (`p`, `li`) — исключение сиротских слов (*orphan words*) на последней строке.
  * `font-variant-numeric: tabular-nums` — моноширинное выравнивание чисел в таблицах, метриках и KPI.

---

## 🛠️ Технологический стек

### Frontend
| Технология | Версия | Назначение |
| :--- | :--- | :--- |
| **Next.js** | `16.3.0` (App Router) | React-фреймворк, SSR/SSG, оптимизация страниц |
| **React** | `19.2.8` | UI-библиотека |
| **Tailwind CSS** | `v4.0` | Утилитарная стилизация через CSS-токены дизайн-системы |
| **TanStack Query** | `v5` | Серверное состояние, кэширование, оптимистичные мутации |
| **Zustand** | `v5` | Клиентские сторы (Auth, Modals, Notifications с `localStorage`) |
| **React Hook Form + Zod** | `v7` / `v4` | Строгая валидация форм на клиенте |
| **Lucide Icons** | Latest | Иконочный сет интерфейса |

### Backend
| Технология | Версия | Назначение |
| :--- | :--- | :--- |
| **Node.js + TypeScript** | `20+` / `5.3` | Строго типизированная среда выполнения |
| **Express** | `5.2.1` | REST API роутинг и контроллеры |
| **PostgreSQL** | `17` | Реляционная СУБД |
| **pg (node-postgres)** | `8.22` | Высокопроизводительный пул соединений |
| **bcrypt + jsonwebtoken** | Latest | Хеширование паролей (salt 10) и генерация JWT |
| **express-rate-limit** | `8.5` | Защита от Brute-force атак на auth-эндпоинты |
| **Swagger UI Express** | `5.0` | Интерактивная документация API (OpenAPI 3.0) |
| **Vitest + Supertest** | `4.1` / `7.2` | Модульное и интеграционное E2E тестирование |

---

## 📂 Структура репозитория

```
mini-crm/
├── server/                          # Backend REST API (Express 5 + TypeScript)
│   ├── index.ts                     # Точка входа для standalone Node.js (порт :3000)
│   ├── app.ts                       # Настройка Express, динамический CORS, Swagger, роуты
│   ├── db.ts                        # Пул соединений PostgreSQL
│   ├── api/                         # Vercel Serverless Function точка входа (index.ts)
│   ├── routes/                      # auth · users · contacts · tasks · notes
│   ├── controllers/                 # Тонкие контроллеры (валидация -> сервис -> ответ)
│   ├── services/                    # Сервисный слой и бизнес-логика
│   ├── repositories/                # Низкоуровневые SQL-запросы
│   ├── middleware/                  # JWT auth, errorHandler, rateLimit, validator
│   ├── schemas/                     # Zod-схемы валидации запросов
│   ├── db/
│   │   ├── init.sql                 # Базовая DDL-схема
│   │   └── migrations/              # Версионируемые SQL-миграции
│   ├── scripts/                     # seed.ts, migrate.ts
│   ├── tests/                       # Unit-тесты и интеграционные E2E тесты (16 passed)
│   ├── Dockerfile                   # Docker-образ бэкенда
│   ├── vercel.json                  # Конфигурация Vercel Serverless роутинга
│   └── .env.example                 # Шаблон конфигурации сервера
│
├── client/                          # Frontend SPA (Next.js 16 + React 19 + FSD)
│   ├── src/
│   │   ├── app/                     # App Router страницы (/login, /register, /dashboard)
│   │   ├── widgets/                 # KanbanBoard, ContactsTable, NotesGrid, Navbar, Sidebar
│   │   ├── features/                # CommandPalette, Auth, AccountSettings, QuickCreate
│   │   ├── entities/                # Contact, Task, Note, User (queries & types)
│   │   └── shared/                  # UI kit (rounded-none), apiClient, sort utils, Zustand stores
│   ├── Dockerfile                   # Multi-stage production Docker-образ фронтенда
│   ├── .env.example                 # Шаблон конфигурации клиента
│   └── package.json
│
├── compose.yaml                     # Docker Compose оркестрация (БД + Сервер + Клиент)
└── README.md                        # Главная документация проекта
```

---

## 🐳 Запуск через Docker Compose (Рекомендуемый способ)

Для быстрого запуска всей инфраструктуры (PostgreSQL 17 + Express Server + Next.js Client) одной командой:

```bash
docker compose up --build
```

* **Frontend:** `http://localhost:3001`
* **Backend REST API:** `http://localhost:3000`
* **Swagger API Docs:** `http://localhost:3000/api-docs`
* **PostgreSQL:** `localhost:5432`

---

## 🚀 Локальный запуск (Manual)

### 1. Предварительные требования
* **Node.js** `>= 20.0.0`
* **PostgreSQL** `>= 16.0` (локально или через Docker)

### 2. Настройка базы данных и бэкенда
```bash
cd server
cp .env.example .env

# Укажи параметры подключения к БД и Google OAuth ключи в .env
# Запусти накатывание миграций:
npx ts-node scripts/migrate.ts

# (Опционально) Наполни базу тестовыми данными:
npm run seed

# Запуск бэкенда в режиме разработки:
npm run dev
# -> Server started on port 3000
# -> Swagger документация доступна на http://localhost:3000/api-docs
```

### 3. Настройка и запуск фронтенда
```bash
cd ../client
cp .env.example .env.local

# Запуск Next.js клиента:
npm run dev
# -> Client started on http://localhost:3001
```

---

## 🧪 Тестирование

Бэкенд покрыт двумя уровнями автоматических тестов:
```bash
cd server

# 1. Запуск интеграционных тестов против реальной PostgreSQL (с изолированной транзакцией):
npm run test

# 2. Запуск unit-тестов с моками:
npm run test:unit

# 3. Запуск всех тестов:
npm run test:all
```
