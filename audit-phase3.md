# Аудит перед Фазой 3 (Contacts + Notes)

## 1. Типы

### `client/mini-crm/src/types/dto.ts` — DTO (сеть → бэкенд)

```ts
export interface ContactDto {
  id: number
  name: string
  email: string
  phone: string
  user_id: number
  created_at: string
}

export interface NoteJoinedDto {
  id: number
  content: string
  contact_id: number
  created_at: string
  name: string
  email: string
  phone: string
}

export interface UserDto {
  id: number
  email: string
  name: string
  created_at: string
}

export interface Paginated<T> {
  data: T[]
  pagination: Pagination
}

export interface Pagination {
  page: number
  limit: number
  offset: number
  total: number
  totalPages: number
  hasMore: boolean
}
```

### `client/mini-crm/src/types/domain.ts` — Domain-модели

```ts
export interface Contact {
  id: number
  name: string
  email: string
  phone: string
  userId: number
  createdAt: string
}

export interface Note {
  id: number
  content: string
  contactId: number
  userId: number
  createdAt: string
}
```

### `client/mini-crm/src/types/types.ts` — третий набор (используется api-слоем и mock.ts)

```ts
export interface Contact {
    id: number;
    name: string;
    email: string | null;
    phone: string | null;
    userId: number;
    createdAt: Date;
}

export interface Notes {
    id: number;
    content: string;
    contentId: number;
    createdAt: Date;
}
```

**⚠️ Важно:** `domain.ts` и `types.ts` — разные файлы с разными полями. `notesApi` импортирует `Notes` из `types.ts`, `contactsApi` импортирует `Contact` оттуда же. `mock.ts` импортирует `Contact` и `Notes` из `types.ts`.

---

## 2. Легаси API-слой

### `client/mini-crm/src/lib/api/contacts.ts`

```ts
import { api } from '@/src/lib/api/client';
import type { Contact } from '@/src/types/types';

export const contactsApi = {
  list(): Promise<Contact[]> {
    return api.get<Contact[]>('/contacts');
  },
  get(id: number): Promise<Contact> {
    return api.get<Contact>(`/contacts/${id}`);
  },
  create(body: Pick<Contact, 'name' | 'email' | 'phone'>): Promise<Contact> {
    return api.post<Contact>('/contacts', body);
  },
  update(id: number, body: Partial<Pick<Contact, 'name' | 'email' | 'phone'>>): Promise<Contact> {
    return api.patch<Contact>(`/contacts/${id}`, body);
  },
  delete(id: number): Promise<void> {
    return api.delete<void>(`/contacts/${id}`);
  },
};
```

**Эндпоинты:** `GET /contacts`, `GET /contacts/:id`, `POST /contacts`, `PATCH /contacts/:id`, `DELETE /contacts/:id`.

**Тело create:** `{ name, email, phone }` (все обязательны). **Тело update:** `{ name?, email?, phone? }`.

**⚠️ Query-параметры:** Нет пагинации/фильтрации — `list()` без параметров.

### `client/mini-crm/src/lib/api/note.ts`

```ts
import { api } from '@/src/lib/api/client';
import type { Notes } from '@/src/types/types';

export const notesApi = {
  list(contentId: number): Promise<Notes[]> {
    return api.get<Notes[]>(`/notes?contentId=${contentId}`);
  },
  create(body: Pick<Notes, 'content' | 'contentId'>): Promise<Notes> {
    return api.post<Notes>('/notes', body);
  },
  update(id: number, body: Pick<Notes, 'content'>): Promise<Notes> {
    return api.patch<Notes>(`/notes/${id}`, body);
  },
  delete(id: number): Promise<void> {
    return api.delete<void>(`/notes/${id}`);
  },
};
```

**Эндпоинты:** `GET /notes?contentId=...`, `POST /notes`, `PATCH /notes/:id`, `DELETE /notes/:id`.

**Тело create:** `{ content, contentId }`. **Тело update:** `{ content }`.

**⚠️ Поле `contentId`** в `Notes` — это ID контакта (не `contact_id`). В DTO есть `NoteJoinedDto.contact_id`.

---

## 3. UI, который подключаем

### Страница `app/(main)/contacts/page.tsx`

```tsx
'use client';
import { useState, useCallback } from 'react';
import { ContactsView } from '@/src/components/pages/ContactsView';
import { Drawer } from '@/src/components/organisms/Drawer';
import { ContactDrawer } from '@/app/components/ContactDrawer';
import { MOCK_CONTACTS, MOCK_CONTACT_NOTES } from '@/src/lib/mock';
import type { ContactItem } from '@/src/components/pages/ContactsView';

export default function ContactsPage() {
  const [filterValue, setFilterValue] = useState('');
  const [selectedContact, setSelectedContact] = useState<ContactItem | null>(null);

  const notes = selectedContact ? MOCK_CONTACT_NOTES[selectedContact.id] ?? [] : [];
  const handleClose = useCallback(() => setSelectedContact(null), []);

  return (
    <>
      <ContactsView
        contacts={MOCK_CONTACTS}
        filterValue={filterValue}
        onFilterChange={setFilterValue}
        onAddContact={() => console.log('Add contact')}
        onSelectContact={setSelectedContact}
      />
      <Drawer open={!!selectedContact} onClose={handleClose} title={selectedContact?.name ?? ''} width={480}>
        {selectedContact && (
          <ContactDrawer
            name={selectedContact.name}
            role={selectedContact.role}
            company={selectedContact.company}
            email={selectedContact.email}
            phone={selectedContact.phone}
            notes={notes}
          />
        )}
      </Drawer>
    </>
  );
}
```

