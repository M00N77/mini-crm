"use client";

import { useRegisterMutation } from "../api/use-register-mutation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PayloadRegister } from "../model/types";

const registerSchema = z.object({
  name: z.string().min(1, "Введите имя"),
  email: z.string().email("Введите корректный email"),
  password: z.string().min(6, "Пароль должен быть не менее 6 символов"),
});

const GOOGLE_AUTH_URL = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/auth/google`
  : "http://localhost:3000/auth/google";

export function RegisterForm() {
  const {
    mutate: registerUser,
    isPending,
    isError,
    error,
  } = useRegisterMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PayloadRegister>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: PayloadRegister) => {
    registerUser(data);
  };

  return (
    <div className="space-y-4">
      {/* Кнопка "Зарегистрироваться через Google" */}
      <a
        href={GOOGLE_AUTH_URL}
        className="flex w-full items-center justify-center gap-3 rounded-lg border border-outline-variant bg-surface-container-low px-4 py-2.5 typo-body-sm font-medium text-on-surface hover:bg-surface-container hover:text-primary hover:border-outline transition-all duration-150 cursor-pointer shadow-xs active:scale-[0.98]"
      >
        <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
        <span>Регистрация через Google</span>
      </a>

      {/* Разделитель */}
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-outline-variant/60" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-on-surface-variant/70 typo-caption text-[11px]">
            или через почту
          </span>
        </div>
      </div>

      <form
        noValidate
        action="javascript:void(0);"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(onSubmit)(e);
        }}
        className="space-y-4"
      >
        {isError && (
          <div className="p-3 text-sm text-error bg-error-container/20 rounded border border-error/30">
            {(error as Error)?.message || "Ошибка регистрации. Попробуйте позже."}
          </div>
        )}
        <div className="space-y-1.5">
          <label htmlFor="name" className="typo-caption text-on-surface-variant">
            Имя
          </label>
          <input
            disabled={isPending}
            {...register("name")}
            id="name"
            type="text"
            placeholder="Иван Иванов"
            className={`w-full rounded border bg-surface-container px-3 py-2 typo-body-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none transition-colors disabled:opacity-50 ${
              errors.name
                ? "border-error focus:border-error"
                : "border-outline-variant focus:border-outline"
            }`}
          />
          {errors.name && (
            <p className="text-xs text-error">{errors.name.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <label htmlFor="reg-email" className="typo-caption text-on-surface-variant">
            Email
          </label>
          <input
            disabled={isPending}
            {...register("email")}
            id="reg-email"
            type="email"
            placeholder="user@example.com"
            className={`w-full rounded border bg-surface-container px-3 py-2 typo-body-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none transition-colors disabled:opacity-50 ${
              errors.email
                ? "border-error focus:border-error"
                : "border-outline-variant focus:border-outline"
            }`}
          />
          {errors.email && (
            <p className="text-xs text-error">{errors.email.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <label htmlFor="reg-password" className="typo-caption text-on-surface-variant">
            Пароль
          </label>
          <input
            disabled={isPending}
            {...register("password")}
            id="reg-password"
            type="password"
            placeholder="••••••••"
            className={`w-full rounded border bg-surface-container px-3 py-2 typo-body-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none transition-colors disabled:opacity-50 ${
              errors.password
                ? "border-error focus:border-error"
                : "border-outline-variant focus:border-outline"
            }`}
          />
          {errors.password && (
            <p className="text-xs text-error">{errors.password.message}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded bg-primary text-on-primary px-4 py-2 typo-body-lg font-medium hover:bg-primary-fixed-dim transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isPending ? "Создание..." : "Создать аккаунт"}
        </button>
        <p className="text-center typo-caption text-on-surface-variant">
          Уже есть аккаунт?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Войти
          </Link>
        </p>
      </form>
    </div>
  );
}
