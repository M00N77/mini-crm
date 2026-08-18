"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PayloadLogin } from "../model/types";
import { useLoginMutation } from "../api/use-login-mutation";

const loginSchema = z.object({
  email: z.string().email("Введите корректный email"),
  password: z.string().min(6, "Пароль должен быть не менее 6 символов"),
});

const GOOGLE_AUTH_URL = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/auth/google`
  : "http://localhost:3000/auth/google";

export function LoginForm() {
  const searchParams = useSearchParams();
  const oauthError = searchParams.get("error");

  const {
    mutate: login,
    isPending,
    isError,
    error,
  } = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PayloadLogin>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: PayloadLogin) => {
    login(data);
  };

  return (
    <div className="space-y-4">
      {oauthError && (
        <div className="p-3 text-xs font-mono text-status-danger bg-status-danger-bg rounded-none border border-status-danger-border">
          {oauthError === "oauth_denied"
            ? "Вход через Google был отменен."
            : oauthError === "invalid_state"
            ? "Ошибка безопасности сессии. Попробуйте еще раз."
            : "Ошибка авторизации через Google. Попробуйте позже."}
        </div>
      )}

      {/* Кнопка "Войти через Google" */}
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
        <span>Войти через Google</span>
      </a>

      {/* Разделитель */}
      <div className="relative my-4 font-mono text-xs">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border-subtle" />
        </div>
        <div className="relative flex justify-center uppercase">
          <span className="bg-surface px-2 text-text-tertiary text-[10px]">
            // или через пароль
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
            {(error as Error)?.message || "Ошибка входа. Проверьте данные."}
          </div>
        )}
        <div className="space-y-1">
          <label htmlFor="email" className="text-xs font-mono text-text-secondary">
            EMAIL
          </label>
          <input
            disabled={isPending}
            {...register("email")}
            id="email"
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
          <label htmlFor="password" className="text-xs font-mono text-text-secondary">
            ПАРОЛЬ
          </label>
          <input
            disabled={isPending}
            {...register("password")}
            id="password"
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
          {isPending ? "Вход в сессию..." : "Войти в систему"}
        </button>
        <p className="text-center text-xs font-mono text-text-tertiary pt-1">
          Нет учетной записи?{" "}
          <Link href="/register" className="text-accent hover:underline font-bold">
            Регистрация
          </Link>
        </p>
      </form>
    </div>
  );
}
