"use client";

// TODO: Wire to API via shared/api, validate with Zod
// Imports: shared/api, shared/ui (Button, Input, Label)

export function RegisterForm() {
  return (
    <form className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="name" className="typo-caption text-on-surface-variant">
          Имя
        </label>
        <input
          id="name"
          type="text"
          placeholder="Иван Иванов"
          className="w-full rounded border border-outline-variant bg-surface-container px-3 py-2 typo-body-sm text-primary placeholder:text-on-surface-variant/50 focus:border-outline focus:outline-none transition-colors"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="reg-email" className="typo-caption text-on-surface-variant">
          Email
        </label>
        <input
          id="reg-email"
          type="email"
          placeholder="user@example.com"
          className="w-full rounded border border-outline-variant bg-surface-container px-3 py-2 typo-body-sm text-primary placeholder:text-on-surface-variant/50 focus:border-outline focus:outline-none transition-colors"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="reg-password" className="typo-caption text-on-surface-variant">
          Пароль
        </label>
        <input
          id="reg-password"
          type="password"
          placeholder="••••••••"
          className="w-full rounded border border-outline-variant bg-surface-container px-3 py-2 typo-body-sm text-primary placeholder:text-on-surface-variant/50 focus:border-outline focus:outline-none transition-colors"
        />
      </div>
      <button
        type="submit"
        className="w-full rounded bg-primary text-on-primary px-4 py-2 typo-body-lg font-medium hover:bg-primary-fixed-dim transition-colors"
      >
        Создать аккаунт
      </button>
      <p className="text-center typo-caption text-on-surface-variant">
        Уже есть аккаунт?{" "}
        <a href="/login" className="text-primary hover:underline">
          Войти
        </a>
      </p>
    </form>
  );
}
