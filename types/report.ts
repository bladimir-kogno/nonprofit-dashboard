// types/report.ts

export type DonationSummary = {
    month: string;
    totalAmount: number;
};

export type VolunteerHoursReport = {
    volunteerId: string;
    volunteerName: string;
    totalHours: number;
};

export type EventAttendanceReport = {
    eventId: string;
    eventTitle: string;
    totalAttendees: number;
};
