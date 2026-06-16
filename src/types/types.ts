export interface Task{
    id: number;
    title: string;
    description: string | null;
    userId: number;
    status: string;
    createdAt: Date
}
export interface Contact {
    id: number;
    name: string;
    email: string | null;
    phone: string | null;
    userId: number;
    createdAt: Date;
}