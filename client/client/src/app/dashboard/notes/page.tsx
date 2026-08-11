export const metadata = { title: "Заметки — Nexus CRM" };

export default function NotesPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="typo-display text-primary">Заметки</h1>
        {/* TODO: CreateNoteButton from features/note-actions */}
      </div>

      {/* TODO: NotesList widget or inline list of NoteCard entities */}
      <div className="rounded-lg border border-outline-variant bg-surface-container-low p-6 text-center text-on-surface-variant typo-body-sm">
        Список заметок будет здесь
      </div>
    </div>
  );
}
