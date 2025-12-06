export default function EventList() {
    const events = [
        "Memory Day of ABC – Updated profile information",
        "Memory Day – Submitted new document",
        "Memory Day of ABC – Completed project milestone",
    ];

    return (
        <div className="p-4 bg-white rounded-xl shadow">
            <h3 className="font-semibold mb-4">Last Events</h3>

            {events.map((e, index) => (
                <div key={index} className="flex items-center gap-3 mb-3">
                    <div className="w-3 h-3 bg-gray-300 rounded" />
                    <span>{e}</span>
                </div>
            ))}
        </div>
    );
}
