"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/shared/store/use-auth-store";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    const isAuth = useAuthStore.getState().isAuth;
    const token = useAuthStore.getState().accessToken;

    if (isAuth && token) {
      router.replace("/dashboard");
    } else {
      router.replace("/login");
    }
  }, [router]);

  return null;
}
