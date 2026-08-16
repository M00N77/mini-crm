"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore, User } from "@/shared/store/use-auth-store";
import { apiClient } from "@/shared/api";

interface GuestGuardProps {
  children: React.ReactNode;
}

export function GuestGuard({ children }: GuestGuardProps) {
  const router = useRouter();
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const isAuth = useAuthStore((state) => state.isAuth);
  const accessToken = useAuthStore((state) => state.accessToken);
  const setUser = useAuthStore((state) => state.setUser);

  const [isVerifying, setIsVerifying] = useState(true);
  const hasChecked = useRef(false);

  useEffect(() => {
    if (!isHydrated) return;

    // Если уже авторизован
    if (isAuth && accessToken) {
      router.replace("/dashboard");
      return;
    }

    // Если нет токена в памяти, пробуем восстановить сессию через refresh cookie
    if (!hasChecked.current) {
      hasChecked.current = true;

      apiClient
        .refreshAccessToken()
        .then(async (newToken) => {
          if (newToken) {
            try {
              const userData = await apiClient.get<User>("/users/me");
              if (userData) {
                setUser(userData);
              }
            } catch {
              // Игнорируем ошибку получения профиля
            }
            router.replace("/dashboard");
          } else {
            setIsVerifying(false);
          }
        })
        .catch(() => {
          setIsVerifying(false);
        });
    }
  }, [isHydrated, isAuth, accessToken, router, setUser]);

  if (!isHydrated || (isAuth && accessToken) || isVerifying) {
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
