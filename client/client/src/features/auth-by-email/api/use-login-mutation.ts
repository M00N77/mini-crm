import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { loginRequest } from "./auth-api";
import { PayloadLogin,AuthResponse } from "../model/types";

export const useLoginMutation = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: PayloadLogin) => loginRequest(payload),
    onSuccess: (data:AuthResponse) => {
      // TODO: Сохранить data.accessToken в zustand стор
      router.replace("/dashboard");
    },
  });
};
