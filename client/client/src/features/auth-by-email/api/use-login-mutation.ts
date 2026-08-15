import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { loginRequest } from "./auth-api";
import { PayloadLogin, AuthResponse } from "../model/types";
import { useAuthStore } from "@/shared/store/use-auth-store";

export const useLoginMutation = () => {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (payload: PayloadLogin) => loginRequest(payload),
    onSuccess: (data: AuthResponse) => {
      setAuth({
        user: data.user,
        accessToken: data.accessToken,
      })
      router.replace("/dashboard");
    },
  });
};
