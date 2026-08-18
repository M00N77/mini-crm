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
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setUser = useAuthStore((state) => state.setUser);

  const [isVerifying, setIsVerifying] = useState(false);
  const hasAttemptedRefresh = useRef(false);

  useEffect(() => {
    if (!isHydrated) return;

    // 1. Проверяем наличие токена из Google OAuth в хэше URL (#token=...) или query параметре (?token=...)
    if (typeof window !== "undefined") {
      let incomingToken: string | null = null;

      if (window.location.hash) {
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        incomingToken = hashParams.get("token");
      }

      if (!incomingToken && window.location.search) {
        const searchParams = new URLSearchParams(window.location.search);
        incomingToken = searchParams.get("token");
      }

      if (incomingToken) {
        setAccessToken(incomingToken);
        window.history.replaceState(null, "", window.location.pathname);

        apiClient
          .get<User>("/users/me")
          .then((userData) => {
            if (userData) {
              setUser(userData);
            }
          })
          .catch(() => {});
        return;
      }
    }

    // 2. Если в сторе уже есть токен, доступ разрешен
    if (isAuth && accessToken) {
      return;
    }

    // 3. Если токена в памяти нет, пробуем тихий refresh через cookie
    if (!hasAttemptedRefresh.current) {
      hasAttemptedRefresh.current = true;
      setIsVerifying(true);

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
              // Токен валиден, игнорируем ошибку профиля
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
  }, [isHydrated, isAuth, accessToken, router, setUser, setAccessToken]);

  if (!isHydrated || isVerifying || (!isAuth && !accessToken)) {
    return (
      <div className="flex h-dvh w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-none border-2 border-accent border-t-transparent" />
          <span className="font-mono text-xs text-text-tertiary">
            Проверка авторизации...
          </span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
