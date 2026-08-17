"use client";

import { CreateContactModal, EditContactModal } from "@/features/contact-management";
import { CreateTaskModal, EditTaskModal } from "@/features/task-mutations";
import { CreateNoteModal, EditNoteModal } from "@/features/note-actions";
import { AccountSettingsModal } from "@/features/account-settings";
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
      <AccountSettingsModal />
      <ConfirmModal />
    </>
  );
}
