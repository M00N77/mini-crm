// feature: note-actions
// Сценарии: добавление/редактирование/удаление заметки к контакту
// Imports: entities/note, shared/api, shared/ui

export { CreateNoteButton } from "./ui/create-note-button";
export { CreateNoteModal } from "./ui/create-note-modal";
export { EditNoteModal } from "./ui/edit-note-modal";
export {
  createNoteSchema,
  updateNoteSchema,
  type CreateNoteFormData,
  type UpdateNoteFormData,
} from "./model/note-schema";
