"use client";

import { useMemo, useState, useEffect } from "react";
import { CalendarPlus, ChevronLeft, ChevronRight, Clock3, Dot, PartyPopper, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

type EventType = "BIRTHDAY" | "ANNIVERSARY" | "GATHERING" | "OTHER";

interface CalendarEvent {
  id: string;
  title: string;
  startsAt: string;
  type: EventType;
  location?: string | null;
  description?: string | null;
}

const eventTypeOptions: { value: EventType; label: string }[] = [
  { value: "BIRTHDAY", label: "Sinh nhật" },
  { value: "ANNIVERSARY", label: "Kỷ niệm" },
  { value: "GATHERING", label: "Họp mặt" },
  { value: "OTHER", label: "Khác" },
];

const getEventStyle = (type: EventType) => {
  switch (type) {
    case "BIRTHDAY":
      return "bg-[#DCFCE7] text-[#166534]";
    case "ANNIVERSARY":
      return "bg-[#FEF3C7] text-[#92400E]";
    case "GATHERING":
      return "bg-[#EFF6FF] text-[#1D4ED8]";
    default:
      return "bg-[#F1F5F9] text-[#334155]";
  }
};

const formatDateInput = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatTimeInput = (date: Date) => {
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");
  return `${hour}:${minute}`;
};

const createDefaultEventForm = () => ({
  title: "",
  date: formatDateInput(new Date()),
  time: "09:00",
  type: "GATHERING" as EventType,
  location: "",
  description: "",
});

export default function EventCalendarPage() {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [eventForm, setEventForm] = useState(createDefaultEventForm());

  const normalizeApiError = (raw?: string, fallback = "Không thể tải sự kiện.") => {
    if (!raw) return fallback;
    if (raw === "Unauthorized") {
      router.push("/login");
      return "Phiên đăng nhập đã hết. Vui lòng đăng nhập lại.";
    }
    if (raw === "No active tenant selected") {
      return "Bạn chưa chọn cây gia phả đang hoạt động.";
    }
    if (raw.includes("Forbidden")) {
      return "Bạn không có quyền thao tác trên tenant hiện tại.";
    }
    return raw;
  };

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

  const loadEvents = async () => {
    setIsLoading(true);
    setError("");
    try {
      const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59);
      const params = new URLSearchParams({
        from: monthStart.toISOString(),
        to: monthEnd.toISOString(),
      });

      const response = await fetch(`/api/events?${params.toString()}`);
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(normalizeApiError(payload?.error, "Không thể tải sự kiện."));
        setEvents([]);
        return;
      }
      setEvents(payload?.data ?? []);
    } catch {
      setError("Không thể tải sự kiện.");
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDate.getFullYear(), currentDate.getMonth()]);

  const monthEvents = useMemo(
    () =>
      [...events].sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()),
    [events],
  );

  const upcomingEvents = useMemo(() => {
    const now = new Date();
    return [...events]
      .filter((event) => new Date(event.startsAt) >= now)
      .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime())
      .slice(0, 6);
  }, [events]);

  const getEventsForDate = (day: number) =>
    events.filter((event) => {
      const d = new Date(event.startsAt);
      return d.getDate() === day && d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear();
    });

  const resetForm = () => {
    setEditingEventId(null);
    setEventForm(createDefaultEventForm());
  };

  const handleOpenCreate = () => {
    resetForm();
    setShowForm(true);
  };

  const handleOpenEdit = (event: CalendarEvent) => {
    const d = new Date(event.startsAt);
    setEditingEventId(event.id);
    setEventForm({
      title: event.title,
      date: formatDateInput(d),
      time: formatTimeInput(d),
      type: event.type,
      location: event.location ?? "",
      description: event.description ?? "",
    });
    setShowForm(true);
  };

  const handleSubmitEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const startsAt = new Date(`${eventForm.date}T${eventForm.time}:00`);
      const payload = {
        title: eventForm.title,
        type: eventForm.type,
        startsAt: startsAt.toISOString(),
        location: eventForm.location || undefined,
        description: eventForm.description || undefined,
      };

      const response = await fetch(editingEventId ? `/api/events/${editingEventId}` : "/api/events", {
        method: editingEventId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(normalizeApiError(result?.error, "Không thể lưu sự kiện."));
        return;
      }

      setShowForm(false);
      resetForm();
      await loadEvents();
    } catch {
      setError("Không thể lưu sự kiện.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm("Bạn có chắc muốn xóa sự kiện này?")) return;
    setError("");
    try {
      const response = await fetch(`/api/events/${eventId}`, { method: "DELETE" });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(normalizeApiError(payload?.error, "Không thể xóa sự kiện."));
        return;
      }
      await loadEvents();
    } catch {
      setError("Không thể xóa sự kiện.");
    }
  };

  return (
    <main className="min-h-screen bg-[#F8FAF8] px-4 py-8 text-[#0F172A] md:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-bold md:text-4xl">Family Events Calendar</h1>
              <p className="mt-2 text-sm text-[#475569]">
                Theo dõi và quản lý sự kiện gia đình theo tenant hiện tại.
              </p>
            </div>
            <button
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-2 rounded-lg bg-[#16A34A] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#15803D]"
            >
              <CalendarPlus className="h-4 w-4" />
              Thêm sự kiện
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleSubmitEvent} className="mt-5 grid gap-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAF8] p-4 md:grid-cols-5">
              <input
                required
                value={eventForm.title}
                onChange={(e) => setEventForm((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Tên sự kiện"
                className="rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-sm md:col-span-2"
              />
              <input
                required
                type="date"
                value={eventForm.date}
                onChange={(e) => setEventForm((prev) => ({ ...prev, date: e.target.value }))}
                className="rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-sm"
              />
              <input
                required
                type="time"
                value={eventForm.time}
                onChange={(e) => setEventForm((prev) => ({ ...prev, time: e.target.value }))}
                className="rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-sm"
              />
              <select
                value={eventForm.type}
                onChange={(e) => setEventForm((prev) => ({ ...prev, type: e.target.value as EventType }))}
                className="rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-sm"
              >
                {eventTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <input
                value={eventForm.location}
                onChange={(e) => setEventForm((prev) => ({ ...prev, location: e.target.value }))}
                placeholder="Địa điểm (tuỳ chọn)"
                className="rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-sm md:col-span-2"
              />
              <input
                value={eventForm.description}
                onChange={(e) => setEventForm((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Mô tả (tuỳ chọn)"
                className="rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-sm md:col-span-2"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-lg bg-[#16A34A] px-3 py-2 text-sm font-semibold text-white hover:bg-[#15803D] disabled:opacity-60"
                >
                  {editingEventId ? "Cập nhật" : "Lưu sự kiện"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-sm"
                >
                  Hủy
                </button>
              </div>
            </form>
          )}
        </section>

        {error && (
          <div className="rounded-lg border border-[#FCA5A5] bg-[#FEF2F2] p-3 text-sm text-[#991B1B]">
            {error}
          </div>
        )}

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
                      {!isLoading && (
                        <div className="mt-1 space-y-1">
                          {getEventsForDate(day)
                            .slice(0, 2)
                            .map((event) => (
                              <div key={event.id} className={`truncate rounded px-1.5 py-1 text-[11px] font-semibold ${getEventStyle(event.type)}`}>
                                {event.title}
                              </div>
                            ))}
                        </div>
                      )}
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
                {isLoading ? (
                  <p className="text-sm text-[#64748B]">Đang tải...</p>
                ) : upcomingEvents.length === 0 ? (
                  <p className="text-sm text-[#64748B]">Chưa có sự kiện sắp tới.</p>
                ) : (
                  upcomingEvents.map((event) => (
                    <div key={event.id} className="rounded-lg border border-[#E2E8F0] bg-[#F8FAF8] p-3">
                      <p className="font-medium text-[#0F172A]">{event.title}</p>
                      <p className="mt-1 text-xs text-[#64748B]">{new Date(event.startsAt).toLocaleString("vi-VN")}</p>
                      {event.location ? (
                        <p className="mt-1 inline-flex items-center gap-1 text-xs text-[#475569]">
                          <Dot className="h-4 w-4 text-[#16A34A]" />
                          {event.location}
                        </p>
                      ) : (
                        <p className="mt-1 inline-flex items-center gap-1 text-xs text-[#475569]">
                          <Clock3 className="h-3.5 w-3.5 text-[#16A34A]" />
                          {eventTypeOptions.find((o) => o.value === event.type)?.label}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </section>
          </aside>
        </div>

        <section className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-[#0F172A]">
            Danh sách sự kiện tháng {currentDate.getMonth() + 1}/{currentDate.getFullYear()}
          </h3>
          <div className="mt-3 space-y-2">
            {isLoading ? (
              <p className="text-sm text-[#64748B]">Đang tải...</p>
            ) : monthEvents.length === 0 ? (
              <p className="text-sm text-[#64748B]">Chưa có sự kiện trong tháng này.</p>
            ) : (
              monthEvents.map((event) => (
                <article
                  key={event.id}
                  className="flex flex-col gap-3 rounded-lg border border-[#E2E8F0] bg-[#F8FAF8] p-3 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="font-medium text-[#0F172A]">{event.title}</p>
                    <p className="mt-1 text-xs text-[#64748B]">
                      {new Date(event.startsAt).toLocaleString("vi-VN")}
                      {event.location ? ` • ${event.location}` : ""}
                    </p>
                    <span className={`mt-2 inline-flex rounded px-2 py-0.5 text-[11px] font-semibold ${getEventStyle(event.type)}`}>
                      {eventTypeOptions.find((t) => t.value === event.type)?.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(event)}
                      className="inline-flex items-center gap-1 rounded-lg border border-[#E2E8F0] bg-white px-2.5 py-1.5 text-xs hover:bg-[#F8FAF8]"
                    >
                      <Pencil className="h-3.5 w-3.5 text-[#16A34A]" />
                      Sửa
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteEvent(event.id)}
                      className="inline-flex items-center gap-1 rounded-lg border border-[#FCA5A5] bg-white px-2.5 py-1.5 text-xs text-[#991B1B] hover:bg-[#FEF2F2]"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Xóa
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
