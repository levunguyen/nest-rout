"use client"

import { useState } from "react"
import { MdArrowDropDown, MdAdd } from "react-icons/md"
import { IoLogoFacebook } from "react-icons/io5"
import Link from "next/link"

interface FamilyMember {
    id: number
    name: string
    relation: string
    age: number
    location: string
    healthStatus: "Good" | "Excellent" | "Fair"
    lastUpdate: string
    backgroundImage: string
    profileImage: string
}

const mockFamilyMembers: FamilyMember[] = [
    {
        id: 1,
        name: "Robert Johnson",
        relation: "Grandfather",
        age: 72,
        location: "Chicago, IL",
        healthStatus: "Good",
        lastUpdate: "Had his annual checkup yesterday. Doctor says blood pressure is improving!",
        backgroundImage: "/elderly-man-glasses.png",
        profileImage: "/elderly-man-portrait.png",
    },
    {
        id: 2,
        name: "Margaret Johnson",
        relation: "Grandmother",
        age: 70,
        location: "Chicago, IL",
        healthStatus: "Excellent",
        lastUpdate: "Started a new water aerobics class at the community center. Loving it!",
        backgroundImage: "/elderly-woman-outdoors-garden.jpg",
        profileImage: "/elderly-woman-portrait.png",
    },
    {
        id: 3,
        name: "James Anderson",
        relation: "Son",
        age: 45,
        location: "Boston, MA",
        healthStatus: "Good",
        lastUpdate: "Got promoted to Senior Manager at work! Celebrating this weekend.",
        backgroundImage: "/middle-aged-man-professional.jpg",
        profileImage: "/professional-man-portrait.png",
    },
    {
        id: 4,
        name: "Elizabeth Parker",
        relation: "Daughter-in-law",
        age: 43,
        location: "Boston, MA",
        healthStatus: "Excellent",
        lastUpdate: "Completed her first half marathon! Training for a full one next spring.",
        backgroundImage: "/woman-running-marathon-outdoors.jpg",
        profileImage: "/athletic-woman-portrait.png",
    },
    {
        id: 5,
        name: "Sarah Anderson",
        relation: "Granddaughter",
        age: 16,
        location: "Boston, MA",
        healthStatus: "Excellent",
        lastUpdate: "Made the honor roll again! Also joined the school debate team.",
        backgroundImage: "/young-girl-student-indoor.jpg",
        profileImage: "/young-girl-portrait.png",
    },
    {
        id: 6,
        name: "Michael Anderson",
        relation: "Grandson",
        age: 12,
        location: "Boston, MA",
        healthStatus: "Excellent",
        lastUpdate: "Scored two goals in his soccer game last weekend! Team made it to finals.",
        backgroundImage: "/young-boy-sports-soccer.jpg",
        profileImage: "/young-boy-portrait.png",
    },
]

const getHealthStatusColor = (status: string) => {
    switch (status) {
        case "Good":
            return "text-green-600"
        case "Excellent":
            return "text-green-600"
        case "Fair":
            return "text-yellow-600"
        default:
            return "text-gray-600"
    }
}

export default function PeoplePage() {
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 6
    const totalItems = 24
    const totalPages = Math.ceil(totalItems / itemsPerPage)

    return (
        <div className="min-h-screen bg-gray-50">




            {/* Main Content */}
            <main className="flex-1 p-8">
                {/* Page Header */}
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Family Members</h1>
                    <div className="flex items-center gap-4">
                        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 text-gray-700 text-sm font-medium">
                            All Family Members
                            <MdArrowDropDown />
                        </button>
                        <button className="flex items-center gap-2 px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 text-sm font-medium transition">
                            <MdAdd size={18} />
                            Add Family Member
                        </button>
                    </div>
                </div>

                {/* Family Members Grid */}
                <div className="grid grid-cols-3 gap-6 mb-12">
                    {mockFamilyMembers.map((member) => (
                        <div
                            key={member.id}
                            className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                        >
                            {/* Background Image Container */}
                            <div className="relative h-48 bg-gray-200 overflow-hidden">
                                <img
                                    src={member.backgroundImage || "/placeholder.svg"}
                                    alt={member.name}
                                    className="w-full h-full object-cover"
                                />
                                {/* Profile Image Overlay */}
                                <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2">
                                    <img
                                        src={member.profileImage || "/placeholder.svg"}
                                        alt={member.name}
                                        className="w-24 h-24 rounded-full border-4 border-white object-cover shadow-md"
                                    />
                                </div>
                            </div>

                            {/* Card Content */}
                            <div className="pt-16 pb-6 px-6 text-center">
                                {/* Name and Relation */}
                                <div className="mb-2">
                                    <div className="flex items-center justify-center gap-2 mb-1">
                                        <h3 className="text-lg font-bold text-gray-900">{member.name}</h3>
                                        <span className="text-xs font-semibold text-orange-500 bg-orange-50 px-2 py-1 rounded">
                                            {member.relation}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        {member.age} years • {member.location}
                                    </p>
                                </div>

                                {/* Health Status */}
                                <div className="flex items-center justify-center gap-2 mb-4 text-sm">
                                    <span className="text-red-500">❤️</span>
                                    <span className="text-gray-600">
                                        Health Status:{" "}
                                        <span className={`font-semibold ${getHealthStatusColor(member.healthStatus)}`}>
                                            {member.healthStatus}
                                        </span>
                                    </span>
                                </div>

                                {/* Last Update */}
                                <p className="text-xs text-gray-600 mb-6 leading-relaxed line-clamp-3">
                                    Last update: {member.lastUpdate}
                                </p>

                                {/* Action Buttons */}
                                <div className="flex gap-3">
                                    <button className="flex-1 px-4 py-2 border-2 border-orange-300 text-orange-500 rounded hover:bg-orange-50 text-sm font-semibold transition">
                                        Message
                                    </button>
                                    <button className="flex-1 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 text-sm font-semibold transition">
                                        View Profile
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between pt-8 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                        Showing {mockFamilyMembers.length} of {totalItems} family members
                    </p>
                    <div className="flex gap-2">
                        {Array.from({ length: totalPages }).map((_, index) => (
                            <button
                                key={index + 1}
                                onClick={() => setCurrentPage(index + 1)}
                                className={`w-9 h-9 rounded text-sm font-semibold transition ${currentPage === index + 1
                                    ? "bg-orange-500 text-white"
                                    : "bg-white border border-gray-300 text-gray-700 hover:border-orange-500"
                                    }`}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                </div>
            </main>


        </div>
    )
}
