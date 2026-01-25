"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"

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
        latitude: 39.1,
        longitude: -95.68,
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
        latitude: 36.163,
        longitude: -95.998,
    },
]

const getUniqueCities = (members: FamilyMember[]) => {
    return Array.from(new Set(members.map((m) => `${m.city}, ${m.state}`))).sort()
}

const getCityCoordinates = (city: string) => {
    const cityMap: { [key: string]: { lat: number; lng: number } } = {
        "Kansas City, MO": { lat: 39.0997, lng: -95.6789 },
        "Jefferson City, MO": { lat: 38.2527, lng: -92.2352 },
        "Topeka, KS": { lat: 38.8816, lng: -96.7265 },
        "Tulsa, OK": { lat: 36.1627, lng: -95.9978 },
    }
    return cityMap[city] || { lat: 39.0997, lng: -95.6789 }
}

export default function MapsPage() {
    const [selectedCity, setSelectedCity] = useState("")

    const uniqueCities = getUniqueCities(familyMembers)

    const getMembersInCity = () => {
        if (!selectedCity) return []
        return familyMembers.filter((m) => `${m.city}, ${m.state}` === selectedCity)
    }

    const membersInCity = getMembersInCity()
    const coords = selectedCity ? getCityCoordinates(selectedCity) : { lat: 39.0997, lng: -95.6789 }
    const zoom = selectedCity ? 13 : 5

    const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${(coords.lng - 0.05).toFixed(4)}%2C${(coords.lat - 0.05).toFixed(4)}%2C${(coords.lng + 0.05).toFixed(4)}%2C${(coords.lat + 0.05).toFixed(4)}&layer=mapnik&marker=${coords.lat}%2C${coords.lng}`

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
            <div className="flex-1 p-4">
                <div className="w-full h-full rounded-lg overflow-hidden shadow-lg border border-border">
                    <iframe
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        scrolling="no"
                        marginHeight={0}
                        marginWidth={0}
                        src={mapUrl}
                        style={{ border: 0 }}
                    />
                </div>
            </div>
        </div>
    )
}
