# Аудит бэкенд-контракта задач + фронт задач

## 1. БЭКЕНД-КОНТРАКТ (`server/`)

### Таблица эндпоинтов

| # | METHOD | Path | Query params | req.body | Формат ответа | Статус |
|---|--------|------|-------------|----------|--------------|--------|
| 1 | GET | `/tasks` | `page` (def 1), `limit` (def 10) | — | `{ data: Task[], pagination: {...} }` | 200 |
| 2 | GET | `/tasks/:id` | — | — | `Task \| null` | 200 |
| 3 | POST | `/tasks` | — | `{ title, description, status }` | `Task` | 201 |
| 4 | PUT | `/tasks/:id` | — | `{ title, description, status }` | `Task` | 201 |
| 5 | DELETE | `/tasks/:id` | — | — | `Task \| null` | 200 |

Все эндпоинты — `server/routes/tasks.ts:8-12`. Все проверяют `req.user` (JWT).

### 1. GET /tasks — пагинация

`controllers/tasks.ts:8-10` — `page`/`limit` из query. `services/tasks.ts:8-12` — ответ: `{ data: result.rows, pagination: {...} }`. **Не голый массив**, а объект с `data` и `pagination`.

### 2. Алиасы и camelCase

`services/tasks.ts:8` — SELECT:

- `id` → `"id"` (без алиаса)
- `title` → `"title"`
- `description` → `"description"`
- `user_id AS "userId"` → `"userId"`
- `status` → `"status"`
- `created_at AS "createdAt"` → `"createdAt"`

**Итоговые ключи JSON**: `id`, `title`, `description`, `userId`, `status`, `createdAt` — всё camelCase.

### 3. POST /tasks — поля и status по умолчанию

`controllers/tasks.ts:26`: `const {title, description, status} = req.body`.

Поля: `title` (string), `description` (string), `status` (string).

`db/init.sql:17`: `status VARCHAR(20) DEFAULT 'pending'`. Если `status` не передан, в БД идёт `undefined` → срабатывает DEFAULT → `'pending'`.

**Валидации status нет** — ни в контроллере, ни в сервисе, ни CHECK-constraint в БД.

### 4. PUT /tasks/:id — полная замена или частичная?

`controllers/tasks.ts:35-36` — читает `{title, description, status}`, затем:

`services/tasks.ts:27` — `UPDATE tasks SET title=$1, status=$2, description=$3 WHERE id=$4 AND user_id=$5`.

**Полная перезапись** трёх полей. Если поле не передано, SET будет `undefined`.

Отдельного PATCH-эндпоинта для status **нет**. Status меняется через этот же PUT.

### 5. Допустимые значения status

`db/init.sql:17`: `status VARCHAR(20) DEFAULT 'pending'`.

**Нет** CHECK-constraint, **нет** enum. Это просто VARCHAR. Любая строка пройдёт в БД.

### 6. DELETE /tasks/:id

`controllers/tasks.ts:46-47` — `return res.status(200).send(result)`. Возвращает удалённый объект задачи (с camelCase) или `null`. Статус **200** (не 204).

### 7. Фильтр по user_id из JWT

Да. Каждый эндпоинт:

- GET /tasks: `WHERE user_id = $1` (services.ts:8)
- GET /tasks/:id: `WHERE id=$1 AND user_id=$2` (services.ts:16)
- POST: `user_id` из JWT (controllers.ts:27)
- PUT: `WHERE id=$4 AND user_id=$5` (services.ts:27)
- DELETE: `WHERE id=$1 AND user_id=$2` (services.ts:33)

---

## 2. ФРОНТЕНД ЗАДАЧ (`client/mini-crm/`)

### 1. `app/(main)/tasks/page.tsx`

- Рендерит `<TasksView columns={MOCK_TASKS_COLUMNS} onNewTask={...} />`
- Данные: **мок** (`MOCK_TASKS_COLUMNS` из `@/src/lib/mock`)
- Локальное состояние: **нет**. Ни `useState`, ни `useEffect`, ни fetch.

### 2. `TasksView` (`src/components/pages/TasksView.tsx`)

