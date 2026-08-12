import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as apiNote from './note-api';

export const useNotes = () => {
    return useQuery({
        queryKey: ['notes'],
        queryFn: apiNote.getNotes,
    });
};

export const useNote = (id: number) => {
    return useQuery({
        queryKey: ['notes', id],
        queryFn: () => apiNote.getNoteById(id),
    });
};

export const useCreateNote = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: apiNote.CreateNotePayload) => apiNote.createNote(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notes'] });
        },
    });
};

export const useUpdateNote = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: apiNote.UpdateNotePayload }) => 
            apiNote.updateNote(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notes'] });
        },
    });
};

export const useDeleteNote = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => apiNote.deleteNote(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notes'] });
        },
    });
};
