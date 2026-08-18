"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore, User } from "@/shared/store/use-auth-store";
import { apiClient } from "@/shared/api";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const isAuth = useAuthStore((state) => state.isAuth);
  const accessToken = useAuthStore((state) => state.accessToken);
  const setUser = useAuthStore((state) => state.setUser);

  const [isVerifying, setIsVerifying] = useState(false);
  const hasAttemptedRefresh = useRef(false);

  useEffect(() => {
    if (!isHydrated) return;

    // Если в сторе уже есть токен, доступ разрешен
    if (isAuth && accessToken) {
      return;
    }

    // Если токена в памяти нет, пробуем тихий refresh через HttpOnly cookie
    if (!hasAttemptedRefresh.current) {
      hasAttemptedRefresh.current = true;
      setIsVerifying(true);

      apiClient
        .refreshAccessToken()
        .then(async (newToken) => {
          if (newToken) {
            // Подгружаем профиль пользователя, если он не сохранен
            try {
              const userData = await apiClient.get<User>("/users/me");
              if (userData) {
                setUser(userData);
              }
            } catch {
              // Игнорируем ошибку получения профиля, токен уже валиден
            }
            setIsVerifying(false);
          } else {
            router.replace("/");
          }
        })
        .catch(() => {
          router.replace("/");
        });
    }
  }, [isHydrated, isAuth, accessToken, router, setUser]);

  if (!isHydrated || isVerifying || (!isAuth && !accessToken)) {
    return (
      <div className="flex h-dvh w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="typo-caption text-on-surface-variant/70">
            Проверка авторизации...
          </span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
