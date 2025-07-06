// lib/validators.ts

import { z } from 'zod';

export const donorSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().optional(),
    totalDonated: z.number().min(0),
    lastDonationDate: z.string().optional(),
});

export const volunteerSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().optional(),
    skills: z.array(z.string()),
    hoursLogged: z.number().min(0),
    active: z.boolean(),
});

export const eventSchema = z.object({
    title: z.string().min(1),
    date: z.string(),
    location: z.string(),
    description: z.string().optional(),
    status: z.enum(['upcoming', 'completed', 'cancelled']),
    attendees: z.array(z.string()),
});
