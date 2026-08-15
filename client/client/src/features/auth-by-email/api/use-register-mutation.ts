import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { registerRequest } from "./auth-api";
import { PayloadRegister, AuthResponse } from "../model/types";
import { useAuthStore } from "@/shared/store/use-auth-store";

export const useRegisterMutation = () => {
  const router = useRouter();
  const setAuth = useAuthStore((state)=> state.setAuth)

  return useMutation({
    mutationFn: (payload: PayloadRegister) => registerRequest(payload),
    onSuccess: (data: AuthResponse) => {
      setAuth({
        user: data.user,
        accessToken:data.accessToken
      })
      router.replace("/dashboard");
    },
  });
};
