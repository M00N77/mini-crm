"use client";

import { CreateContactModal, EditContactModal } from "@/features/contact-management";
import { CreateTaskModal, EditTaskModal } from "@/features/task-mutations";
import { CreateNoteModal, EditNoteModal } from "@/features/note-actions";
import { ConfirmModal } from "@/shared/ui";

export function ModalProvider() {
  return (
    <>
      <CreateContactModal />
      <EditContactModal />
      <CreateTaskModal />
      <EditTaskModal />
      <CreateNoteModal />
      <EditNoteModal />
      <ConfirmModal />
    </>
  );
}
