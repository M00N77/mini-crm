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
  isHydrated: boolean;
  setHydrated: () => void;
  setAuth: (payload: { user: User; accessToken: string }) => void;
  setAccessToken: (accessToken: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuth: false,
      isHydrated: false,

      setHydrated: () => set({ isHydrated: true }),

      setAuth: ({ user, accessToken }) =>
        set({
          user,
          accessToken,
          isAuth: true,
        }),

      setAccessToken: (accessToken) =>
        set((state) => ({
          accessToken,
          isAuth: true,
          user: state.user,
        })),

      setUser: (user) =>
        set({
          user,
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
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuth: state.isAuth,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);
