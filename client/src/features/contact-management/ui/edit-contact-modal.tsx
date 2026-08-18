"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useContact, useUpdateContact, Contact } from "@/entities/contact";
import { User, Mail, Phone, Building2, Briefcase, Edit3 } from "lucide-react";
import {
  contactFormSchema,
  ContactFormData,
} from "../model/contact-schema";

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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    mode: "onBlur",
    defaultValues: {
      name: (initialData?.name as string) || "",
      email: (initialData?.email as string) || "",
      phone: (initialData?.phone as string) || "",
      company: (initialData?.company as string) || "",
      jobPosition:
        (initialData?.jobPosition as string) ||
        (initialData?.position as string) ||
        "",
    },
  });

  const { mutate: updateContact, isPending } = useUpdateContact();

  const onSubmit = (data: ContactFormData) => {
    if (!contactId) return;

    updateContact(
      {
        id: contactId,
        payload: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          company: data.company || null,
          jobPosition: data.jobPosition || null,
        },
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <form
      noValidate
      action="javascript:void(0);"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(onSubmit)(e);
      }}
      className="space-y-4 py-2 font-sans"
    >
      {/* Имя */}
      <div className="space-y-1">
        <label
          htmlFor="edit-contact-name"
          className="text-xs font-mono text-text-secondary flex items-center gap-1.5"
        >
          <User className="h-3.5 w-3.5 text-text-tertiary" />
          ИМЯ <span className="text-status-danger">*</span>
        </label>
        <input
          id="edit-contact-name"
          type="text"
          placeholder="Имя контакта"
          {...register("name")}
          className={`w-full rounded-none border bg-subtle px-3 py-2 text-xs font-mono text-text-primary placeholder:text-text-tertiary focus:outline-none transition-colors ${
            errors.name
              ? "border-status-danger focus:border-status-danger"
              : "border-border-subtle focus:border-border-strong"
          }`}
        />
        {errors.name && (
          <p className="text-[11px] font-mono text-status-danger">{errors.name.message}</p>
        )}
      </div>

      {/* Email & Телефон */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label
            htmlFor="edit-contact-email"
            className="text-xs font-mono text-text-secondary flex items-center gap-1.5"
          >
            <Mail className="h-3.5 w-3.5 text-text-tertiary" />
            EMAIL <span className="text-status-danger">*</span>
          </label>
          <input
            id="edit-contact-email"
            type="email"
            placeholder="user@example.com"
            {...register("email")}
            className={`w-full rounded-none border bg-subtle px-3 py-2 text-xs font-mono text-text-primary placeholder:text-text-tertiary focus:outline-none transition-colors ${
              errors.email
                ? "border-status-danger focus:border-status-danger"
                : "border-border-subtle focus:border-border-strong"
            }`}
          />
          {errors.email && (
            <p className="text-[11px] font-mono text-status-danger">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label
            htmlFor="edit-contact-phone"
            className="text-xs font-mono text-text-secondary flex items-center gap-1.5"
          >
            <Phone className="h-3.5 w-3.5 text-text-tertiary" />
            ТЕЛЕФОН <span className="text-status-danger">*</span>
          </label>
          <input
            id="edit-contact-phone"
            type="tel"
            placeholder="+7 (999) 000-00-00"
            {...register("phone")}
            className={`w-full rounded-none border bg-subtle px-3 py-2 text-xs font-mono text-text-primary placeholder:text-text-tertiary focus:outline-none transition-colors ${
              errors.phone
                ? "border-status-danger focus:border-status-danger"
                : "border-border-subtle focus:border-border-strong"
            }`}
          />
          {errors.phone && (
            <p className="text-[11px] font-mono text-status-danger">{errors.phone.message}</p>
          )}
        </div>
      </div>

      {/* Компания & Должность */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label
            htmlFor="edit-contact-company"
            className="text-xs font-mono text-text-secondary flex items-center gap-1.5"
          >
            <Building2 className="h-3.5 w-3.5 text-text-tertiary" />
            КОМПАНИЯ
          </label>
          <input
            id="edit-contact-company"
            type="text"
            placeholder="Название компании"
            {...register("company")}
            className={`w-full rounded-none border bg-subtle px-3 py-2 text-xs font-mono text-text-primary placeholder:text-text-tertiary focus:outline-none transition-colors ${
              errors.company
                ? "border-status-danger focus:border-status-danger"
                : "border-border-subtle focus:border-border-strong"
            }`}
          />
          {errors.company && (
            <p className="text-[11px] font-mono text-status-danger">{errors.company.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label
            htmlFor="edit-contact-position"
            className="text-xs font-mono text-text-secondary flex items-center gap-1.5"
          >
            <Briefcase className="h-3.5 w-3.5 text-text-tertiary" />
            ДОЛЖНОСТЬ
          </label>
          <input
            id="edit-contact-position"
            type="text"
            placeholder="Должность"
            {...register("jobPosition")}
            className={`w-full rounded-none border bg-subtle px-3 py-2 text-xs font-mono text-text-primary placeholder:text-text-tertiary focus:outline-none transition-colors ${
              errors.jobPosition
                ? "border-status-danger focus:border-status-danger"
                : "border-border-subtle focus:border-border-strong"
            }`}
          />
          {errors.jobPosition && (
            <p className="text-[11px] font-mono text-status-danger">
              {errors.jobPosition.message}
            </p>
          )}
        </div>
      </div>

      <DialogFooter className="pt-3 gap-2 sm:gap-2 font-mono">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="rounded-none text-xs"
        >
          Отмена
        </Button>
        <Button
          type="submit"
          disabled={isPending}
          className="rounded-none text-xs bg-accent text-accent-contrast hover:bg-accent-hover font-bold disabled:opacity-50"
        >
          {isPending ? "Сохранение..." : "Сохранить изменения"}
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
      <DialogContent 
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="sm:max-w-[500px] bg-surface border-border-strong text-text-primary rounded-none"
      >
        <DialogHeader>
          <DialogTitle className="text-sm font-bold text-text-primary flex items-center gap-2 font-mono">
            <Edit3 className="h-4.5 w-4.5 text-accent" />
            РЕДАКТИРОВАТЬ КОНТАКТ
          </DialogTitle>
          <DialogDescription className="text-xs text-text-secondary">
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