**Заглушки:** `onAddContact` → `console.log('Add contact')`.

### `client/mini-crm/src/components/pages/ContactsView.tsx` — Пропсы и ContactItem

```ts
interface ContactItem {
  id: string;
  name: string;
  role: string;
  company: string;
  email: string;
  phone: string;
  notesCount: number;
}

interface ContactsViewProps {
  contacts?: ContactItem[];
  onAddContact?: () => void;
  filterValue?: string;
  onFilterChange?: (v: string) => void;
  onSelectContact?: (contact: ContactItem) => void;
}
```

**Колбэки:** `onAddContact`, `onFilterChange`, `onSelectContact`. **Нет** `onEdit`/`onDelete` в этом компоненте — они внутри `ContactDrawer`.

**SearchInput** уже встроен (с `filterValue`/`onFilterChange`).

**Мок по умолчанию:** 6 объектов `defaultContacts` в самом компоненте (хардкод, на случай если `contacts` не передан).

### `app/components/ContactDrawer.tsx` — Пропсы

```ts
interface ContactDrawerProps {
  name: string;
  role: string;
  company: string;
  email: string;
  phone: string;
  notes: NotePreview[];
}
```

**Рендерит:** Avatar + name/role/company, контакты (email, phone, company), кнопки Edit/Delete, Notes timeline + Badge, список `TimelineItem`, поле ввода новой заметки + IconButton отправки.

**Нет колбэков** на Edit/Delete/Send — кнопки просто есть. Нет `onEdit`, `onDelete`, `onSendNote`.

---

## 4. Модалки/формы

### `client/mini-crm/src/components/organisms/Modal.tsx` — Пропсы

```ts
interface ModalProps extends VariantProps<typeof modalVariants> {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  closeOnOverlayClick?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';  // умолч. 'md'
}
```

Открытие: `isOpen={true}`, закрытие: `onClose()`, Escape / клик по оверлею. Использует `createPortal`.

### Обработчики Add/Edit/Delete

- **Add Contact:** `onAddContact` в `ContactsView` → `console.log('Add contact')` на странице (строка 24).
- **Edit:** кнопка в `ContactDrawer` — **нет обработчика**, просто `<Button variant="secondary">Edit</Button>`.
- **Delete:** кнопка в `ContactDrawer` — **нет обработчика**, просто `<Button variant="danger">Delete</Button>`.
- **Send note:** кнопка в `ContactDrawer` — **нет обработчика**, просто `<IconButton icon={<FiSend />} />`.

---

## 5. Формы моков

### `client/mini-crm/src/lib/mock.ts` — Пример объекта MOCK_CONTACTS

```ts
export interface NotePreview {
  text: string;
  timeAgo: string;
}

export const MOCK_CONTACTS = [
  {
    id: 'c1',
    name: 'Ava Mercer',
    role: 'Head of Growth',
    company: 'Northwind',
    email: 'ava@northwind.io',
    phone: '+1 415 552-0188',
    notesCount: 2,
  },
  // ... всего 6 контактов
];

export const MOCK_CONTACT_NOTES: Record<string, NotePreview[]> = {
  c1: [
    { text: 'Initial outreach completed, positive response — wants to see a demo', timeAgo: '2 days ago' },
    { text: 'Follow-up call scheduled for next Thursday', timeAgo: '1 hour ago' },
  ],
};
```

**Поля `NotePreview`:** `text: string`, `timeAgo: string`. **Нет** `id`, `author`, `createdAt`.

**Ключи `MOCK_CONTACT_NOTES`:** строковые id (совпадают с `MOCK_CONTACTS[i].id`). Только `c1` не пустой.

---

## 6. Drawer

### `client/mini-crm/src/components/organisms/Drawer.tsx` — Пропсы

```ts
interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  width?: number;       // умолч. 480
}
```

---

## Сводка несоответствий / узких мест

| Что | Проблема |
|---|---|
| **3 набора типов** | `dto.ts`, `domain.ts`, `types.ts` частично дублируются; `types.ts` — `email: string \| null`, `phone: string \| null`, `createdAt: Date`; `domain.ts` — `email: string`, `createdAt: string`. |
| **notesApi.list** | Параметр `contentId` — нет пагинации; бэкенд возвращает `Notes[]` из `types.ts`, а не `NoteJoinedDto`. |
| **contactsApi.list** | Нет query-параметров (пагинация, фильтр, поиск). |
| **ContactDrawer** | Нет колбэков `onEdit`, `onDelete`, `onSendNote` — кнопки висят без обработчиков. |
| **Страница** | `onAddContact` — `console.log`. Нет форм Add/Edit/Delete. |
| **NotePreview** | Плоский формат (`text`/`timeAgo`), нет id, нет связи с `Notes`/`NoteJoinedDto`. |
