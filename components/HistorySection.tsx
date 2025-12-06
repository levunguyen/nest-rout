export default function HistorySection() {
    return (
        <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-semibold mb-4">This week in history</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-200 h-64 rounded" />

                <div>
                    <h4 className="font-bold text-lg">1952: Deadly British Train Crash</h4>
                    <p className="mt-2 text-gray-600">
                        One of the deadliest train crashes in British history occurred on October 8,
                        1952, when three trains collided at a London station. More than 100 people
                        were killed and hundreds were injured.
                    </p>

                    <button className="mt-4 px-4 py-2 bg-gray-100 rounded">
                        Learn more
                    </button>
                </div>
            </div>
        </div>
    );
}
