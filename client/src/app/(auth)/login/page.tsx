import { Suspense } from "react";
import { LoginForm } from "@/features/auth-by-email";

export const metadata = { title: "Войти - Nexus CRM" };

export default function LoginPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-background p-container-padding">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="typo-display text-primary">Nexus CRM</h1>
          <p className="typo-body-sm text-on-surface-variant">
            Войдите в свой аккаунт
          </p>
        </div>
        <Suspense fallback={<div className="h-40 flex items-center justify-center"><div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
