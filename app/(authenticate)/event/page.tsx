"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { BiSolidCircle } from "react-icons/bi"
import { MdAdd } from "react-icons/md"

interface CalendarEvent {
    id: string
    title: string
    date: Date
    type: "birthday" | "anniversary" | "gathering" | "other"
    time?: string
    description?: string
}

interface FamilyMember {
    id: string
    name: string
    birthday: string
    age: number
    image: string
}

export default function EventCalendarPage() {
    const [currentDate, setCurrentDate] = useState(new Date(2023, 9, 1))
    const [viewMode, setViewMode] = useState<"month" | "week" | "day">("month")

    const events: CalendarEvent[] = [
        {
            id: "1",
            title: "School Holidays",
            date: new Date(2023, 9, 2),
            type: "gathering",
            time: "3 Days",
        },
        {
            id: "2",
            title: "John's Birthday",
            date: new Date(2023, 9, 8),
            type: "birthday",
        },
        {
            id: "3",
            title: "Family Outing",
            date: new Date(2023, 9, 12),
            type: "gathering",
        },
        {
            id: "4",
            title: "Emma's Birthday",
            date: new Date(2023, 9, 7),
            type: "birthday",
        },
        {
            id: "5",
            title: "Family Dinner",
            date: new Date(2023, 9, 21),
            type: "gathering",
            time: "6:00 PM",
        },
        {
            id: "6",
            title: "House Party",
            date: new Date(2023, 9, 31),
            type: "other",
        },
    ]

    const familyBirthdays: FamilyMember[] = [
        {
            id: "1",
            name: "Emma Johnson",
            birthday: "October 5",
            age: 28,
            image: "/images/attachments-gen-images-public-elderly-man-glasses.png",
        },
        {
            id: "2",
            name: "Robert Anderson",
            birthday: "October 8",
            age: 72,
            image: "/images/attachments-gen-images-public-elderly-man-portrait.png",
        },
        {
            id: "3",
            name: "Michael Wilson",
            birthday: "November 12",
            age: 16,
            image: "/images/attachments-gen-images-public-middle-aged-man-professional.jpg",
        },
    ]

    const upcomingEvents: CalendarEvent[] = [
        {
            id: "1",
            title: "Emma's Birthday",
            date: new Date(2023, 9, 5),
            type: "birthday",
            time: "October 5, 2023",
        },
        {
            id: "2",
            title: "John & Mary Anniversary",
            date: new Date(2023, 9, 15),
            type: "anniversary",
            time: "October 15, 2023",
        },
        {
            id: "3",
            title: "Family Dinner",
            date: new Date(2023, 9, 21),
            type: "gathering",
            time: "October 21, 2023 - 6:00 PM",
        },
    ]

    const eventReminders = [
        {
            id: "1",
            title: "Buy gift for Emma",
            due: "Due in 3 days",
            type: "birthday",
        },
        {
            id: "2",
            title: "Share anniversary photos",
            due: "Due in 7 days",
            type: "anniversary",
        },
        {
            id: "3",
            title: "Prepare food for dinner",
            due: "Due in 10 days",
            type: "gathering",
        },
    ]

    const getEventColor = (type: string) => {
        switch (type) {
            case "birthday":
                return "bg-orange-500"
            case "anniversary":
                return "bg-green-500"
            case "gathering":
                return "bg-blue-500"
            case "other":
                return "bg-purple-500"
            default:
                return "bg-gray-500"
        }
    }

    const getEventDotColor = (type: string) => {
        switch (type) {
            case "birthday":
                return "text-orange-500"
            case "anniversary":
                return "text-green-500"
            case "gathering":
                return "text-blue-500"
            case "other":
                return "text-purple-500"
            default:
                return "text-gray-500"
        }
    }

    const getDaysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
    }

    const getFirstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
    }

    const previousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
    }

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
    }

    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ]
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const calendarDays = Array(firstDay)
        .fill(null)
        .concat(Array.from({ length: daysInMonth }, (_, i) => i + 1))

    const getEventsForDate = (day: number) => {
        return events.filter((e) => e.date.getDate() === day && e.date.getMonth() === currentDate.getMonth())
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900">Family Events Calendar</h1>
                    <button className="bg-orange-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600 flex items-center gap-2">
                        <MdAdd className="w-5 h-5" />
                        Add Event
                    </button>
                </div>

                {/* View Mode Tabs */}
                <div className="max-w-7xl mx-auto px-6 pb-4 flex gap-4">
                    {["Month", "Week", "Day"].map((mode) => (
                        <button
                            key={mode}
                            onClick={() => setViewMode(mode.toLowerCase() as typeof viewMode)}
                            className={`px-4 py-2 font-medium ${viewMode === mode.toLowerCase()
                                    ? "text-orange-500 border-b-2 border-orange-500"
                                    : "text-gray-600 hover:text-gray-900"
                                }`}
                        >
                            {mode}
                        </button>
                    ))}
                </div>

                {/* Event Type Legend */}
                <div className="max-w-7xl mx-auto px-6 pb-4 flex gap-6">
                    <div className="flex items-center gap-2">
                        <BiSolidCircle className="text-orange-500 w-3 h-3" />
                        <span className="text-sm text-gray-600">Birthdays</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <BiSolidCircle className="text-green-500 w-3 h-3" />
                        <span className="text-sm text-gray-600">Anniversaries</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <BiSolidCircle className="text-blue-500 w-3 h-3" />
                        <span className="text-sm text-gray-600">Family Gatherings</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <BiSolidCircle className="text-purple-500 w-3 h-3" />
                        <span className="text-sm text-gray-600">Other Events</span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Calendar */}
                    <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900">
                                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                            </h2>
                            <div className="flex gap-2">
                                <button onClick={previousMonth} className="p-2 hover:bg-gray-100 rounded-lg">
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-lg">
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Day Headers */}
                        <div className="grid grid-cols-7 gap-0 mb-2 border-b border-gray-200">
                            {dayNames.map((day) => (
                                <div key={day} className="text-center py-2 text-sm font-semibold text-gray-600">
                                    {day.slice(0, 3)}
                                </div>
                            ))}
                        </div>

                        {/* Calendar Grid */}
                        <div className="grid grid-cols-7 gap-0 border border-gray-200">
                            {calendarDays.map((day, index) => (
                                <div
                                    key={index}
                                    className={`border-r border-b border-gray-200 p-2 min-h-24 ${day === null ? "bg-gray-50" : "bg-white hover:bg-gray-50"
                                        }`}
                                >
                                    {day && (
                                        <>
                                            <div className="font-semibold text-gray-900 mb-1">{day}</div>
                                            <div className="space-y-1">
                                                {getEventsForDate(day).map((event) => (
                                                    <div
                                                        key={event.id}
                                                        className={`${getEventColor(event.type)} text-white text-xs p-1 rounded truncate cursor-pointer hover:opacity-90`}
                                                    >
                                                        {event.title}
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Upcoming Events */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Upcoming Events</h3>
                            <div className="space-y-3">
                                {upcomingEvents.map((event) => (
                                    <div key={event.id} className="flex gap-3">
                                        <BiSolidCircle className={`w-4 h-4 flex-shrink-0 mt-1 ${getEventDotColor(event.type)}`} />
                                        <div>
                                            <p className="font-medium text-gray-900">{event.title}</p>
                                            <p className="text-sm text-gray-600">{event.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Event Reminders */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Event Reminders</h3>
                            <div className="space-y-3">
                                {eventReminders.map((reminder) => (
                                    <div key={reminder.id} className="bg-orange-50 p-3 rounded-lg">
                                        <p className="font-medium text-gray-900 text-sm">{reminder.title}</p>
                                        <p className="text-xs text-gray-600">{reminder.due}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Family Birthdays */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Family Birthdays</h3>
                            <div className="space-y-3">
                                {familyBirthdays.map((member) => (
                                    <div key={member.id} className="flex items-center gap-3">
                                        <img
                                            src={member.image || "/placeholder.svg"}
                                            alt={member.name}
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                        <div>
                                            <p className="font-medium text-gray-900 text-sm">{member.name}</p>
                                            <p className="text-xs text-gray-600">{member.birthday}</p>
                                            <p className="text-xs text-gray-500">Turning {member.age}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
