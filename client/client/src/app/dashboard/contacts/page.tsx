import { ContactsTable } from "@/widgets/contacts-table";
import { CreateContactButton } from "@/features/contact-management";

export const metadata = { title: "Контакты — Nexus CRM" };

export default function ContactsPage() {
  return (
    <div className="space-y-4 relative min-h-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="typo-display text-primary">Контакты</h1>
          <p className="typo-caption text-on-surface-variant/70 mt-0.5">
            Управление контактами и клиентами
          </p>
        </div>
        <CreateContactButton>
          Добавить контакт
        </CreateContactButton>
      </div>

      <ContactsTable />

      {/* Floating Action Button for mobile */}
      <CreateContactButton variant="fab" />
    </div>
  );
}
