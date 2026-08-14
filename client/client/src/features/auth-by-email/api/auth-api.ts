import { apiClient } from "@/shared/api";
import { AuthResponse, PayloadLogin,PayloadRegister} from "../model/types";

export const loginRequest = async (payload: PayloadLogin): Promise<AuthResponse> => {
  return apiClient.post<AuthResponse>("/auth/login", payload);
};

export const registerRequest = async (payload: PayloadRegister): Promise<AuthResponse> => {
  return apiClient.post<AuthResponse>('/auth/register', payload);
}
