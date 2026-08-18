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
    <div className="space-y-5 py-2 font-sans">
      {/* Профиль пользователя */}
      <div className="flex items-center gap-3 p-3.5 rounded-none border border-border-subtle bg-subtle">
        <div className="w-11 h-11 rounded-none bg-accent text-accent-contrast font-mono font-bold text-base flex items-center justify-center shrink-0 border border-accent-border">
          {initial}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h4 className="text-xs font-semibold text-text-primary truncate">
              {user?.name || "Пользователь"}
            </h4>
            <span className="inline-flex items-center gap-1 text-[10px] font-mono text-status-success bg-status-success-bg px-1.5 py-0.5 rounded-none border border-status-success-border font-medium">
              <ShieldCheck className="h-3 w-3" />
              АКТИВЕН
            </span>
          </div>
          <p className="font-mono text-text-tertiary text-xs truncate mt-0.5">
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
        className="space-y-3.5 font-sans"
      >
        <div className="flex items-center gap-2 pb-1 border-b border-border-subtle font-mono">
          <KeyRound className="h-4 w-4 text-accent" />
          <h5 className="text-xs font-bold text-text-primary uppercase tracking-wider">
            Смена пароля
          </h5>
        </div>

        {/* Текущий пароль */}
        <div className="space-y-1">
          <label
            htmlFor="old-password"
            className="text-xs font-mono text-text-secondary flex items-center justify-between"
          >
            <span>ТЕКУЩИЙ ПАРОЛЬ <span className="text-status-danger">*</span></span>
          </label>
          <div className="relative">
            <input
              id="old-password"
              type={showOldPassword ? "text" : "password"}
              placeholder="••••••••"
              {...register("oldPassword")}
              className={`w-full rounded-none border bg-subtle px-3 py-2 pr-9 text-xs font-mono text-text-primary placeholder:text-text-tertiary focus:outline-none transition-colors ${
                errors.oldPassword
                  ? "border-status-danger focus:border-status-danger"
                  : "border-border-subtle focus:border-border-strong"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowOldPassword((prev) => !prev)}
              tabIndex={-1}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary transition-colors cursor-pointer"
            >
              {showOldPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.oldPassword && (
            <p className="text-[11px] font-mono text-status-danger">{errors.oldPassword.message}</p>
          )}
        </div>

        {/* Новый пароль */}
        <div className="space-y-1">
          <label
            htmlFor="new-password"
            className="text-xs font-mono text-text-secondary flex items-center justify-between"
          >
            <span>НОВЫЙ ПАРОЛЬ <span className="text-status-danger">*</span></span>
          </label>
          <div className="relative">
            <input
              id="new-password"
              type={showNewPassword ? "text" : "password"}
              placeholder="••••••••"
              {...register("newPassword")}
              className={`w-full rounded-none border bg-subtle px-3 py-2 pr-9 text-xs font-mono text-text-primary placeholder:text-text-tertiary focus:outline-none transition-colors ${
                errors.newPassword
                  ? "border-status-danger focus:border-status-danger"
                  : "border-border-subtle focus:border-border-strong"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword((prev) => !prev)}
              tabIndex={-1}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary transition-colors cursor-pointer"
            >
              {showNewPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.newPassword && (
            <p className="text-[11px] font-mono text-status-danger">{errors.newPassword.message}</p>
          )}
        </div>

        {/* Подтверждение пароля */}
        <div className="space-y-1">
          <label
            htmlFor="confirm-password"
            className="text-xs font-mono text-text-secondary flex items-center justify-between"
          >
            <span>ПОДТВЕРЖДЕНИЕ ПАРОЛЯ <span className="text-status-danger">*</span></span>
          </label>
          <div className="relative">
            <input
              id="confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              {...register("confirmPassword")}
              className={`w-full rounded-none border bg-subtle px-3 py-2 pr-9 text-xs font-mono text-text-primary placeholder:text-text-tertiary focus:outline-none transition-colors ${
                errors.confirmPassword
                  ? "border-status-danger focus:border-status-danger"
                  : "border-border-subtle focus:border-border-strong"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              tabIndex={-1}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary transition-colors cursor-pointer"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-[11px] font-mono text-status-danger">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <DialogFooter className="pt-3 gap-2 sm:gap-2 font-mono">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="rounded-none text-xs"
          >
            Закрыть
          </Button>
          <Button
            type="submit"
            disabled={isPending}
            className="rounded-none text-xs bg-accent text-accent-contrast hover:bg-accent-hover font-bold disabled:opacity-50"
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
      <DialogContent className="sm:max-w-[480px] bg-surface border-border-strong text-text-primary rounded-none">
        <DialogHeader>
          <DialogTitle className="text-sm font-bold text-text-primary flex items-center gap-2 font-mono">
            <Settings className="h-4.5 w-4.5 text-accent" />
            НАСТРОЙКИ АККАУНТА
          </DialogTitle>
          <DialogDescription className="text-xs text-text-secondary">
            Управление параметрами учетной записи и безопасностью
          </DialogDescription>
        </DialogHeader>

        {isModalOpen && <AccountSettingsForm onClose={closeModal} />}
      </DialogContent>
    </Dialog>
  );
}
