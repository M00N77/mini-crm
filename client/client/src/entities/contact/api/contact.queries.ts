import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as apiContact from "./contact-api";
import { toast } from "@/shared/store/toast-store";
import { notifyActivity } from "@/shared/store/notification-store";

export const useContacts = (params?: apiContact.GetContactsParams) => {
  return useQuery({
    queryKey: ["contacts", params],
    queryFn: () => apiContact.getContacts(params),
  });
};

export const useContact = (id: number) => {
  return useQuery({
    queryKey: ["contacts", id],
    queryFn: () => apiContact.getContactById(id),
    enabled: typeof id === "number" && !isNaN(id),
  });
};

export const useCreateContact = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: apiContact.CreateContactPayload) =>
      apiContact.createContact(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      toast.success(
        "Контакт создан",
        data?.name ? `Контакт «${data.name}» успешно добавлен` : undefined
      );
      notifyActivity(
        "Новый контакт",
        data?.name ? `Контакт «${data.name}» добавлен в систему` : "Новый контакт добавлен",
        "contact"
      );
    },
    onError: (error: Error) => {
      toast.error(
        "Ошибка при создании контакта",
        error?.message || "Попробуйте позже"
      );
    },
  });
};

export const useUpdateContact = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: apiContact.UpdateContactPayload;
    }) => apiContact.updateContact(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      toast.success(
        "Контакт обновлен",
        data?.name ? `Данные «${data.name}» сохранены` : undefined
      );
    },
    onError: (error: Error) => {
      toast.error(
        "Ошибка при обновлении контакта",
        error?.message || "Попробуйте позже"
      );
    },
  });
};

export const useDeleteContact = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => apiContact.deleteContact(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      toast.success("Контакт удален", "Контакт успешно удален из системы");
      notifyActivity("Контакт удален", "Контакт был удален из базы", "contact");
    },
    onError: (error: Error) => {
      toast.error(
        "Ошибка при удалении контакта",
        error?.message || "Попробуйте позже"
      );
    },
  });
};