import { CreateNoteButton } from "@/features/note-actions";
import { NotesGrid } from "@/widgets/notes-grid";

export const metadata = { title: "Заметки — Nexus CRM" };

export default function NotesPage() {
  return (
    <div className="space-y-4 relative min-h-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="typo-display text-primary">Заметки</h1>
          <p className="typo-caption text-on-surface-variant/70 mt-0.5">
            Заметки и история взаимодействия по контактам
          </p>
        </div>
        <CreateNoteButton>
          Добавить заметку
        </CreateNoteButton>
      </div>

      {/* Сетка заметок с поиском и фильтром */}
      <NotesGrid />

      {/* Floating Action Button for mobile */}
      <CreateNoteButton variant="fab" />
    </div>
  );
}
