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
    company: string | null;
    jobPosition: string | null;
    userId: number;
    createdAt: Date;
}

export interface Notes {
    id: number;
    content: string;
    contactId: number;
    createdAt: Date;
}

export interface TokenPayload {
    userId: number;
    email: string;
    jti?: string;

}