```ts
interface TasksViewProps {
  columns?: Column[];      // опционально, fallback — defaultColumns
  onNewTask?: () => void;
}

type TaskStatus = 'Todo' | 'In Progress' | 'Done';

interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
}

interface Column {
  id: string;
  title: TaskStatus;
  tasks: Task[];
}
```

- Поиск/фильтр: **нет**
- Кнопка «Add task»: **да** — `<Button onClick={onNewTask}>New Task</Button>`
- Каждая задача рендерится инлайн через `Card.Root > Card.Content` (без `TaskCard`)

### 3. `KanbanColumn` (`src/components/organisms/KanbanColumn.tsx:8-13`)

```ts
interface KanbanColumnProps {
  title: string;
  count: number;
  variant?: BadgeVariant;  // 'success' | 'warning' | 'error' | 'info'
  children: ReactNode;
}
```

- Колбэки: **нет** — ни onTaskMove, ни onTaskClick, ни onEdit

Также экспортирует `KanbanTask({ title, children })` (не используется в TasksView).

### 4. Карточка задачи

Выделенного `TaskCard` нет. Рендеринг инлайн в TasksView.tsx:101-146:

- Поля: `title`, `description`, `status` (Badge)
- Кнопки: **нет**. Только `FiMoreVertical` (декоративный, без onClick)

### 5. Статусы в UI

| Column `id` | Лейбл `title` | variant Badge | Мок-значение `status` |
|------------|--------------|--------------|---------------------|
| `'todo'` | `'Todo'` | `'info'` | `'Todo'` |
| `'in-progress'` | `'In Progress'` | `'warning'` | `'In Progress'` |
| `'done'` | `'Done'` | `'success'` | `'Done'` |

**Статусы в UI НЕ совпадают** со значениями в БД (`'pending'`, `'in_progress'`, `'done'`).

### 6. `src/lib/api/tasks.ts` (легаси)

```ts
list(): Promise<Task[]>          // api.get       — возвращает Task[], а бэк {data, pagination}
get(id): Promise<Task>           // api.get
create(body): Promise<Task>      // api.post
update(id, body): Promise<Task>  // api.patch     — метода api.patch НЕТ в client.ts!
delete(id): Promise<void>        // api.delete    — возвращает void, бэк возвращает объект
```

`api.patch` отсутствует в `client.ts:61-68` (есть только `get`, `post`, `put`, `delete`) — **падёт с runtime ошибкой**.

Также `update` передаёт `Partial`, а бэкенд — `PUT` с полной перезаписью.

Импорт `tasksApi` в проекте: **0 использований** (grep не нашёл других файлов).

### 7. `mock.ts` — структура задач

```ts
MOCK_TASKS_COLUMNS: Array<{
  id: string;
  title: 'Todo' | 'In Progress' | 'Done';
  variant: 'info' | 'warning' | 'success';
  tasks: Array<{
    id: string;
    title: string;
    description: string;
    status: 'Todo' | 'In Progress' | 'Done';
  }>;
}>
```

Нет полей `userId`, `createdAt`. `id` — строка, не число.

### 8. `Modal` и `Button`

- **Modal** (`src/components/organisms/Modal.tsx`): тот же, что в contacts. Пропсы: `isOpen`, `onClose`, `title`, `description`, `children`, `footer`, `size` (`sm/md/lg`).
- **Button** (`@/src/components/atoms/Button`): тот же, что в contacts.

---

## 3. Резюме расхождений (что сломается при интеграции)

1. `tasksApi.list()` ждёт `Task[]` ← бэк отдаёт `{data, pagination}`
2. `tasksApi.update()` вызывает `api.patch` — метода нет в `client.ts`
3. `tasksApi.update()` шлёт `Partial` ← бэк требует полный `{title, description, status}` (PUT)
4. Статусы в UI (`Todo`/`In Progress`/`Done`) не совпадают с БД (`pending`/`in_progress`/`done`)
5. `delete()` тип `Promise<void>` ← бэк возвращает объект задачи
6. `KanbanColumn` не имеет колбэков (onMove, onSelect, onEdit)
