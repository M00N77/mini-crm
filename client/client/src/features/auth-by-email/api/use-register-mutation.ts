import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { registerRequest } from "./auth-api";
import { PayloadRegister, AuthResponse } from "../model/types";

export const useRegisterMutation = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: PayloadRegister) => registerRequest(payload),
    onSuccess: (data: AuthResponse) => {
      // TODO: Сохранить токен в zustand
      router.replace("/dashboard");
    },
  });
};
