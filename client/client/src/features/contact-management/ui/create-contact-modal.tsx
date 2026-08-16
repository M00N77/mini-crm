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
} from "@/shared/ui";
import { useModalStore } from "@/shared/store/modal-store";
import { useCreateContact } from "@/entities/contact";
import { User, Mail, Phone, Building2, Briefcase } from "lucide-react";


export function CreateContactModal() {
  const { isOpen, type, closeModal } = useModalStore();
  const isModalOpen = isOpen && type === "createContact";

  // Локальное состояние формы
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    jobPosition: "",
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

  const handleClose = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      company: "",
      jobPosition: "",
    });
    setErrors({});
    closeModal();
  };

  const {mutate:createContacts, isPending} = useCreateContact();
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setErrors({ name: "Имя обязательно для заполнения" });
      return;
    }
    createContacts(formData, {
      onSuccess: () => {
        handleClose();
      },
    });
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-120 bg-surface-container-lowest border-outline-variant text-on-surface">
        <DialogHeader>
          <DialogTitle className="typo-title-lg text-primary flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Новый контакт
          </DialogTitle>
          <DialogDescription className="typo-caption text-on-surface-variant">
            Заполните данные для добавления контакта в систему
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Имя (обязательное) */}
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
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Константин Константинопольский"
              className={`w-full rounded border bg-surface-container px-3 py-2 typo-body-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none transition-colors ${
                errors.name
                  ? "border-error focus:border-error"
                  : "border-outline-variant focus:border-primary"
              }`}
            />
            {errors.name && (
              <p className="typo-caption text-error">{errors.name}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label
                htmlFor="contact-email"
                className="typo-caption font-medium text-on-surface flex items-center gap-1.5"
              >
                <Mail className="h-3.5 w-3.5 text-on-surface-variant" />
                Email
              </label>
              <input
                id="contact-email"
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
                htmlFor="contact-phone"
                className="typo-caption font-medium text-on-surface flex items-center gap-1.5"
              >
                <Phone className="h-3.5 w-3.5 text-on-surface-variant" />
                Телефон
              </label>
              <input
                id="contact-phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+7 (999) 000-00-00"
                className="w-full rounded border border-outline-variant bg-surface-container px-3 py-2 typo-body-sm text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Компания & Должность (в 2 колонки) */}
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
                name="company"
                type="text"
                value={formData.company}
                onChange={handleInputChange}
                placeholder="ООО Рога и Копыта"
                className="w-full rounded border border-outline-variant bg-surface-container px-3 py-2 typo-body-sm text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:outline-none transition-colors"
              />
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
                name="jobPosition"
                type="text"
                value={formData.jobPosition}
                onChange={handleInputChange}
                placeholder="Менеджер проектов"
                className="w-full rounded border border-outline-variant bg-surface-container px-3 py-2 typo-body-sm text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:outline-none transition-colors"
              />
            </div>
          </div>

          <DialogFooter className="pt-3 gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
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
      </DialogContent>
    </Dialog>
  );
}
