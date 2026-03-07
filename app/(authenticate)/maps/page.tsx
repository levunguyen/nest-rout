"use client"

import { useState } from "react"
import { MapPin, Search, Users, RotateCcw } from "lucide-react"

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

    const coords = selectedCity ? getCityCoordinates(selectedCity) : { lat: 39.0997, lng: -95.6789 }

    const visibleMembers = selectedCity
        ? familyMembers.filter((m) => `${m.city}, ${m.state}` === selectedCity)
        : []

    const averageAge =
        visibleMembers.length === 0
            ? 0
            : Math.round(visibleMembers.reduce((sum, m) => sum + m.age, 0) / visibleMembers.length)

    const relationshipMap = new Map<string, number>()
    visibleMembers.forEach((m) => {
        relationshipMap.set(m.relationship, (relationshipMap.get(m.relationship) ?? 0) + 1)
    })
    const relationshipBreakdown = Array.from(relationshipMap.entries()).map(([label, count]) => ({ label, count }))

    const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${(coords.lng - 0.05).toFixed(4)}%2C${(coords.lat - 0.05).toFixed(4)}%2C${(coords.lng + 0.05).toFixed(4)}%2C${(coords.lat + 0.05).toFixed(4)}&layer=mapnik&marker=${coords.lat}%2C${coords.lng}`

    return (
        <main className="min-h-screen bg-[#F8FAF8] p-4 text-[#0F172A] md:p-6">
            <div className="mx-auto max-w-7xl space-y-5">
                <section className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm md:p-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div>
                            <span className="inline-flex items-center gap-2 rounded-full border border-[#16A34A]/30 bg-[#DCFCE7] px-3 py-1 text-xs font-medium text-[#166534]">
                                <MapPin className="h-3.5 w-3.5" />
                                Family location map
                            </span>
                            <h1 className="mt-3 text-3xl font-bold md:text-4xl">Bản đồ thành viên gia đình</h1>
                            <p className="mt-2 text-sm text-[#475569]">
                                Theo dõi vị trí thành viên theo thành phố và xem thông tin nhanh tại một màn hình.
                            </p>
                        </div>

                        <div className="flex w-full max-w-xl flex-col gap-3 sm:flex-row sm:items-end">
                            <div className="flex-1">
                                <label className="mb-2 block text-sm font-medium text-[#0F172A]">Tìm theo địa điểm</label>
                                <div className="relative">
                                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
                                    <select
                                        value={selectedCity}
                                        onChange={(e) => setSelectedCity(e.target.value)}
                                        className="w-full rounded-lg border border-[#E2E8F0] bg-white py-2.5 pl-10 pr-4 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20"
                                    >
                                        <option value="">Chọn 1 thành phố...</option>
                                        {uniqueCities.map((city) => (
                                            <option key={city} value={city}>
                                                {city}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelectedCity("")}
                                className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm font-medium text-[#0F172A] transition hover:bg-[#F8FAF8]"
                            >
                                <RotateCcw className="h-4 w-4 text-[#16A34A]" />
                                Reset
                            </button>
                        </div>
                    </div>
                </section>

                <section className="grid gap-5 lg:grid-cols-3">
                    <div className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm lg:col-span-2">
                        <div className="flex items-center justify-between border-b border-[#E2E8F0] px-4 py-3">
                            <h2 className="text-sm font-semibold text-[#0F172A]">Bản đồ khu vực</h2>
                            <p className="text-xs text-[#475569]">
                                {selectedCity ? `Đang xem: ${selectedCity}` : "Vui lòng chọn 1 thành phố"}
                            </p>
                        </div>
                        <div className="h-[64vh] min-h-[420px]">
                            <iframe
                                title="Family map"
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

                    <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
                        <div className="mb-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAF8] p-3">
                            <h2 className="text-sm font-semibold text-[#0F172A]">Thông tin thành phố</h2>
                            {selectedCity ? (
                                <>
                                    <p className="mt-1 text-xs text-[#475569]">{selectedCity}</p>
                                    <div className="mt-3 grid grid-cols-2 gap-2">
                                        <div className="rounded-lg border border-[#E2E8F0] bg-white p-2">
                                            <p className="text-[11px] text-[#475569]">Thành viên</p>
                                            <p className="text-base font-semibold text-[#16A34A]">{visibleMembers.length}</p>
                                        </div>
                                        <div className="rounded-lg border border-[#E2E8F0] bg-white p-2">
                                            <p className="text-[11px] text-[#475569]">Tuổi trung bình</p>
                                            <p className="text-base font-semibold text-[#16A34A]">{averageAge}</p>
                                        </div>
                                    </div>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {relationshipBreakdown.map((item) => (
                                            <span
                                                key={item.label}
                                                className="rounded-full border border-[#E2E8F0] bg-white px-2 py-1 text-[11px] text-[#475569]"
                                            >
                                                {item.label}: {item.count}
                                            </span>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <p className="mt-1 text-xs text-[#64748B]">
                                    Chọn một thành phố để xem danh sách và thống kê thành viên.
                                </p>
                            )}
                        </div>

                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-sm font-semibold text-[#0F172A]">Danh sách thành viên</h2>
                            <span className="inline-flex items-center gap-1 rounded-full bg-[#DCFCE7] px-2.5 py-1 text-xs font-medium text-[#166534]">
                                <Users className="h-3.5 w-3.5" />
                                {visibleMembers.length}
                            </span>
                        </div>
                        <div className="max-h-[58vh] space-y-3 overflow-auto pr-1">
                            {!selectedCity && (
                                <div className="rounded-xl border border-dashed border-[#CBD5E1] bg-[#F8FAF8] p-4 text-sm text-[#64748B]">
                                    Chọn thành phố ở bộ lọc phía trên để hiển thị danh sách thành viên.
                                </div>
                            )}
                            {selectedCity && visibleMembers.length === 0 && (
                                <div className="rounded-xl border border-dashed border-[#CBD5E1] bg-[#F8FAF8] p-4 text-sm text-[#64748B]">
                                    Không có thành viên nào trong thành phố này.
                                </div>
                            )}
                            {visibleMembers.map((member) => (
                                <article
                                    key={member.id}
                                    className="rounded-xl border border-[#E2E8F0] bg-[#F8FAF8] p-3"
                                >
                                    <p className="font-semibold text-[#0F172A]">{member.name}</p>
                                    <p className="mt-1 text-xs text-[#475569]">{member.relationship} • {member.age} tuổi</p>
                                    <div className="mt-2 inline-flex items-center gap-1 rounded-md border border-[#E2E8F0] bg-white px-2 py-1 text-xs text-[#166534]">
                                        <MapPin className="h-3.5 w-3.5 text-[#16A34A]" />
                                        {member.city}, {member.state}
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </main>
    )
}
