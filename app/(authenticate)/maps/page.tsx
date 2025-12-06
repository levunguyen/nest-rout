"use client"

import { useState } from "react"
import { MdSearch, MdTune, MdAdd, MdRemove } from "react-icons/md"

interface FamilyMember {
    id: string
    name: string
    latitude: number
    longitude: number
    city: string
    state: string
    relationship: string
}

const familyMembers: FamilyMember[] = [
    {
        id: "1",
        name: "Robert Johnson",
        latitude: 39.0997,
        longitude: -95.6789,
        city: "Kansas City",
        state: "MO",
        relationship: "Grandfather",
    },
    {
        id: "2",
        name: "Margaret Johnson",
        latitude: 35.4676,
        longitude: -97.5164,
        city: "Oklahoma City",
        state: "OK",
        relationship: "Grandmother",
    },
    {
        id: "3",
        name: "James Anderson",
        latitude: 38.2527,
        longitude: -92.2352,
        city: "Jefferson City",
        state: "MO",
        relationship: "Father",
    },
    {
        id: "4",
        name: "Elizabeth Parker",
        latitude: 38.8816,
        longitude: -96.7265,
        city: "Topeka",
        state: "KS",
        relationship: "Aunt",
    },
    {
        id: "5",
        name: "Sarah Anderson",
        latitude: 36.1627,
        longitude: -95.9978,
        city: "Tulsa",
        state: "OK",
        relationship: "Sister",
    },
    {
        id: "6",
        name: "Michael Anderson",
        latitude: 35.1495,
        longitude: -90.049,
        city: "Memphis",
        state: "TN",
        relationship: "Brother",
    },
    {
        id: "7",
        name: "Jennifer Wilson",
        latitude: 36.7783,
        longitude: -119.4179,
        city: "Hot Springs",
        state: "AR",
        relationship: "Cousin",
    },
    {
        id: "8",
        name: "David Brown",
        latitude: 34.8526,
        longitude: -92.2796,
        city: "Pine Bluff",
        state: "AR",
        relationship: "Uncle",
    },
    {
        id: "9",
        name: "Lisa Garcia",
        latitude: 35.0844,
        longitude: -106.6504,
        city: "Albuquerque",
        state: "NM",
        relationship: "Aunt",
    },
    {
        id: "10",
        name: "John Martinez",
        latitude: 33.196,
        longitude: -97.2267,
        city: "Fort Worth",
        state: "TX",
        relationship: "Cousin",
    },
]

// Convert latitude/longitude to pixel positions
const latToPixel = (lat: number, minLat: number, maxLat: number, height: number) => {
    return ((maxLat - lat) / (maxLat - minLat)) * height
}

const lonToPixel = (lon: number, minLon: number, maxLon: number, width: number) => {
    return ((lon - minLon) / (maxLon - minLon)) * width
}

