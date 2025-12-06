export default function Anniversaries() {
    const items = [
        { title: "Create a masterpiece", color: "bg-blue-50" },
        { title: "Recognize Ancestors", color: "bg-red-50" },
        { title: "Memories worth passing on", color: "bg-yellow-50" },
        { title: "Explore your ancestors", color: "bg-green-50" },
    ];

    return (
        <div>
            <h3 className="font-semibold mb-3">Anniversaries</h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {items.map((item, i) => (
                    <div key={i} className={`p-4 rounded-xl shadow ${item.color}`}>
                        <h4 className="font-medium mb-2">{item.title}</h4>
                        <button className="px-3 py-1 bg-white rounded border">Play video</button>
                    </div>
                ))}
            </div>
        </div>
    );
}
