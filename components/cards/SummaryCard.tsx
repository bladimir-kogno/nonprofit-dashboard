// components/cards/SummaryCard.tsx

type SummaryCardProps = {
    title: string;
    value: number;
};

export default function SummaryCard({ title, value }: SummaryCardProps) {
    return (
        <div className="bg-white border rounded-md p-4 shadow-sm">
            <div className="text-sm text-gray-500">{title}</div>
            <div className="text-2xl font-bold mt-1">{value}</div>
        </div>
    );
}
