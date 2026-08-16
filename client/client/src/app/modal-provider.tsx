"use client";

import { CreateContactModal, EditContactModal } from "@/features/contact-management";

export function ModalProvider() {
  return (
    <>
      <CreateContactModal />
      <EditContactModal />
    </>
  );
}
