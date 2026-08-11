"use client";

// TODO: Wire to API via shared/api, validate with Zod
// Imports: shared/api, shared/ui (Button, Input, Label)

export function LoginForm() {
  return (
    <form className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="email" className="typo-caption text-on-surface-variant">
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="user@example.com"
          className="w-full rounded border border-outline-variant bg-surface-container px-3 py-2 typo-body-sm text-primary placeholder:text-on-surface-variant/50 focus:border-outline focus:outline-none transition-colors"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="password" className="typo-caption text-on-surface-variant">
          Пароль
        </label>
        <input
          id="password"
          type="password"
          placeholder="••••••••"
          className="w-full rounded border border-outline-variant bg-surface-container px-3 py-2 typo-body-sm text-primary placeholder:text-on-surface-variant/50 focus:border-outline focus:outline-none transition-colors"
        />
      </div>
      <button
        type="submit"
        className="w-full rounded bg-primary text-on-primary px-4 py-2 typo-body-lg font-medium hover:bg-primary-fixed-dim transition-colors"
      >
        Войти
      </button>
      <p className="text-center typo-caption text-on-surface-variant">
        Нет аккаунта?{" "}
        <a href="/register" className="text-primary hover:underline">
          Регистрация
        </a>
      </p>
    </form>
  );
}
