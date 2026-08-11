import { RegisterForm } from "@/features/auth-by-email";

export const metadata = { title: "Регистрация — Nexus CRM" };

export default function RegisterPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-background p-container-padding">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="typo-display text-primary">Nexus CRM</h1>
          <p className="typo-body-sm text-on-surface-variant">
            Создайте аккаунт
          </p>
        </div>
        <RegisterForm />
      </div>
    </main>
  );
}
