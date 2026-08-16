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
        className="w-full rounded bg-primary text-on-primary px-4 py-2 typo-body-lg font-medium hover:bg-primary-fixed-dim transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
  );
}
