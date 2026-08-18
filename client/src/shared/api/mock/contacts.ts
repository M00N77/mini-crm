import { Contact } from "@/entities/contact";

export const MOCK_CONTACTS: Contact[] = [
  {
    id: 1,
    user_id: 1,
    name: "Alice Freeman",
    email: "alice.freeman@example.com",
    phone: "+1-555-0198",
    company: "TechFlow Inc.",
    position: "CTO",
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 2,
    user_id: 1,
    name: "Bob Builder",
    email: "bob@build.it",
    phone: null,
    company: "Build It LLC",
    position: "Lead Contractor",
    created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 3,
    user_id: 1,
    name: "Charlie Davis",
    email: "charlie.d@startup.io",
    phone: "+44-7700-900123",
    company: "Startup.io",
    position: "CEO",
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 4,
    user_id: 2,
    name: "Diana Prince",
    email: "diana@themyscira.gov",
    phone: "+1-555-7777",
    company: "Global Peace Initiative",
    position: "Ambassador",
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  }
];
