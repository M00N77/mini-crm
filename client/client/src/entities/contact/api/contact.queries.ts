import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as apiContact from './contact-api';

export const useContacts = () => {
    return useQuery({
        queryKey: ['contacts'],
        queryFn: apiContact.getContacts,
    })
};

export const useContact = (id: number) => {
    return useQuery({
        queryKey: ['contacts', id],
        queryFn: () => apiContact.getContactById(id),
    })
};

export const useCreateContact = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: apiContact.CreateContactPayload) => apiContact.createContact(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['contacts'] });
        },
    });
};

export const useUpdateContact = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }: { id: number, payload: apiContact.UpdateContactPayload }) => apiContact.updateContact(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['contacts'] });
        },
    })
};

export const useDeleteContact = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => apiContact.deleteContact(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['contacts'] });
        },
    })
}