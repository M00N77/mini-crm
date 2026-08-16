"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Button,
  Spinner,
} from "@/shared/ui";
import { useModalStore } from "@/shared/store/modal-store";
import { useContact, Contact } from "@/entities/contact";
import { User, Mail, Phone, Building2, Briefcase, Edit3 } from "lucide-react";

interface EditContactFormProps {
  initialData?: Partial<Contact> | Record<string, unknown>;
  contactId?: number;
  onClose: () => void;
}

function EditContactForm({
  initialData,
  contactId,
  onClose,
}: EditContactFormProps) {
  const [formData, setFormData] = useState({
    name: (initialData?.name as string) || "",
    email: (initialData?.email as string) || "",
    phone: (initialData?.phone as string) || "",
    company: (initialData?.company as string) || "",
    jobPosition:
      (initialData?.jobPosition as string) ||
      (initialData?.position as string) ||
      "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  // =========================================================================
  // МЕСТО ДЛЯ ПОДКЛЮЧЕНИЯ МУТАЦИИ РЕДАКТИРОВАНИЯ:
  //
  // const { mutate: updateContact, isPending } = useUpdateContact();
  // =========================================================================
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setErrors({ name: "Имя обязательно для заполнения" });
      return;
    }

    // TODO: Вызови свою мутацию обновления здесь. Например:
    // updateContact({ id: contactId, payload: formData }, {
    //   onSuccess: () => {
    //     onClose();
    //   }
    // });

    console.log("Обновленные данные контакта (готовы к отправке на бэк):", {
      id: contactId,
      ...formData,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-2">
      {/* Имя (обязательное) */}
      <div className="space-y-1.5">
        <label
          htmlFor="edit-contact-name"
          className="typo-caption font-medium text-on-surface flex items-center gap-1.5"
        >
          <User className="h-3.5 w-3.5 text-on-surface-variant" />
          Имя <span className="text-error">*</span>
        </label>
        <input
          id="edit-contact-name"
          name="name"
          type="text"
          required
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Имя контакта"
          className={`w-full rounded border bg-surface-container px-3 py-2 typo-body-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none transition-colors ${
            errors.name
              ? "border-error focus:border-error"
              : "border-outline-variant focus:border-primary"
          }`}
        />
        {errors.name && <p className="typo-caption text-error">{errors.name}</p>}
      </div>

      {/* Email & Телефон */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label
            htmlFor="edit-contact-email"
            className="typo-caption font-medium text-on-surface flex items-center gap-1.5"
          >
            <Mail className="h-3.5 w-3.5 text-on-surface-variant" />
            Email
          </label>
          <input
            id="edit-contact-email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="user@example.com"
            className="w-full rounded border border-outline-variant bg-surface-container px-3 py-2 typo-body-sm text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:outline-none transition-colors"
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="edit-contact-phone"
            className="typo-caption font-medium text-on-surface flex items-center gap-1.5"
          >
            <Phone className="h-3.5 w-3.5 text-on-surface-variant" />
            Телефон
          </label>
          <input
            id="edit-contact-phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="+7 (999) 000-00-00"
            className="w-full rounded border border-outline-variant bg-surface-container px-3 py-2 typo-body-sm text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Компания & Должность */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label
            htmlFor="edit-contact-company"
            className="typo-caption font-medium text-on-surface flex items-center gap-1.5"
          >
            <Building2 className="h-3.5 w-3.5 text-on-surface-variant" />
            Компания
          </label>
          <input
            id="edit-contact-company"
            name="company"
            type="text"
            value={formData.company}
            onChange={handleInputChange}
            placeholder="Название компании"
            className="w-full rounded border border-outline-variant bg-surface-container px-3 py-2 typo-body-sm text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:outline-none transition-colors"
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="edit-contact-position"
            className="typo-caption font-medium text-on-surface flex items-center gap-1.5"
          >
            <Briefcase className="h-3.5 w-3.5 text-on-surface-variant" />
            Должность
          </label>
          <input
            id="edit-contact-position"
            name="jobPosition"
            type="text"
            value={formData.jobPosition}
            onChange={handleInputChange}
            placeholder="Должность"
            className="w-full rounded border border-outline-variant bg-surface-container px-3 py-2 typo-body-sm text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:outline-none transition-colors"
          />
        </div>
      </div>

      <DialogFooter className="pt-3 gap-2 sm:gap-0">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="border-outline-variant text-on-surface hover:bg-surface-container"
        >
          Отмена
        </Button>
        <Button
          type="submit"
          className="bg-primary text-on-primary hover:opacity-90 transition-opacity"
        >
          Сохранить изменения
        </Button>
      </DialogFooter>
    </form>
  );
}

export function EditContactModal() {
  const { isOpen, type, data, closeModal } = useModalStore();
  const isModalOpen = isOpen && type === "editContact";
  const contactId = data?.id;

  const { data: fetchedContact, isLoading: isFetching } = useContact(
    contactId as number
  );

  const initialData = fetchedContact || data?.initialValues;

  return (
    <Dialog open={isModalOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent className="sm:max-w-120 bg-surface-container-lowest border-outline-variant text-on-surface">
        <DialogHeader>
          <DialogTitle className="typo-title-lg text-primary flex items-center gap-2">
            <Edit3 className="h-5 w-5 text-primary" />
            Редактировать контакт
          </DialogTitle>
          <DialogDescription className="typo-caption text-on-surface-variant">
            Измените контактные данные и сохраните изменения
          </DialogDescription>
        </DialogHeader>

        {isFetching && !initialData ? (
          <div className="py-8 flex items-center justify-center">
            <Spinner size="md" label="Загрузка данных контакта..." />
          </div>
        ) : (
          <EditContactForm
            key={`${contactId}-${initialData ? "loaded" : "init"}`}
            initialData={initialData}
            contactId={contactId}
            onClose={closeModal}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
