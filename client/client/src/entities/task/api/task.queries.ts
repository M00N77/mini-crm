import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as apiTask from './task-api';

export const useTasks = () => {
    return useQuery({
        queryKey: ['tasks'],
        queryFn: apiTask.getTasks,
    });
};

export const useTask = (id: number) => {
    return useQuery({
        queryKey: ['tasks', id],
        queryFn: () => apiTask.getTaskById(id),
    });
};

export const useCreateTask = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: apiTask.CreateTaskPayload) => apiTask.createTask(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
    });
};

export const useUpdateTask = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: apiTask.UpdateTaskPayload }) => 
            apiTask.updateTask(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
    });
};

export const useDeleteTask = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => apiTask.deleteTask(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
    });
};
