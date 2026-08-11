import { ContactsTable } from "@/widgets/contacts-table";

export const metadata = { title: "Контакты — Nexus CRM" };

export default function ContactsPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="typo-display text-primary">Контакты</h1>
        {/* TODO: CreateContactButton from features/contact-management */}
      </div>
      <ContactsTable />
    </div>
  );
}
