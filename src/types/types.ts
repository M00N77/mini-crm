export interface Task{
    id: number;
    title: string;
    description: string | null;
    userId: number;
    status: string;
    createdAt: Date
}