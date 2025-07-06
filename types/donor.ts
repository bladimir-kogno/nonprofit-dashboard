// types/donor.ts

export type Donor = {
    id: string;
    name: string;
    email: string;
    phone?: string;
    totalDonated: number;
    lastDonationDate?: string;
    createdAt: string;
    updatedAt: string;
};
