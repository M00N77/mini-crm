"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/shared/store/use-auth-store";
import { PayloadLogin } from "../model/types";
import { useLoginMutation } from "../api/use-login-mutation";

const loginSchema = z.object({
  email: z.string().email("Введите корректный email"),
  password: z.string().min(6, "Пароль должен быть не менее 6 символов"),
});

export function LoginForm() {
  const router = useRouter();
  const isAuth = useAuthStore((state) => state.isAuth);
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    if (isAuth && accessToken) {
      router.replace("/dashboard");
    }
  }, [isAuth, accessToken, router]);

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
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: PayloadLogin) => {
    login(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {isError && (
        <div className="p-3 text-sm text-red-500 bg-red-500/10 rounded border border-red-500/20">
          {(error as Error)?.message || "Ошибка входа. Проверьте данные."}
        </div>
      )}
      <div className="space-y-2">
        <label htmlFor="email" className="typo-caption text-on-surface-variant">
          Email
        </label>
        <input
          disabled={isPending}
          {...register("email")}
          id="email"
          type="email"
          placeholder="user@example.com"
          className="w-full rounded border border-outline-variant bg-surface-container px-3 py-2 typo-body-sm text-primary placeholder:text-on-surface-variant/50 focus:border-outline focus:outline-none transition-colors disabled:opacity-50"
        />
        {errors.email && (
          <p className="text-xs text-red-500">{errors.email.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <label htmlFor="password" className="typo-caption text-on-surface-variant">
          Пароль
        </label>
        <input
          disabled={isPending}
          {...register("password")}
          id="password"
          type="password"
          placeholder="••••••••"
          className="w-full rounded border border-outline-variant bg-surface-container px-3 py-2 typo-body-sm text-primary placeholder:text-on-surface-variant/50 focus:border-outline focus:outline-none transition-colors disabled:opacity-50"
        />
        {errors.password && (
          <p className="text-xs text-red-500">{errors.password.message}</p>
        )}
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded bg-primary text-on-primary px-4 py-2 typo-body-lg font-medium hover:bg-primary-fixed-dim transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? "Вход..." : "Войти"}
      </button>
      <p className="text-center typo-caption text-on-surface-variant">
        Нет аккаунта?{" "}
        <Link href="/register" className="text-primary hover:underline">
          Регистрация
        </Link>
      </p>
    </form>
  );
}
