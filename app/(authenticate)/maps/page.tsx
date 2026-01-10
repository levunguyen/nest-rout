"use client"

import { useState } from "react"

interface FamilyMember {
    id: string
    name: string
    city: string
    state: string
    relationship: string
    age: number
    latitude: number
    longitude: number
}

const familyMembers: FamilyMember[] = [
    {
        id: "1",
        name: "Robert Johnson",
        city: "Kansas City",
        state: "MO",
        relationship: "Grandfather",
        age: 85,
        latitude: 39.0997,
        longitude: -95.6789,
    },
    {
        id: "2",
        name: "Margaret Johnson",
        city: "Kansas City",
        state: "MO",
        relationship: "Grandmother",
        age: 82,
        latitude: 39.0997,
        longitude: -95.6789,
    },
    {
        id: "3",
        name: "James Anderson",
        city: "Jefferson City",
        state: "MO",
        relationship: "Father",
        age: 58,
        latitude: 38.2527,
        longitude: -92.2352,
    },
    {
        id: "4",
        name: "Elizabeth Parker",
        city: "Topeka",
        state: "KS",
        relationship: "Aunt",
        age: 56,
        latitude: 38.8816,
        longitude: -96.7265,
    },
    {
        id: "5",
        name: "Sarah Anderson",
        city: "Tulsa",
        state: "OK",
        relationship: "Sister",
        age: 35,
        latitude: 36.1627,
        longitude: -95.9978,
    },
    {
        id: "6",
        name: "Michael Anderson",
        city: "Tulsa",
        state: "OK",
        relationship: "Brother",
        age: 32,
        latitude: 36.1627,
        longitude: -95.9978,
    },
]

const getUniqueCities = (members: FamilyMember[]) => {
    return Array.from(new Set(members.map((m) => `${m.city}, ${m.state}`))).sort()
}

export default function MapsPage() {
    const [selectedCity, setSelectedCity] = useState("")

    const getMapCenter = () => {
        if (!selectedCity) {
            return { lat: 39.0997, lng: -95.6789, zoom: 4 }
        }

        const locationMembers = familyMembers.filter((m) => `${m.city}, ${m.state}` === selectedCity)
        if (locationMembers.length === 0) {
            return { lat: 39.0997, lng: -95.6789, zoom: 4 }
        }

        const avgLat = locationMembers.reduce((sum, m) => sum + m.latitude, 0) / locationMembers.length
        const avgLng = locationMembers.reduce((sum, m) => sum + m.longitude, 0) / locationMembers.length
        return { lat: avgLat, lng: avgLng, zoom: 12 }
    }

    const mapCenter = getMapCenter()
    const uniqueCities = getUniqueCities(familyMembers)

    const getMembersInCity = () => {
        if (!selectedCity) return []
        return familyMembers.filter((m) => `${m.city}, ${m.state}` === selectedCity)
    }

    const membersInCity = getMembersInCity()

    return (
        <div className="w-full h-screen flex flex-col bg-background">
            {/* Header */}
            <div className="bg-white border-b border-border p-6 shadow-sm z-10">
                <h1 className="text-3xl font-bold text-foreground mb-4">Family Map</h1>

                {/* Search by Location */}
                <div className="flex gap-3 items-end max-w-md">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-foreground mb-2">Search by Location</label>
                        <select
                            value={selectedCity}
                            onChange={(e) => setSelectedCity(e.target.value)}
                            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent bg-white"
                        >
                            <option value="">Select a location...</option>
                            {uniqueCities.map((city) => (
                                <option key={city} value={city}>
                                    {city}
                                </option>
                            ))}
                        </select>
                    </div>
                    {selectedCity && (
                        <button
                            onClick={() => setSelectedCity("")}
                            className="px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors font-medium"
                        >
                            Reset
                        </button>
                    )}
                </div>
            </div>

            {/* Map Container */}
            <div className="flex-1 flex gap-4 p-4">
                {/* Google Maps Embed */}
                <div className="flex-1 rounded-lg overflow-hidden shadow-lg border border-border">
                    <iframe
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        loading="lazy"
                        allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                        src={`https://www.google.com/maps/embed/v1/view?key=AIzaSyBQqqOaazW6dQqHa1jTCGzzMKVZG_OqFdI&center=${mapCenter.lat},${mapCenter.lng}&zoom=${mapCenter.zoom}`}
                    ></iframe>
                </div>

                {/* Members List Sidebar */}
                {selectedCity && (
                    <div className="w-80 bg-white rounded-lg shadow-lg border border-border p-4 flex flex-col">
                        <h2 className="text-lg font-bold text-foreground mb-1">Members in {selectedCity}</h2>
                        <p className="text-sm text-muted-foreground mb-4">
                            Showing {membersInCity.length} family member{membersInCity.length !== 1 ? "s" : ""}
                        </p>

                        <div className="flex-1 overflow-y-auto space-y-3">
                            {membersInCity.map((member) => (
                                <div
                                    key={member.id}
                                    className="p-3 bg-secondary rounded-lg border border-border hover:bg-muted transition-colors"
                                >
                                    <p className="font-semibold text-foreground text-sm">{member.name}</p>
                                    <p className="text-xs text-accent font-medium mb-2">{member.relationship}</p>
                                    <div className="space-y-1 text-xs text-muted-foreground">
                                        <p>
                                            📍 {member.city}, {member.state}
                                        </p>
                                        <p>👤 {member.age} years old</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
