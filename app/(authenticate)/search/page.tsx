"use client";

import { useState } from "react";
import {
    MdSearch,
    MdPerson,
    MdLocationOn,
    MdTune,
} from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";

/* ================= TYPES ================= */
type Person = {
    id: number;
    firstName: string;
    lastName: string;
    relation: string;
    birthYear: number;
    deathYear?: number;
    location: string;
};


type SearchMode = "name" | "location";

/* ================= MOCK DATA ================= */
const DATA: Person[] = [
    {
        id: 1,
        firstName: "Nguyen",
        lastName: "Van A",
        relation: "Grandfather",
        birthYear: 1930,
        deathYear: 1995,
        location: "Hue",
    },
    {
        id: 2,
        firstName: "Nguyen",
        lastName: "Thi B",
        relation: "Mother",
        birthYear: 1965,
        location: "Da Nang",
        father: "Nguyen Van A",
        mother: "Tran Thi C",
    },
    {
        id: 3,
        firstName: "Nguyen",
        lastName: "Van C",
        relation: "Son",
        birthYear: 1995,
        location: "Ho Chi Minh City",
        father: "Nguyen Van D",
        mother: "Nguyen Thi B",
    },
];


/* ================= COMPONENT ================= */
export default function FamilyTreeSearch() {
    /* ---------- BASIC ---------- */
    const [query, setQuery] = useState("");
    const [mode, setMode] = useState<SearchMode>("name");

    /* ---------- ADVANCED ---------- */
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [filters, setFilters] = useState({
        relation: "",
        birthFrom: "",
        birthTo: "",
    });

    const [results, setResults] = useState<Person[]>(DATA);

    /* ================= SEARCH LOGIC ================= */
    const handleSearch = () => {
        let filtered = [...DATA];
        const q = query.trim().toLowerCase();

        // Basic
        if (q) {
            filtered = filtered.filter((p) =>
                mode === "name"
                    ? `${p.firstName} ${p.lastName}`.toLowerCase().includes(q)
                    : p.location.toLowerCase().includes(q)
            );
        }

        // Advanced
        if (filters.relation) {
            filtered = filtered.filter((p) =>
                p.relation.toLowerCase().includes(filters.relation.toLowerCase())
            );
        }

        if (filters.birthFrom) {
            filtered = filtered.filter(
                (p) => p.birthYear >= Number(filters.birthFrom)
            );
        }

        if (filters.birthTo) {
            filtered = filtered.filter(
                (p) => p.birthYear <= Number(filters.birthTo)
            );
        }

        setResults(filtered);
    };

    const resetAdvanced = () => {
        setFilters({ relation: "", birthFrom: "", birthTo: "" });
    };

    /* ================= UI ================= */
    return (
        <div className="min-h-screen bg-neutral-100 px-4 py-14">
            {/* ================= SEARCH BOX ================= */}
            <div className="bg-white max-w-4xl mx-auto rounded-3xl shadow-xl px-8 py-10 mb-10">

                {/* BASIC SEARCH */}
                <div className="flex items-center gap-2 bg-neutral-50 border rounded-2xl p-2">
                    <div className="relative flex-1">
                        <MdSearch className="absolute left-4 top-3.5 text-neutral-400" />
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            placeholder={
                                mode === "name"
                                    ? "Search by name…"
                                    : "Search by location…"
                            }
                            className="w-full pl-12 pr-4 py-3 bg-transparent outline-none"
                        />
                    </div>

                    {/* MODE */}
                    <div className="flex bg-white rounded-xl border p-1">
                        <button
                            onClick={() => setMode("name")}
                            className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-1
                ${mode === "name" ? "bg-neutral-900 text-white" : ""}
              `}
                        >
                            <MdPerson /> Name
                        </button>
                        <button
                            onClick={() => setMode("location")}
                            className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-1
                ${mode === "location" ? "bg-neutral-900 text-white" : ""}
              `}
                        >
                            <MdLocationOn /> Location
                        </button>
                    </div>

                    <button
                        onClick={handleSearch}
                        className="px-6 py-3 rounded-xl bg-amber-600 text-white font-medium"
                    >
                        Search
                    </button>
                </div>

                {/* ADVANCED TOGGLE */}
                <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="mt-4 flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900"
                >
                    <MdTune />
                    Advanced filters
                </button>

                {/* ADVANCED PANEL */}
                <AnimatePresence>
                    {showAdvanced && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-6 bg-neutral-50 rounded-2xl p-6 space-y-4"
                        >
                            <div className="grid md:grid-cols-3 gap-4">
                                <input
                                    placeholder="Relation (Father, Mother…)"
                                    value={filters.relation}
                                    onChange={(e) =>
                                        setFilters({ ...filters, relation: e.target.value })
                                    }
                                    className="px-4 py-2 rounded-xl border"
                                />
                                <input
                                    type="number"
                                    placeholder="Birth year from"
                                    value={filters.birthFrom}
                                    onChange={(e) =>
                                        setFilters({ ...filters, birthFrom: e.target.value })
                                    }
                                    className="px-4 py-2 rounded-xl border"
                                />
                                <input
                                    type="number"
                                    placeholder="Birth year to"
                                    value={filters.birthTo}
                                    onChange={(e) =>
                                        setFilters({ ...filters, birthTo: e.target.value })
                                    }
                                    className="px-4 py-2 rounded-xl border"
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={handleSearch}
                                    className="px-6 py-2 rounded-xl bg-neutral-900 text-white"
                                >
                                    Apply filters
                                </button>
                                <button
                                    onClick={resetAdvanced}
                                    className="px-6 py-2 rounded-xl border"
                                >
                                    Reset
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* ================= RESULTS ================= */}
            {/* ================= RESULTS TABLE ================= */}
            <div className="max-w-6xl mx-auto mt-10">
                {results.length > 0 ? (
                    <div className="overflow-x-auto bg-white rounded-2xl shadow">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-neutral-100 text-sm text-neutral-700">
                                    <th className="px-4 py-3 text-left">Name</th>
                                    <th className="px-4 py-3 text-left">Relation</th>
                                    <th className="px-4 py-3 text-left">Father</th>
                                    <th className="px-4 py-3 text-left">Mother</th>
                                    <th className="px-4 py-3 text-left">Birth – Death</th>
                                    <th className="px-4 py-3 text-left">Location</th>
                                    <th className="px-4 py-3 text-center">Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {results.map((p) => (
                                    <tr
                                        key={p.id}
                                        className="border-t hover:bg-amber-50 transition text-sm"
                                    >
                                        <td className="px-4 py-3 font-medium">
                                            {p.firstName} {p.lastName}
                                        </td>

                                        <td className="px-4 py-3 text-neutral-600">
                                            {p.relation}
                                        </td>

                                        <td className="px-4 py-3">
                                            {p.father || <span className="text-neutral-400">—</span>}
                                        </td>

                                        <td className="px-4 py-3">
                                            {p.mother || <span className="text-neutral-400">—</span>}
                                        </td>

                                        <td className="px-4 py-3">
                                            {p.birthYear}
                                            {p.deathYear ? ` – ${p.deathYear}` : ""}
                                        </td>

                                        <td className="px-4 py-3">
                                            {p.location}
                                        </td>

                                        <td className="px-4 py-3 text-center">
                                            <button className="px-3 py-1 rounded-lg bg-neutral-900 text-white text-xs hover:bg-neutral-800">
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center text-neutral-500 mt-16">
                        No results found
                    </div>
                )}
            </div>

        </div>
    );
}