export default function MapsPage() {
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null)
    const [zoom, setZoom] = useState(1)

    const filteredMembers = familyMembers.filter(
        (member) =>
            member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.state.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    // Calculate bounds
    const lats = familyMembers.map((m) => m.latitude)
    const lons = familyMembers.map((m) => m.longitude)
    const minLat = Math.min(...lats)
    const maxLat = Math.max(...lats)
    const minLon = Math.min(...lons)
    const maxLon = Math.max(...lons)

    const mapWidth = 1200
    const mapHeight = 600

    return (
        <div className="w-full h-screen flex flex-col bg-background">
            {/* Header */}
            <div className="bg-white border-b border-border p-4 shadow-sm">
                <h1 className="text-2xl font-bold text-foreground mb-4">Family Map</h1>
                <div className="flex gap-2 max-w-md">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                        <MdSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
                    </div>
                    <button className="px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors">
                        <MdTune size={20} />
                    </button>
                </div>
            </div>

            {/* Map Container */}
            <div className="flex-1 relative overflow-hidden bg-gradient-to-b from-blue-50 to-green-50">
                {/* Map Background */}
                <svg
                    className="absolute inset-0 w-full h-full"
                    viewBox={`0 0 ${mapWidth} ${mapHeight}`}
                    preserveAspectRatio="xMidYMid slice"
                >
                    {/* Add subtle grid lines */}
                    {Array.from({ length: 11 }).map((_, i) => (
                        <g key={`grid-${i}`}>
                            <line
                                x1={`${(i * mapWidth) / 10}`}
                                y1="0"
                                x2={`${(i * mapWidth) / 10}`}
                                y2={mapHeight}
                                stroke="#e5e7eb"
                                strokeWidth="1"
                            />
                            <line
                                x1="0"
                                y1={`${(i * mapHeight) / 10}`}
                                x2={mapWidth}
                                y2={`${(i * mapHeight) / 10}`}
                                stroke="#e5e7eb"
                                strokeWidth="1"
                            />
                        </g>
                    ))}
                </svg>

                {/* Family Member Markers */}
                <div className="absolute inset-0">
                    {filteredMembers.map((member) => {
                        const x = lonToPixel(member.longitude, minLon, maxLon, mapWidth)
                        const y = latToPixel(member.latitude, minLat, maxLat, mapHeight)

                        return (
                            <div
                                key={member.id}
                                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                                style={{ left: `${(x / mapWidth) * 100}%`, top: `${(y / mapHeight) * 100}%` }}
                                onClick={() => setSelectedMember(member)}
                            >
                                <div className="relative w-8 h-12 animate-bounce">
                                    <svg viewBox="0 0 24 36" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M12 0C6.47715 0 2 4.47715 2 10C2 17 12 36 12 36S22 17 22 10C22 4.47715 17.5228 0 12 0Z"
                                            fill="#EA463C"
                                        />
                                        <circle cx="12" cy="10" r="4" fill="white" />
                                    </svg>
                                </div>

                                {/* Tooltip on hover */}
                                <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-2 text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                    <p className="font-semibold text-foreground">{member.name}</p>
                                    <p className="text-muted-foreground">
                                        {member.city}, {member.state}
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Zoom Controls */}
                <div className="absolute bottom-4 right-4 flex flex-col gap-2 bg-white rounded-lg shadow-lg">
                    <button onClick={() => setZoom(Math.min(zoom + 0.5, 3))} className="p-2 hover:bg-secondary transition-colors">
                        <MdAdd size={20} />
                    </button>
                    <div className="px-3 py-1 text-sm font-semibold text-center">{zoom.toFixed(1)}x</div>
                    <button onClick={() => setZoom(Math.max(zoom - 0.5, 1))} className="p-2 hover:bg-secondary transition-colors">
                        <MdRemove size={20} />
                    </button>
                </div>

                {/* Selected Member Info */}
                {selectedMember && (
                    <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 max-w-sm z-20">
                        <h3 className="font-bold text-lg text-foreground mb-1">{selectedMember.name}</h3>
                        <p className="text-sm text-muted-foreground mb-1">{selectedMember.relationship}</p>
                        <p className="text-sm text-muted-foreground mb-3">
                            {selectedMember.city}, {selectedMember.state}
                        </p>
                        <button
                            onClick={() => setSelectedMember(null)}
                            className="w-full px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:opacity-90 transition-opacity"
                        >
                            Close
                        </button>
                    </div>
                )}

                {/* Family Members List */}
                <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-xs max-h-96 overflow-y-auto z-20">
                    <h2 className="font-bold text-foreground mb-3">Family Members ({filteredMembers.length})</h2>
                    <div className="space-y-2">
                        {filteredMembers.map((member) => (
                            <div
                                key={member.id}
                                onClick={() => setSelectedMember(member)}
                                className={`p-2 rounded cursor-pointer transition-colors ${selectedMember?.id === member.id ? "bg-accent text-accent-foreground" : "bg-secondary hover:bg-muted"
                                    }`}
                            >
                                <p className="font-semibold text-sm">{member.name}</p>
                                <p className="text-xs opacity-75">
                                    {member.city}, {member.state}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
