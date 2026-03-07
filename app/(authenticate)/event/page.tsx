"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { CalendarPlus, ChevronLeft, ChevronRight, Clock3, Dot, PartyPopper } from "lucide-react";

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type: "birthday" | "anniversary" | "gathering" | "other";
  time?: string;
}

interface FamilyMember {
  id: string;
  name: string;
  birthday: string;
  age: number;
  image: string;
}

const events: CalendarEvent[] = [
  { id: "1", title: "School Holidays", date: new Date(2026, 2, 2), type: "gathering", time: "3 Days" },
  { id: "2", title: "John's Birthday", date: new Date(2026, 2, 8), type: "birthday" },
  { id: "3", title: "Family Outing", date: new Date(2026, 2, 12), type: "gathering" },
  { id: "4", title: "Emma's Birthday", date: new Date(2026, 2, 7), type: "birthday" },
  { id: "5", title: "Family Dinner", date: new Date(2026, 2, 21), type: "gathering", time: "6:00 PM" },
  { id: "6", title: "House Party", date: new Date(2026, 2, 31), type: "other" },
  { id: "7", title: "Anniversary Dinner", date: new Date(2026, 2, 15), type: "anniversary", time: "7:30 PM" },
];

const familyBirthdays: FamilyMember[] = [
  { id: "1", name: "Emma Johnson", birthday: "March 5", age: 28, image: "/images/young-girl-portrait.png" },
  { id: "2", name: "Robert Anderson", birthday: "March 8", age: 72, image: "/images/grandfather.png" },
  { id: "3", name: "Michael Wilson", birthday: "April 12", age: 16, image: "/images/nephew.png" },
];

const getEventStyle = (type: CalendarEvent["type"]) => {
  switch (type) {
    case "birthday":
      return "bg-[#DCFCE7] text-[#166534]";
    case "anniversary":
      return "bg-[#FEF3C7] text-[#92400E]";
    case "gathering":
      return "bg-[#EFF6FF] text-[#1D4ED8]";
    default:
      return "bg-[#F1F5F9] text-[#334155]";
  }
};

export default function EventCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 1));
  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("month");

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
  ];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const calendarDays = useMemo(
    () => Array(firstDay).fill(null).concat(Array.from({ length: daysInMonth }, (_, i) => i + 1)),
    [daysInMonth, firstDay],
  );

  const upcomingEvents = useMemo(() => {
    return events
      .filter((event) => event.date >= new Date(2026, 2, 1))
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 5);
  }, []);

  const getEventsForDate = (day: number) =>
    events.filter((event) => event.date.getDate() === day && event.date.getMonth() === currentDate.getMonth());

  return (
    <main className="min-h-screen bg-[#F8FAF8] px-4 py-8 text-[#0F172A] md:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-bold md:text-4xl">Family Events Calendar</h1>
              <p className="mt-2 text-sm text-[#475569]">
                Theo dõi sinh nhật, kỷ niệm và các buổi họp mặt gia đình theo lịch trực quan.
              </p>
            </div>
            <button className="inline-flex items-center gap-2 rounded-lg bg-[#16A34A] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#15803D]">
              <CalendarPlus className="h-4 w-4" />
              Add Event
            </button>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            {(["month", "week", "day"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={[
                  "rounded-lg px-3 py-1.5 text-sm font-medium capitalize",
                  viewMode === mode ? "bg-[#16A34A] text-white" : "border border-[#E2E8F0] bg-white text-[#334155]",
                ].join(" ")}
              >
                {mode}
              </button>
            ))}
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-3">
          <section className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
                  className="rounded-lg border border-[#E2E8F0] p-2 hover:bg-[#F8FAF8]"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
                  className="rounded-lg border border-[#E2E8F0] p-2 hover:bg-[#F8FAF8]"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 border border-[#E2E8F0]">
              {dayNames.map((day) => (
                <div key={day} className="border-b border-[#E2E8F0] bg-[#F8FAF8] py-2 text-center text-xs font-semibold text-[#64748B]">
                  {day}
                </div>
              ))}
              {calendarDays.map((day, index) => (
                <div key={index} className={`min-h-24 border-r border-b border-[#E2E8F0] p-2 ${day ? "bg-white" : "bg-[#FAFAFA]"}`}>
                  {day ? (
                    <>
                      <p className="text-xs font-semibold text-[#334155]">{day}</p>
                      {(() => {
                        const dayEvents = getEventsForDate(day);
                        return (
                          <div className="mt-1 space-y-1">
                            {dayEvents.slice(0, 2).map((event) => (
                              <div key={event.id} className={`truncate rounded px-1.5 py-1 text-[11px] font-semibold ${getEventStyle(event.type)}`}>
                                {event.title}
                              </div>
                            ))}
                            {dayEvents.length > 2 ? (
                              <p className="text-[10px] font-medium text-[#64748B]">+{dayEvents.length - 2} more</p>
                            ) : null}
                          </div>
                        );
                      })()}
                    </>
                  ) : null}
                </div>
              ))}
            </div>
          </section>

          <aside className="space-y-4">
            <section className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
              <h3 className="inline-flex items-center gap-2 text-lg font-semibold">
                <PartyPopper className="h-4 w-4 text-[#16A34A]" />
                Upcoming Events
              </h3>
              <div className="mt-3 space-y-2">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="rounded-lg border border-[#E2E8F0] bg-[#F8FAF8] p-3">
                    <p className="font-medium text-[#0F172A]">{event.title}</p>
                    <p className="mt-1 text-xs text-[#64748B]">{event.date.toDateString()}</p>
                    {event.time ? (
                      <p className="mt-1 inline-flex items-center gap-1 text-xs text-[#475569]">
                        <Clock3 className="h-3.5 w-3.5 text-[#16A34A]" />
                        {event.time}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
              <h3 className="text-lg font-semibold text-[#0F172A]">Family Birthdays</h3>
              <div className="mt-3 space-y-2">
                {familyBirthdays.map((member) => (
                  <div key={member.id} className="flex items-center gap-3 rounded-lg border border-[#E2E8F0] bg-[#F8FAF8] p-2.5">
                    <div className="relative h-10 w-10 overflow-hidden rounded-full border border-[#E2E8F0]">
                      <Image src={member.image} alt={member.name} fill className="object-cover" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#0F172A]">{member.name}</p>
                      <p className="text-xs text-[#64748B]">{member.birthday}</p>
                      <p className="inline-flex items-center gap-1 text-xs text-[#475569]">
                        <Dot className="h-4 w-4 text-[#16A34A]" />
                        Turning {member.age}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
