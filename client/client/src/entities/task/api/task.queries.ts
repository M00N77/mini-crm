import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as apiTask from "./task-api";
import { toast } from "@/shared/store/toast-store";

export const useTasks = (params?: apiTask.GetTasksParams) => {
  return useQuery({
    queryKey: ["tasks", params],
    queryFn: () => apiTask.getTasks(params),
  });
};

export const useTask = (id: number) => {
  return useQuery({
    queryKey: ["tasks", id],
    queryFn: () => apiTask.getTaskById(id),
    enabled: typeof id === "number" && !isNaN(id),
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: apiTask.CreateTaskPayload) =>
      apiTask.createTask(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success(
        "Задача создана",
        data?.title ? `Задача «${data.title}» добавлена` : undefined
      );
    },
    onError: (error: Error) => {
      toast.error(
        "Ошибка при создании задачи",
        error?.message || "Попробуйте позже"
      );
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: apiTask.UpdateTaskPayload;
    }) => apiTask.updateTask(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success(
        "Задача обновлена",
        data?.title ? `Изменения для «${data.title}» сохранены` : undefined
      );
    },
    onError: (error: Error) => {
      toast.error(
        "Ошибка при обновлении задачи",
        error?.message || "Попробуйте позже"
      );
    },
  });
};

export const usePatchTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: apiTask.PatchTaskPayload;
    }) => apiTask.patchTask(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      if (data?.status) {
        const statusLabel =
          data.status === "in_progress"
            ? "In Progress"
            : data.status === "done"
            ? "Done"
            : "Pending";
        toast.info(
          "Статус задачи изменен",
          `Задача «${data.title}» перемещена в ${statusLabel}`
        );
      }
    },
    onError: (error: Error) => {
      toast.error(
        "Ошибка при смене статуса",
        error?.message || "Попробуйте позже"
      );
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => apiTask.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Задача удалена", "Задача успешно удалена с доски");
    },
    onError: (error: Error) => {
      toast.error(
        "Ошибка при удалении задачи",
        error?.message || "Попробуйте позже"
      );
    },
  });
};
