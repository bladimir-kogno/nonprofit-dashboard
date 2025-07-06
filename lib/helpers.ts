// lib/helpers.ts

export function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

export function formatCurrency(amount: number): string {
    return `$${amount.toFixed(2)}`;
}
