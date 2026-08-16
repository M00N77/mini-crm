import { CreateNoteButton } from "@/features/note-actions";

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

      <div className="rounded-lg border border-outline-variant bg-surface-container-lowest p-8 text-center text-on-surface-variant/60 typo-body-sm flex flex-col items-center justify-center gap-3">
        <p>Список заметок пуст</p>
        <CreateNoteButton variant="outline">
          Создать первую заметку
        </CreateNoteButton>
      </div>

      {/* Floating Action Button for mobile */}
      <CreateNoteButton variant="fab" />
    </div>
  );
}
