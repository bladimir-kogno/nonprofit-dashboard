type SummaryCardProps = {
    title: string;
    value: number;
};

export default function SummaryCard({ title, value }: SummaryCardProps) {
    return (
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
    );
}
