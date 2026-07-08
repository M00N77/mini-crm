# Аудит read-only — mini-crm

## 1) Проверка кандидатов на удаление

### app/components/auth/AuthTabs.tsx
- **0 внешних импортов** — не импортируется нигде.
- Безопасен к удалению.

### app/components/Header.tsx
- **0 внешних импортов** — не импортируется нигде.
- Безопасен к удалению.
- Примечание: `(main)/layout.tsx` использует `AppShell` (из UI-кита), а не `Header`.

### app/components/SideBar.tsx
- **0 внешних импортов** — не импортируется нигде.
- Безопасен к удалению.
- Примечание: `AppShell` сам содержит Sidebar; этот файл — заглушка.

### src/lib/auth/tokenStore.ts
- **0 внешних импортов** — дубль.
- Реально используется `src/lib/api/tokenStore.ts`:
  - `src/lib/api/client.ts:1` — `import { getToken, clearToken } from './tokenStore'`
  - `src/lib/api/refresh.ts:1` — `import { setToken, clearToken } from './tokenStore'`
  - `src/features/auth/api.ts:2` — `import { setToken, clearToken } from '@/src/lib/api/tokenStore'`
  - `app/api-check/page.tsx:5` — `import { getToken, setToken, clearToken } from '@/src/lib/api/tokenStore'`
- Дубль `src/lib/auth/tokenStore.ts` — мёртвый, безопасен к удалению.

### src/lib/api/auth.ts
- **Пустой файл (0 строк).** Нигде не импортируется.
- Безопасен к удалению.

### app/api-check/page.tsx
- **0 внешних импортов** — страница-инструмент, ниоткуда не импортируется.
- Безопасна к удалению (после завершения тестирования API).

### src/lib/mock.ts
- **2 файла-импортёра:**
  - `app/(main)/layout.tsx:6` — `import { MOCK_USER } from '@/src/lib/mock'`
  - `app/components/SettingsView.tsx:12` — `import { MOCK_USER, MOCK_USER_EMAIL } from '@/src/lib/mock'`
- Небезопасен к удалению — пока используется в layout и SettingsView.

### src/types/types.ts
- **1 файл-импортёр:**
  - `src/lib/mock.ts:1` — `import type { Contact, Task, Notes } from '@/src/types/types'`
- В остальном код использует `@/src/types/domain` и `@/src/types/dto`.
- types.ts — легаси, живёт только за счёт mock.ts.

---

## 2) Остатки моков

Все вхождения `lib/mock|MOCK_`:

| Файл | Строка | Совпадение |
|------|--------|-----------|
| `app/(main)/layout.tsx` | 6 | `import { MOCK_USER } from '@/src/lib/mock'` |
| `app/(main)/layout.tsx` | 24 | `userName={MOCK_USER}` |
| `app/components/SettingsView.tsx` | 12 | `import { MOCK_USER, MOCK_USER_EMAIL } from '@/src/lib/mock'` |
| `app/components/SettingsView.tsx` | 65 | `value={MOCK_USER}` |
| `app/components/SettingsView.tsx` | 66 | `value={MOCK_USER_EMAIL}` |
| `src/lib/mock.ts` | 5-6 | `export const MOCK_USER`, `MOCK_USER_EMAIL` |
| `src/lib/mock.ts` | 8-103 | `MOCK_STATS`, `MOCK_RECENT_CONTACTS`, `MOCK_PIPELINE`, `MOCK_UP_NEXT`, `MOCK_CONTACTS`, `MOCK_CONTACT_NOTES`, `MOCK_TASKS_COLUMNS` |

**Вывод:** моки всё ещё используются в layout (userName) и SettingsView. Неподключённые моки (MOCK_STATS, MOCK_CONTACTS, и т.д.) — мёртвый код.

---

## 3) Snake_case в UI

Поиск `user_id|created_at|contact_id|content_id` в `app/` и `src/components/`:

**Совпадений нет.** snake_case не просочился в UI-компоненты.

Snake_case присутствует только там, где и должен быть:
- `src/types/dto.ts` — DTO-типы с сервера
- `src/types/types.ts` — легаси-типы

---

## 4) Типы дат

### src/types/dto.ts
| Поле | Тип |
|------|-----|
| `ContactDto.created_at` | `string` |
| `TaskDto.createdAt` | `string` |
| `UserDto.created_at` | `string` |
| `NoteJoinedDto.created_at` | `string` |
| `AuthUserDto.created_at` | `string` |

### src/types/domain.ts
| Поле | Тип |
|------|-----|
| `User.createdAt` | `string` |
| `Contact.createdAt` | `string` |
| `Task.createdAt` | `string` |
| `Note.createdAt` | `string` |

### src/types/types.ts (легаси)
| Поле | Тип |
|------|-----|
| `Task.createdAt` | `Date` |
| `Contact.createdAt` | `Date` |
| `Notes.createdAt` | `Date` |

**Вывод:** Тип `Date` есть **только** в `src/types/types.ts`. В `dto.ts` и `domain.ts` — везде `string`. Единообразия нет.

---

## 5) Система уведомлений

Поиск `toast|Toast|notify|Snackbar|notification` в `src/components/`:

Единственное вхождение — не тост, а иконка:
- `app/components/Header.tsx:28` — `<IconButton icon={<FiBell size={20} />} label="Notifications" />`

В SettingsView (`app/components/SettingsView.tsx`) есть секция "Notifications" с Toggle-элементами (строки 18, 112–130) — это UI-настройки, не система тостов.

**Тостов в UI-ките нет.** В коде используются нативные `alert()` и `confirm()` для обратной связи.

---

## 6) Паттерн состояний загрузки

### app/(main)/contacts/page.tsx
- **Тип:** `type Status = 'idle' | 'loading' | 'success' | 'error'` (строка 15)
- **Loading:** `status === 'loading' && contacts.length === 0` → "Загрузка контактов…" (строка 138)
- **Error:** `status === 'error'` → сообщение + кнопка "Повторить" (строка 140-144)
- **Empty:** `contacts.length === 0` → "Пока нет контактов" + кнопка "Добавить контакт" (строка 145-149)
- +локальные булевы `saving`, `sendingNote`, `formError`

### app/(main)/tasks/page.tsx
- **Тип:** `type LoadStatus = 'idle' | 'loading' | 'success' | 'error'` (строка 10)
- **Loading:** `loadStatus === 'loading' && tasks.length === 0` → "Загрузка задач…" (строка 88)
- **Error:** `loadStatus === 'error'` → сообщение + кнопка "Повторить" (строка 90-94)
- **Empty:** нет отдельного экрана — при пустом списке рендерится `TaskBoard` с пустыми колонками
- +локальные булевы `saving`

### app/(main)/dashboard/page.tsx
- **Тип:** `type LoadStatus = 'idle' | 'loading' | 'success' | 'error'` (строка 8)
- **Loading:** `status === 'loading' && !data` → "Загрузка дашборда…" (строка 58-59)
- **Error:** `status === 'error' && !data` → сообщение + кнопка "Повторить" (строка 61-67)
- **Empty:** нет отдельного экрана; `DashboardView` получает пустые массивы и рендерит их
- +локальный булев `addingTask`

**Общий вывод:** все три страницы используют **union-статус** (не булевы флаги isLoading). Все обрабатывают loading и error. Empty-состояние обработано только в contacts (явный экран); в tasks он неявный (пустой TaskBoard), в dashboard — не выделен.
