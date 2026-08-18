import { create } from "zustand";

/**
 * Типы модальных окон в приложении.
 * Строгая типизация дает автокомплит в IDE и защищает от опечаток.
 */
export type ModalType =
  | "createContact"
  | "editContact"
  | "createTask"
  | "editTask"
  | "createNote"
  | "editNote"
  | "confirmDelete"
  | "accountSettings"
  | "commandPalette";

/**
 * Данные, передаваемые в модальное окно при открытии.
 */
export interface ModalData {
  id?: number;
  contactId?: number;
  taskId?: number;
  noteId?: number;
  defaultValues?: Record<string, unknown>;
  initialValues?: Record<string, unknown> | object;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "destructive" | "default";
  onConfirm?: () => Promise<void> | void;
  [key: string]: unknown;
}

interface ModalState {
  type: ModalType | null;
  isOpen: boolean;
  data: ModalData;
  openModal: (type: ModalType, data?: ModalData) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  type: null,
  isOpen: false,
  data: {},

  openModal: (type, data = {}) =>
    set({
      isOpen: true,
      type,
      data,
    }),

  closeModal: () =>
    set({
      isOpen: false,
      type: null,
      data: {},
    }),
}));
