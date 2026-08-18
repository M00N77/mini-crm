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

const GOOGLE_AUTH_URL =
  process.env.NEXT_PUBLIC_API_URL
    ? `${process.env.NEXT_PUBLIC_API_URL}/auth/google`
    : "https://mini-crm-api-ms.vercel.app/auth/google";

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
        className="flex w-full items-center justify-center gap-3 rounded-none border border-border-strong bg-surface px-4 py-2.5 text-xs font-mono font-medium text-text-primary hover:bg-subtle hover:border-text-primary transition-all duration-150 cursor-pointer shadow-xs active:scale-[0.99]"
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
      <div className="relative my-4 font-mono text-xs">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border-subtle" />
        </div>
        <div className="relative flex justify-center uppercase">
          <span className="bg-surface px-2 text-text-tertiary text-[10px]">
            // или через почту
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
        className="space-y-3.5"
      >
        {isError && (
          <div className="p-3 text-xs font-mono text-status-danger bg-status-danger-bg rounded-none border border-status-danger-border">
            {(error as Error)?.message || "Ошибка регистрации. Попробуйте позже."}
          </div>
        )}
        <div className="space-y-1">
          <label htmlFor="name" className="text-xs font-mono text-text-secondary">
            ИМЯ ОПЕРАТОРА
          </label>
          <input
            disabled={isPending}
            {...register("name")}
            id="name"
            type="text"
            placeholder="Иван Иванов"
            className={`w-full rounded-none border bg-subtle px-3 py-2 text-xs font-mono text-text-primary placeholder:text-text-tertiary focus:outline-none transition-colors disabled:opacity-50 ${
              errors.name
                ? "border-status-danger focus:border-status-danger"
                : "border-border-subtle focus:border-border-strong"
            }`}
          />
          {errors.name && (
            <p className="text-[11px] font-mono text-status-danger">{errors.name.message}</p>
          )}
        </div>
        <div className="space-y-1">
          <label htmlFor="reg-email" className="text-xs font-mono text-text-secondary">
            EMAIL
          </label>
          <input
            disabled={isPending}
            {...register("email")}
            id="reg-email"
            type="email"
            placeholder="operator@nexus.crm"
            className={`w-full rounded-none border bg-subtle px-3 py-2 text-xs font-mono text-text-primary placeholder:text-text-tertiary focus:outline-none transition-colors disabled:opacity-50 ${
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
          <label htmlFor="reg-password" className="text-xs font-mono text-text-secondary">
            ПАРОЛЬ
          </label>
          <input
            disabled={isPending}
            {...register("password")}
            id="reg-password"
            type="password"
            placeholder="••••••••"
            className={`w-full rounded-none border bg-subtle px-3 py-2 text-xs font-mono text-text-primary placeholder:text-text-tertiary focus:outline-none transition-colors disabled:opacity-50 ${
              errors.password
                ? "border-status-danger focus:border-status-danger"
                : "border-border-subtle focus:border-border-strong"
            }`}
          />
          {errors.password && (
            <p className="text-[11px] font-mono text-status-danger">{errors.password.message}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-none bg-accent text-accent-contrast px-4 py-2 text-xs font-mono font-bold hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer border border-accent-border uppercase tracking-wider"
        >
          {isPending ? "Создание учетной записи..." : "Создать аккаунт"}
        </button>
        <p className="text-center text-xs font-mono text-text-tertiary pt-1">
          Уже зарегистрированы?{" "}
          <Link href="/login" className="text-accent hover:underline font-bold">
            Войти
          </Link>
        </p>
      </form>
    </div>
  );
}
