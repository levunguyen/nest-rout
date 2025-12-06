type Props = {
    title: string;
    value: string;
};

export default function CardStat({ title, value }: Props) {
    return (
        <div className="p-6 bg-white rounded-xl shadow">
            <h3 className="text-sm text-gray-500">{title}</h3>
            <p className="text-2xl font-semibold mt-2">{value}</p>
        </div>
    );
}
