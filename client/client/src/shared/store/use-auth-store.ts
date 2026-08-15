import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface User {
  id: number;
  email: string;
  name?: string;
  createdAt?: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuth: boolean;
  setAuth: (payload: { user: User; accessToken: string }) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuth: false,

      setAuth: ({ user, accessToken }) =>
        set({
          user,
          accessToken,
          isAuth: true,
        }),

      logout: () =>
        set({
          user: null,
          accessToken: null,
          isAuth: false,
        }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
