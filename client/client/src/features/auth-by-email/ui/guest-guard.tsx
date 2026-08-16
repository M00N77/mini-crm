"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/shared/store/use-auth-store";

interface GuestGuardProps {
  children: React.ReactNode;
}

export function GuestGuard({ children }: GuestGuardProps) {
  const router = useRouter();
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const isAuth = useAuthStore((state) => state.isAuth);
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    if (isHydrated && isAuth && accessToken) {
      router.replace("/dashboard");
    }
  }, [isHydrated, isAuth, accessToken, router]);

  if (!isHydrated || (isAuth && accessToken)) {
    return (
      <div className="flex h-dvh w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="typo-caption text-on-surface-variant/70">
            Загрузка...
          </span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
