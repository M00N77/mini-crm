import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as apiNote from "./note-api";
import { toast } from "@/shared/store/toast-store";
import { notifyActivity } from "@/shared/store/notification-store";

export const useNotes = (params?: apiNote.GetNotesParams) => {
  return useQuery({
    queryKey: ["notes", params],
    queryFn: () => apiNote.getNotes(params),
  });
};

export const useNote = (id: number) => {
  return useQuery({
    queryKey: ["notes", id],
    queryFn: () => apiNote.getNoteById(id),
    enabled: typeof id === "number" && !isNaN(id),
  });
};

export const useCreateNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: apiNote.CreateNotePayload) =>
      apiNote.createNote(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Заметка создана", "Заметка успешно прикреплена к контакту");
      notifyActivity("Новая заметка", "Заметка прикреплена к карточке контакта", "note");
    },
    onError: (error: Error) => {
      toast.error(
        "Ошибка при создании заметки",
        error?.message || "Попробуйте позже"
      );
    },
  });
};

export const useUpdateNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: apiNote.UpdateNotePayload;
    }) => apiNote.updateNote(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Заметка обновлена", "Текст заметки успешно сохранен");
    },
    onError: (error: Error) => {
      toast.error(
        "Ошибка при обновлении заметки",
        error?.message || "Попробуйте позже"
      );
    },
  });
};

export const useDeleteNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => apiNote.deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Заметка удалена", "Заметка удалена из системы");
      notifyActivity("Заметка удалена", "Заметка удалена из базы", "note");
    },
    onError: (error: Error) => {
      toast.error(
        "Ошибка при удалении заметки",
        error?.message || "Попробуйте позже"
      );
    },
  });
};
