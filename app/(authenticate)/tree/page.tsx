import FamilyTreeClient from "./tree-components/FamilyTreeClient"

export default function FamilyTreePage() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
            <div className="bg-white border-b border-amber-200 px-6 py-4 sticky top-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-serif font-bold text-amber-900">Family Tree</h1>
                    <p className="text-amber-700 text-sm mt-1">Drag to move, scroll to zoom • Showing multiple generations</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <FamilyTreeClient />
                </div>
            </div>

            <div className="bg-amber-50 border-t border-amber-200 px-6 py-4 mt-8">
                <div className="max-w-7xl mx-auto text-sm text-amber-700">
                    <p>
                        💡 Tip: Each card shows family member details including birth year, status, and age. Gender is color-coded
                        (cyan for males, pink for females).
                    </p>
                </div>
            </div>
        </main>
    )
}
