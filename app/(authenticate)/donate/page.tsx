"use client"

import React from "react"

import { useState } from "react"

interface Donation {
    id: string
    donorName: string
    amount: number
    eventId: string
    date: string
    time: string
    message?: string
}

interface Event {
    id: string
    name: string
    description: string
    targetAmount: number
    date: string
}

const events: Event[] = [
    {
        id: "1",
        name: "Family Reunion 2025",
        description: "Annual family gathering and celebration",
        targetAmount: 5000,
        date: "June 15, 2025",
    },
    {
        id: "2",
        name: "Heritage Museum Donation",
        description: "Support for family history preservation",
        targetAmount: 3000,
        date: "August 20, 2025",
    },
    {
        id: "3",
        name: "Scholarship Fund",
        description: "Education support for next generation",
        targetAmount: 10000,
        date: "September 10, 2025",
    },
]

const sampleDonations: Donation[] = [
    {
        id: "1",
        donorName: "Robert Johnson",
        amount: 500,
        eventId: "1",
        date: "2025-01-20",
        time: "10:30 AM",
        message: "Happy to support the family reunion!",
    },
    {
        id: "2",
        donorName: "Margaret Johnson",
        amount: 250,
        eventId: "1",
        date: "2025-01-19",
        time: "02:15 PM",
        message: "Excited for the gathering",
    },
    {
        id: "3",
        donorName: "James Anderson",
        amount: 1000,
        eventId: "2",
        date: "2025-01-18",
        time: "11:45 AM",
    },
    {
        id: "4",
        donorName: "Elizabeth Parker",
        amount: 750,
        eventId: "2",
        date: "2025-01-17",
        time: "09:20 AM",
        message: "Preserving our heritage matters",
    },
    {
        id: "5",
        donorName: "Sarah Anderson",
        amount: 300,
        eventId: "3",
        date: "2025-01-16",
        time: "04:00 PM",
    },
    {
        id: "6",
        donorName: "Michael Anderson",
        amount: 500,
        eventId: "3",
        date: "2025-01-15",
        time: "03:30 PM",
        message: "Investing in education",
    },
]

export default function DonationPage() {
    const [selectedEvent, setSelectedEvent] = useState<string>("1")
    const [donations, setDonations] = useState<Donation[]>(sampleDonations)
    const [formData, setFormData] = useState({
        donorName: "",
        amount: "",
        message: "",
    })

    const currentEvent = events.find((e) => e.id === selectedEvent)
    const eventDonations = donations.filter((d) => d.eventId === selectedEvent)
    const totalRaised = eventDonations.reduce((sum, d) => sum + d.amount, 0)
    const percentageRaised = currentEvent ? (totalRaised / currentEvent.targetAmount) * 100 : 0

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.donorName || !formData.amount) return

        const newDonation: Donation = {
            id: String(donations.length + 1),
            donorName: formData.donorName,
            amount: parseFloat(formData.amount),
            eventId: selectedEvent,
            date: new Date().toISOString().split("T")[0],
            time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
            message: formData.message,
        }

        setDonations([newDonation, ...donations])
        setFormData({ donorName: "", amount: "", message: "" })
    }

    return (
        <div className="w-full min-h-screen bg-background">
            {/* Header */}
            <div className="bg-white border-b border-border p-6 shadow-sm">
                <h1 className="text-3xl font-bold text-foreground mb-2">Family Donation Tracker</h1>
                <p className="text-muted-foreground">Track and manage donations for family events</p>
            </div>

            <div className="max-w-7xl mx-auto p-6 space-y-8">
                {/* Event Selection */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-foreground">Select Event</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {events.map((event) => (
                            <button
                                key={event.id}
                                onClick={() => setSelectedEvent(event.id)}
                                className={`p-4 rounded-lg border-2 text-left transition-all ${selectedEvent === event.id
                                        ? "border-accent bg-secondary"
                                        : "border-border hover:border-accent"
                                    }`}
                            >
                                <p className="font-bold text-foreground">{event.name}</p>
                                <p className="text-sm text-muted-foreground">{event.date}</p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Event Stats */}
                {currentEvent && (
                    <div className="bg-white rounded-lg p-6 border border-border shadow-sm space-y-4">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-2xl font-bold text-foreground">{currentEvent.name}</h3>
                                <p className="text-muted-foreground">{currentEvent.description}</p>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-foreground">Progress</span>
                                <span className="text-accent font-bold">{Math.round(percentageRaised)}%</span>
                            </div>
                            <div className="w-full bg-border rounded-full h-3">
                                <div
                                    className="bg-accent h-3 rounded-full transition-all"
                                    style={{ width: `${Math.min(percentageRaised, 100)}%` }}
                                />
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-3 gap-4 mt-6">
                            <div className="bg-secondary rounded-lg p-4 text-center">
                                <p className="text-muted-foreground text-sm mb-1">Total Raised</p>
                                <p className="text-2xl font-bold text-accent">${totalRaised.toLocaleString()}</p>
                            </div>
                            <div className="bg-secondary rounded-lg p-4 text-center">
                                <p className="text-muted-foreground text-sm mb-1">Target</p>
                                <p className="text-2xl font-bold text-foreground">${currentEvent.targetAmount.toLocaleString()}</p>
                            </div>
                            <div className="bg-secondary rounded-lg p-4 text-center">
                                <p className="text-muted-foreground text-sm mb-1">Donors</p>
                                <p className="text-2xl font-bold text-foreground">{eventDonations.length}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Donation Form */}
                <div className="bg-white rounded-lg p-6 border border-border shadow-sm">
                    <h3 className="text-xl font-bold text-foreground mb-4">Make a Donation</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">Donor Name</label>
                            <input
                                type="text"
                                value={formData.donorName}
                                onChange={(e) => setFormData({ ...formData, donorName: e.target.value })}
                                placeholder="Enter your name"
                                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">Donation Amount ($)</label>
                                <input
                                    type="number"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                    placeholder="0.00"
                                    step="0.01"
                                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">Message (Optional)</label>
                                <input
                                    type="text"
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    placeholder="Leave a message"
                                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold py-3 px-4 rounded-lg transition-colors"
                        >
                            Submit Donation
                        </button>
                    </form>
                </div>

                {/* Donations List */}
                <div className="bg-white rounded-lg p-6 border border-border shadow-sm">
                    <h3 className="text-xl font-bold text-foreground mb-4">Donations for {currentEvent?.name}</h3>

                    {eventDonations.length === 0 ? (
                        <p className="text-muted-foreground text-center py-8">No donations yet for this event</p>
                    ) : (
                        <div className="space-y-4">
                            {eventDonations
                                .sort((a, b) => new Date(b.date + " " + b.time).getTime() - new Date(a.date + " " + a.time).getTime())
                                .map((donation) => (
                                    <div key={donation.id} className="border border-border rounded-lg p-4 hover:bg-secondary transition-colors">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <p className="font-bold text-foreground">{donation.donorName}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {donation.date} at {donation.time}
                                                </p>
                                            </div>
                                            <p className="text-xl font-bold text-accent">${donation.amount.toFixed(2)}</p>
                                        </div>
                                        {donation.message && (
                                            <p className="text-sm text-muted-foreground italic">"{donation.message}"</p>
                                        )}
                                    </div>
                                ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
