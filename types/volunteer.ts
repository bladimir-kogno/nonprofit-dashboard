// types/volunteer.ts

export type Volunteer = {
    id: string;
    name: string;
    email: string;
    phone?: string;
    skills: string[];
    hoursLogged: number;
    active: boolean;
    createdAt: string;
    updatedAt: string;
};
