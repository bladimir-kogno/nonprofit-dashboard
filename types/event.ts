// types/event.ts

export type Event = {
    id: string;
    title: string;
    date: string;
    location: string;
    description?: string;
    status: 'upcoming' | 'completed' | 'cancelled';
    attendees: string[]; // array of volunteer IDs
    createdAt: string;
    updatedAt: string;
};
