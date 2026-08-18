"use client";

import { useState } from "react";
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
import { useAuthStore } from "@/shared/store/use-auth-store";
import { toast } from "@/shared/store/toast-store";
import { notifyActivity } from "@/shared/store/notification-store";
import { apiClient } from "@/shared/api";
import {
  Settings,
  KeyRound,
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react";
import {
  changePasswordSchema,
  ChangePasswordFormData,
} from "../model/account-schema";

interface AccountSettingsFormProps {
  onClose: () => void;
}

function AccountSettingsForm({ onClose }: AccountSettingsFormProps) {
  const user = useAuthStore((state) => state.user);
  const [isPending, setIsPending] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    mode: "onBlur",
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    setIsPending(true);
    try {
      await apiClient.post("/auth/changepass", {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      });

      toast.success(
        "Пароль успешно изменен",
        "Используйте новый пароль при следующем входе"
      );
      notifyActivity(
        "Безопасность",
        "Пароль учетной записи был успешно изменен",
        "security"
      );
      reset();
      onClose();
    } catch (error) {
      toast.error(
        "Не удалось сменить пароль",
        error instanceof Error ? error.message : "Проверьте правильность текущего пароля"
      );
    } finally {
      setIsPending(false);
    }
  };

  const initial = (user?.name || user?.email || "U").charAt(0).toUpperCase();

  return (
    <div className="space-y-5 py-2">
      {/* Профиль пользователя */}
      <div className="flex items-center gap-3 p-3.5 rounded-xl border border-outline-variant bg-surface-container-low/60">
        <div className="w-11 h-11 rounded-full bg-primary text-on-primary font-bold text-base flex items-center justify-center shrink-0">
          {initial}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h4 className="typo-body-sm font-semibold text-primary truncate">
              {user?.name || "Пользователь"}
            </h4>
            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 font-medium">
              <ShieldCheck className="h-3 w-3" />
              Активен
            </span>
          </div>
          <p className="typo-caption text-on-surface-variant/70 text-xs truncate mt-0.5">
            {user?.email || "—"}
          </p>
        </div>
      </div>

      {/* Форма смены пароля */}
      <form
        noValidate
        action="javascript:void(0);"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(onSubmit)(e);
        }}
        className="space-y-4"
      >
        <div className="flex items-center gap-2 pb-1 border-b border-outline-variant/60">
          <KeyRound className="h-4 w-4 text-primary" />
          <h5 className="typo-body-sm font-semibold text-primary">
            Смена пароля
          </h5>
        </div>

        {/* Текущий пароль */}
        <div className="space-y-1.5">
          <label
            htmlFor="old-password"
            className="typo-caption font-medium text-on-surface flex items-center justify-between"
          >
            <span>Текущий пароль <span className="text-error">*</span></span>
          </label>
          <div className="relative">
            <input
              id="old-password"
              type={showOldPassword ? "text" : "password"}
              placeholder="••••••••"
              {...register("oldPassword")}
              className={`w-full rounded border bg-surface-container px-3 py-2 pr-9 typo-body-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none transition-colors ${
                errors.oldPassword
                  ? "border-error focus:border-error"
                  : "border-outline-variant focus:border-primary"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowOldPassword((prev) => !prev)}
              tabIndex={-1}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant/60 hover:text-primary transition-colors cursor-pointer"
            >
              {showOldPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.oldPassword && (
            <p className="typo-caption text-error">{errors.oldPassword.message}</p>
          )}
        </div>

        {/* Новый пароль */}
        <div className="space-y-1.5">
          <label
            htmlFor="new-password"
            className="typo-caption font-medium text-on-surface flex items-center justify-between"
          >
            <span>Новый пароль <span className="text-error">*</span></span>
          </label>
          <div className="relative">
            <input
              id="new-password"
              type={showNewPassword ? "text" : "password"}
              placeholder="••••••••"
              {...register("newPassword")}
              className={`w-full rounded border bg-surface-container px-3 py-2 pr-9 typo-body-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none transition-colors ${
                errors.newPassword
                  ? "border-error focus:border-error"
                  : "border-outline-variant focus:border-primary"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword((prev) => !prev)}
              tabIndex={-1}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant/60 hover:text-primary transition-colors cursor-pointer"
            >
              {showNewPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.newPassword && (
            <p className="typo-caption text-error">{errors.newPassword.message}</p>
          )}
        </div>

        {/* Подтверждение пароля */}
        <div className="space-y-1.5">
          <label
            htmlFor="confirm-password"
            className="typo-caption font-medium text-on-surface flex items-center justify-between"
          >
            <span>Подтверждение пароля <span className="text-error">*</span></span>
          </label>
          <div className="relative">
            <input
              id="confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              {...register("confirmPassword")}
              className={`w-full rounded border bg-surface-container px-3 py-2 pr-9 typo-body-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none transition-colors ${
                errors.confirmPassword
                  ? "border-error focus:border-error"
                  : "border-outline-variant focus:border-primary"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              tabIndex={-1}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant/60 hover:text-primary transition-colors cursor-pointer"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="typo-caption text-error">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <DialogFooter className="pt-3 gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="border-outline-variant text-on-surface hover:bg-surface-container"
          >
            Закрыть
          </Button>
          <Button
            type="submit"
            disabled={isPending}
            className="bg-primary text-on-primary hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isPending ? "Сохранение..." : "Обновить пароль"}
          </Button>
        </DialogFooter>
      </form>
    </div>
  );
}

export function AccountSettingsModal() {
  const { isOpen, type, closeModal } = useModalStore();
  const isModalOpen = isOpen && type === "accountSettings";

  return (
    <Dialog open={isModalOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent className="sm:max-w-[480px] bg-surface-container-lowest border-outline-variant text-on-surface">
        <DialogHeader>
          <DialogTitle className="typo-title-lg text-primary flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            Настройки аккаунта
          </DialogTitle>
          <DialogDescription className="typo-caption text-on-surface-variant">
            Управление параметрами учетной записи и безопасностью
          </DialogDescription>
        </DialogHeader>

        {isModalOpen && <AccountSettingsForm onClose={closeModal} />}
      </DialogContent>
    </Dialog>
  );
}
