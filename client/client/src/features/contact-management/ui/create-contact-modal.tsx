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
} from "@/shared/ui";
import { useModalStore } from "@/shared/store/modal-store";
import { useCreateContact } from "@/entities/contact";
import { User, Mail, Phone, Building2, Briefcase } from "lucide-react";
import {
  contactFormSchema,
  ContactFormData,
} from "../model/contact-schema";

interface CreateContactFormProps {
  onClose: () => void;
}

function CreateContactForm({ onClose }: CreateContactFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      jobPosition: "",
    },
  });

  const { mutate: createContact, isPending } = useCreateContact();

  const onSubmit = (data: ContactFormData) => {
    createContact(
      {
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company || null,
        jobPosition: data.jobPosition || null,
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
      className="space-y-4 py-2"
    >
      {/* Имя */}
      <div className="space-y-1.5">
        <label
          htmlFor="contact-name"
          className="typo-caption font-medium text-on-surface flex items-center gap-1.5"
        >
          <User className="h-3.5 w-3.5 text-on-surface-variant" />
          Имя <span className="text-error">*</span>
        </label>
        <input
          id="contact-name"
          type="text"
          placeholder="Константин Константинопольский"
          {...register("name")}
          className={`w-full rounded border bg-surface-container px-3 py-2 typo-body-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none transition-colors ${
            errors.name
              ? "border-error focus:border-error"
              : "border-outline-variant focus:border-primary"
          }`}
        />
        {errors.name && (
          <p className="typo-caption text-error">{errors.name.message}</p>
        )}
      </div>

      {/* Email & Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label
            htmlFor="contact-email"
            className="typo-caption font-medium text-on-surface flex items-center gap-1.5"
          >
            <Mail className="h-3.5 w-3.5 text-on-surface-variant" />
            Email <span className="text-error">*</span>
          </label>
          <input
            id="contact-email"
            type="email"
            placeholder="user@example.com"
            {...register("email")}
            className={`w-full rounded border bg-surface-container px-3 py-2 typo-body-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none transition-colors ${
              errors.email
                ? "border-error focus:border-error"
                : "border-outline-variant focus:border-primary"
            }`}
          />
          {errors.email && (
            <p className="typo-caption text-error">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="contact-phone"
            className="typo-caption font-medium text-on-surface flex items-center gap-1.5"
          >
            <Phone className="h-3.5 w-3.5 text-on-surface-variant" />
            Телефон <span className="text-error">*</span>
          </label>
          <input
            id="contact-phone"
            type="tel"
            placeholder="+7 999 123-45-67"
            {...register("phone")}
            className={`w-full rounded border bg-surface-container px-3 py-2 typo-body-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none transition-colors ${
              errors.phone
                ? "border-error focus:border-error"
                : "border-outline-variant focus:border-primary"
            }`}
          />
          {errors.phone && (
            <p className="typo-caption text-error">{errors.phone.message}</p>
          )}
        </div>
      </div>

      {/* Компания & Должность */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label
            htmlFor="contact-company"
            className="typo-caption font-medium text-on-surface flex items-center gap-1.5"
          >
            <Building2 className="h-3.5 w-3.5 text-on-surface-variant" />
            Компания
          </label>
          <input
            id="contact-company"
            type="text"
            placeholder="ООО Яндекс"
            {...register("company")}
            className={`w-full rounded border bg-surface-container px-3 py-2 typo-body-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none transition-colors ${
              errors.company
                ? "border-error focus:border-error"
                : "border-outline-variant focus:border-primary"
            }`}
          />
          {errors.company && (
            <p className="typo-caption text-error">{errors.company.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="contact-position"
            className="typo-caption font-medium text-on-surface flex items-center gap-1.5"
          >
            <Briefcase className="h-3.5 w-3.5 text-on-surface-variant" />
            Должность
          </label>
          <input
            id="contact-position"
            type="text"
            placeholder="Руководитель проектов"
            {...register("jobPosition")}
            className={`w-full rounded border bg-surface-container px-3 py-2 typo-body-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none transition-colors ${
              errors.jobPosition
                ? "border-error focus:border-error"
                : "border-outline-variant focus:border-primary"
            }`}
          />
          {errors.jobPosition && (
            <p className="typo-caption text-error">
              {errors.jobPosition.message}
            </p>
          )}
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
          disabled={isPending}
          className="bg-primary text-on-primary hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {isPending ? "Создание..." : "Создать контакт"}
        </Button>
      </DialogFooter>
    </form>
  );
}

export function CreateContactModal() {
  const { isOpen, type, closeModal } = useModalStore();
  const isModalOpen = isOpen && type === "createContact";

  return (
    <Dialog open={isModalOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent className="sm:max-w-[500px] bg-surface-container-lowest border-outline-variant text-on-surface">
        <DialogHeader>
          <DialogTitle className="typo-title-lg text-primary flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Новый контакт
          </DialogTitle>
          <DialogDescription className="typo-caption text-on-surface-variant">
            Заполните данные для добавления контакта в систему
          </DialogDescription>
        </DialogHeader>

        {isModalOpen && <CreateContactForm onClose={closeModal} />}
      </DialogContent>
    </Dialog>
  );
}
