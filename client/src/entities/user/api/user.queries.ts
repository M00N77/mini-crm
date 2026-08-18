import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as apiUser from './user-api';

export const useUsers = () => {
    return useQuery({
        queryKey: ['users'],
        queryFn: apiUser.getUsers,
    });
};

export const useMe = () => {
    return useQuery({
        queryKey: ['users', 'me'],
        queryFn: apiUser.getMe,
    });
};

export const useUser = (id: number) => {
    return useQuery({
        queryKey: ['users', id],
        queryFn: () => apiUser.getUserById(id),
    });
};

export const useDeleteUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => apiUser.deleteUser(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });
};
