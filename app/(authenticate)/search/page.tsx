"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { BiLeaf } from "react-icons/bi"
import { MdSearch, MdClear } from "react-icons/md"

export default function SearchPage() {
    const [searchType, setSearchType] = useState<"basic" | "advanced">("basic")
    const [basicQuery, setBasicQuery] = useState("")
    const [searchResults, setSearchResults] = useState<any[]>([])
    const [showAdvanced, setShowAdvanced] = useState(false)

    // Advanced search filters
    const [advancedFilters, setAdvancedFilters] = useState({
        firstName: "",
        lastName: "",
        birthYear: "",
        birthYearEnd: "",
        deathYear: "",
        deathYearEnd: "",
        relation: "",
        location: "",
    })

    const mockFamilyData = [
        {
            id: 1,
            firstName: "John",
            lastName: "Smith",
            birthYear: 1950,
            deathYear: 2020,
            relation: "Grandfather",
            location: "New York",
        },
        {
            id: 2,
            firstName: "Mary",
            lastName: "Smith",
            birthYear: 1952,
            deathYear: null,
            relation: "Grandmother",
            location: "New York",
        },
        {
            id: 3,
            firstName: "James",
            lastName: "Smith",
            birthYear: 1975,
            deathYear: null,
            relation: "Father",
            location: "California",
        },
        {
            id: 4,
            firstName: "Sarah",
            lastName: "Smith",
            birthYear: 1978,
            deathYear: null,
            relation: "Mother",
            location: "California",
        },
        {
            id: 5,
            firstName: "Michael",
            lastName: "Smith",
            birthYear: 2000,
            deathYear: null,
            relation: "Brother",
            location: "Texas",
        },
        {
            id: 6,
            firstName: "Emily",
            lastName: "Johnson",
            birthYear: 1980,
            deathYear: null,
            relation: "Cousin",
            location: "Florida",
        },
    ]

    // Basic search handler
    const handleBasicSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (!basicQuery.trim()) {
            setSearchResults([])
            return
        }

        const query = basicQuery.toLowerCase()
        const results = mockFamilyData.filter(
            (person) =>
                person.firstName.toLowerCase().includes(query) ||
                person.lastName.toLowerCase().includes(query) ||
                person.relation.toLowerCase().includes(query),
        )
        setSearchResults(results)
    }

    // Advanced search handler
    const handleAdvancedSearch = (e: React.FormEvent) => {
        e.preventDefault()
        let results = mockFamilyData

        if (advancedFilters.firstName) {
            results = results.filter((p) => p.firstName.toLowerCase().includes(advancedFilters.firstName.toLowerCase()))
        }
        if (advancedFilters.lastName) {
            results = results.filter((p) => p.lastName.toLowerCase().includes(advancedFilters.lastName.toLowerCase()))
        }
        if (advancedFilters.birthYear) {
            results = results.filter((p) => p.birthYear >= Number.parseInt(advancedFilters.birthYear))
        }
        if (advancedFilters.birthYearEnd) {
            results = results.filter((p) => p.birthYear <= Number.parseInt(advancedFilters.birthYearEnd))
        }
        if (advancedFilters.deathYear) {
            results = results.filter((p) => p.deathYear && p.deathYear >= Number.parseInt(advancedFilters.deathYear))
        }
        if (advancedFilters.deathYearEnd) {
            results = results.filter((p) => p.deathYear && p.deathYear <= Number.parseInt(advancedFilters.deathYearEnd))
        }
        if (advancedFilters.relation) {
            results = results.filter((p) => p.relation.toLowerCase().includes(advancedFilters.relation.toLowerCase()))
        }
        if (advancedFilters.location) {
            results = results.filter((p) => p.location.toLowerCase().includes(advancedFilters.location.toLowerCase()))
        }

        setSearchResults(results)
    }

    const clearSearch = () => {
        setBasicQuery("")
        setAdvancedFilters({
            firstName: "",
            lastName: "",
            birthYear: "",
            birthYearEnd: "",
            deathYear: "",
            deathYearEnd: "",
            relation: "",
            location: "",
        })
        setSearchResults([])
    }

    return (
        <main className="min-h-screen bg-gradient-to-b from-amber-50 to-white">


            {/* Search Content */}
            <div className="max-w-6xl mx-auto px-6 md:px-12 py-12">
                {/* Search Type Tabs */}
                <div className="flex gap-4 mb-8 border-b border-amber-200">
                    <button
                        onClick={() => setSearchType("basic")}
                        className={`pb-4 px-4 font-medium transition ${searchType === "basic"
                            ? "border-b-2 border-amber-700 text-amber-700"
                            : "text-amber-600 hover:text-amber-700"
                            }`}
                    >
                        Basic Search
                    </button>
                    <button
                        onClick={() => setSearchType("advanced")}
                        className={`pb-4 px-4 font-medium transition ${searchType === "advanced"
                            ? "border-b-2 border-amber-700 text-amber-700"
                            : "text-amber-600 hover:text-amber-700"
                            }`}
                    >
                        Advanced Search
                    </button>
                </div>

                {/* Basic Search Form */}
                {searchType === "basic" && (
                    <form onSubmit={handleBasicSearch} className="mb-8">
                        <div className="flex gap-2 mb-4">
                            <div className="flex-1 relative">
                                <MdSearch className="absolute left-3 top-3 text-amber-600" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search by name, relation, or location..."
                                    value={basicQuery}
                                    onChange={(e) => setBasicQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700 focus:border-transparent"
                                />
                            </div>
                            <button
                                type="submit"
                                className="bg-amber-700 text-white px-8 py-3 rounded-lg hover:bg-amber-800 transition font-medium"
                            >
                                Search
                            </button>
                            {basicQuery && (
                                <button
                                    type="button"
                                    onClick={clearSearch}
                                    className="bg-amber-100 text-amber-700 px-4 py-3 rounded-lg hover:bg-amber-200 transition"
                                >
                                    <MdClear size={20} />
                                </button>
                            )}
                        </div>
                    </form>
                )}

                {/* Advanced Search Form */}
                {searchType === "advanced" && (
                    <form onSubmit={handleAdvancedSearch} className="mb-8 bg-amber-50 p-6 rounded-lg border border-amber-200">
                        <h3 className="text-xl font-serif font-bold text-amber-900 mb-6">Filter Results</h3>

                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                            {/* Name Fields */}
                            <div>
                                <label className="block text-sm font-medium text-amber-900 mb-2">First Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g., John"
                                    value={advancedFilters.firstName}
                                    onChange={(e) => setAdvancedFilters({ ...advancedFilters, firstName: e.target.value })}
                                    className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-amber-900 mb-2">Last Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g., Smith"
                                    value={advancedFilters.lastName}
                                    onChange={(e) => setAdvancedFilters({ ...advancedFilters, lastName: e.target.value })}
                                    className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700"
                                />
                            </div>

                            {/* Birth Year Range */}
                            <div>
                                <label className="block text-sm font-medium text-amber-900 mb-2">Birth Year From</label>
                                <input
                                    type="number"
                                    placeholder="e.g., 1950"
                                    value={advancedFilters.birthYear}
                                    onChange={(e) => setAdvancedFilters({ ...advancedFilters, birthYear: e.target.value })}
                                    className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-amber-900 mb-2">Birth Year To</label>
                                <input
                                    type="number"
                                    placeholder="e.g., 1980"
                                    value={advancedFilters.birthYearEnd}
                                    onChange={(e) => setAdvancedFilters({ ...advancedFilters, birthYearEnd: e.target.value })}
                                    className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700"
                                />
                            </div>

                            {/* Death Year Range */}
                            <div>
                                <label className="block text-sm font-medium text-amber-900 mb-2">Death Year From</label>
                                <input
                                    type="number"
                                    placeholder="Optional"
                                    value={advancedFilters.deathYear}
                                    onChange={(e) => setAdvancedFilters({ ...advancedFilters, deathYear: e.target.value })}
                                    className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-amber-900 mb-2">Death Year To</label>
                                <input
                                    type="number"
                                    placeholder="Optional"
                                    value={advancedFilters.deathYearEnd}
                                    onChange={(e) => setAdvancedFilters({ ...advancedFilters, deathYearEnd: e.target.value })}
                                    className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700"
                                />
                            </div>

                            {/* Relation and Location */}
                            <div>
                                <label className="block text-sm font-medium text-amber-900 mb-2">Relation</label>
                                <input
                                    type="text"
                                    placeholder="e.g., Grandfather"
                                    value={advancedFilters.relation}
                                    onChange={(e) => setAdvancedFilters({ ...advancedFilters, relation: e.target.value })}
                                    className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-amber-900 mb-2">Location</label>
                                <input
                                    type="text"
                                    placeholder="e.g., New York"
                                    value={advancedFilters.location}
                                    onChange={(e) => setAdvancedFilters({ ...advancedFilters, location: e.target.value })}
                                    className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="submit"
                                className="bg-amber-700 text-white px-8 py-3 rounded-lg hover:bg-amber-800 transition font-medium"
                            >
                                Search
                            </button>
                            <button
                                type="button"
                                onClick={clearSearch}
                                className="bg-white border border-amber-300 text-amber-700 px-8 py-3 rounded-lg hover:bg-amber-50 transition font-medium"
                            >
                                Clear Filters
                            </button>
                        </div>
                    </form>
                )}

                {/* Search Results */}
                <div>
                    {searchResults.length > 0 && (
                        <div className="mb-6">
                            <h2 className="text-2xl font-serif font-bold text-amber-900 mb-4">
                                Results ({searchResults.length} found)
                            </h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                {searchResults.map((person) => (
                                    <div
                                        key={person.id}
                                        className="bg-white border border-amber-200 rounded-lg p-6 hover:shadow-lg transition"
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h3 className="text-xl font-serif font-bold text-amber-900">
                                                    {person.firstName} {person.lastName}
                                                </h3>
                                                <p className="text-amber-700 font-medium">{person.relation}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-2 text-sm text-amber-800">
                                            <p>
                                                <span className="font-semibold">Born:</span> {person.birthYear}
                                            </p>
                                            {person.deathYear && (
                                                <p>
                                                    <span className="font-semibold">Died:</span> {person.deathYear}
                                                </p>
                                            )}
                                            <p>
                                                <span className="font-semibold">Location:</span> {person.location}
                                            </p>
                                        </div>
                                        <button className="mt-4 w-full bg-amber-700 text-white py-2 rounded-lg hover:bg-amber-800 transition font-medium">
                                            View Profile
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {basicQuery && searchResults.length === 0 && (
                        <div className="text-center py-12 bg-amber-50 rounded-lg border border-amber-200">
                            <p className="text-amber-800 text-lg mb-4">No results found for "{basicQuery}"</p>
                            <p className="text-amber-700">Try a different search term or use advanced search with filters</p>
                        </div>
                    )}

                    {Object.values(advancedFilters).some((v) => v) && searchResults.length === 0 && searchType === "advanced" && (
                        <div className="text-center py-12 bg-amber-50 rounded-lg border border-amber-200">
                            <p className="text-amber-800 text-lg mb-4">No family members match your filters</p>
                            <p className="text-amber-700">Try adjusting your search criteria</p>
                        </div>
                    )}

                    {!basicQuery && !Object.values(advancedFilters).some((v) => v) && (
                        <div className="text-center py-12 bg-amber-50 rounded-lg border border-amber-200">
                            <MdSearch className="w-12 h-12 text-amber-400 mx-auto mb-4" />
                            <p className="text-amber-800 text-lg">
                                {searchType === "basic"
                                    ? "Enter a search term to find family members"
                                    : "Apply filters to search your family tree"}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    )
}
