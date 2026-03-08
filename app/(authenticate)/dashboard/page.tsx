"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpRight, CalendarDays, Clock3, Sparkles, TreePine, Users } from "lucide-react";
import memorial from "../../../public/images/hero-memorial.jpg";

interface DashboardEvent {
  id: string;
  title: string;
  startsAt: string;
  type: "BIRTHDAY" | "ANNIVERSARY" | "GATHERING" | "OTHER";
}

interface DashboardMember {
  id: string;
  fullName: string;
  generation: number;
  createdAt: string;
}

interface DashboardSummary {
  tenant?: { id: string; name: string } | null;
  stats: {
    totalMembers: number;
    upcomingEvents: number;
    totalEventsUpcoming: number;
  };
  upcomingEvents: DashboardEvent[];
  upcomingAnniversaries: DashboardEvent[];
  upcomingBirthdays: DashboardEvent[];
  recentMembers: DashboardMember[];
}

export default function DashboardPage() {
  const router = useRouter();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const normalizeApiError = useCallback(
    (raw?: string) => {
      if (!raw) return "Không thể tải dữ liệu dashboard.";
      if (raw === "Unauthorized") {
        router.push("/login");
        return "Phiên đăng nhập đã hết. Vui lòng đăng nhập lại.";
      }
      if (raw === "No active tenant selected") {
        return "Bạn chưa chọn cây gia phả đang hoạt động.";
      }
      if (raw.includes("Forbidden")) {
        return "Bạn không có quyền truy cập dữ liệu của tenant hiện tại.";
      }
      return raw;
    },
    [router],
  );

  useEffect(() => {
    const loadSummary = async () => {
      setIsLoading(true);
      setError("");
      try {
        const response = await fetch("/api/dashboard/summary");
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) {
          setError(normalizeApiError(payload?.error));
          setSummary(null);
          return;
        }
        setSummary(payload.data);
      } catch {
        setError("Không thể tải dữ liệu dashboard.");
        setSummary(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadSummary();
  }, [normalizeApiError]);

  const stats = useMemo(
    () => [
      {
        label: "Tổng thành viên",
        value: summary?.stats.totalMembers ?? 0,
        icon: Users,
        note: "Trong tenant hiện tại",
      },
      {
        label: "Tenant đang dùng",
        value: summary?.tenant?.name ?? "-",
        icon: TreePine,
        note: "Gia phả đang hoạt động",
      },
      {
        label: "Sự kiện 30 ngày tới",
        value: summary?.stats.upcomingEvents ?? 0,
        icon: Sparkles,
        note: `${summary?.stats.totalEventsUpcoming ?? 0} sự kiện đang lên lịch`,
      },
    ],
    [summary],
  );

  return (
    <main className="min-h-screen bg-[#F8FAF8] px-4 py-6 text-[#0F172A] md:px-8 md:py-8">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <div className="overflow-hidden rounded-3xl border border-[#E2E8F0] bg-white">
          <div className="grid gap-6 p-6 md:grid-cols-2 md:p-8">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#16A34A]/30 bg-[#DCFCE7] px-3 py-1 text-xs font-medium text-[#166534]">
                <Sparkles className="h-3.5 w-3.5" />
                Dashboard tổng quan
              </span>
              <h1 className="mt-4 text-3xl font-bold leading-tight md:text-4xl">
                Quản lý gia phả hiện đại,
                <span className="block text-[#16A34A]">trực quan và tập trung.</span>
              </h1>
              <p className="mt-3 max-w-xl text-sm text-[#475569] md:text-base">
                Theo dõi thành viên, lịch sự kiện và cập nhật mới nhất trong tenant đang chọn.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/tree"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#16A34A] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#15803D]"
                >
                  Mở cây gia phả
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/event"
                  className="inline-flex items-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm font-semibold text-[#0F172A] transition hover:bg-[#F8FAF8]"
                >
                  Xem lịch sự kiện
                  <CalendarDays className="h-4 w-4 text-[#16A34A]" />
                </Link>
              </div>
            </div>

            <div className="relative h-64 overflow-hidden rounded-2xl border border-[#E2E8F0] md:h-full">
              <Image src={memorial} alt="Gia đình nhiều thế hệ" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/40 to-transparent" />
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-lg border border-[#FCA5A5] bg-[#FEF2F2] p-3 text-sm text-[#991B1B]">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {stats.map((item) => (
            <article key={item.label} className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-[#475569]">{item.label}</p>
                  <p className="mt-2 text-3xl font-bold text-[#0F172A]">{item.value}</p>
                  <p className="mt-2 text-xs font-medium text-[#166534]">{item.note}</p>
                </div>
                <span className="rounded-lg bg-[#DCFCE7] p-2 text-[#16A34A]">
                  <item.icon className="h-5 w-5" />
                </span>
              </div>
            </article>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <section className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Sự kiện sắp tới</h2>
              <Link href="/event" className="text-sm font-semibold text-[#16A34A] hover:text-[#15803D]">
                Xem tất cả
              </Link>
            </div>
            {isLoading ? (
              <p className="text-sm text-[#64748B]">Đang tải dữ liệu...</p>
            ) : summary?.upcomingEvents.length ? (
              <div className="space-y-3">
                {summary.upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between rounded-xl border border-[#E2E8F0] bg-[#F8FAF8] px-4 py-3"
                  >
                    <div>
                      <p className="font-medium text-[#0F172A]">{event.title}</p>
                      <p className="mt-1 text-sm text-[#475569]">
                        {new Date(event.startsAt).toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-medium text-[#166534]">
                      <Clock3 className="h-3.5 w-3.5 text-[#16A34A]" />
                      {new Date(event.startsAt).toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#64748B]">Chưa có sự kiện nào sắp tới.</p>
            )}
          </section>

          <section className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">Thành viên mới thêm</h2>
            {isLoading ? (
              <p className="text-sm text-[#64748B]">Đang tải dữ liệu...</p>
            ) : summary?.recentMembers.length ? (
              <div className="space-y-3">
                {summary.recentMembers.map((member) => (
                  <div key={member.id} className="rounded-xl border border-[#E2E8F0] bg-[#F8FAF8] p-3">
                    <p className="font-medium text-[#0F172A]">{member.fullName}</p>
                    <p className="mt-1 text-xs text-[#64748B]">
                      Đời {member.generation} • thêm ngày{" "}
                      {new Date(member.createdAt).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#64748B]">Chưa có thành viên mới.</p>
            )}
          </section>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#0F172A]">Danh sách ngày giỗ</h2>
              <Link href="/event" className="text-sm font-semibold text-[#16A34A] hover:text-[#15803D]">
                Quản lý lịch giỗ
              </Link>
            </div>
            {isLoading ? (
              <p className="text-sm text-[#64748B]">Đang tải dữ liệu...</p>
            ) : summary?.upcomingAnniversaries.length ? (
              <div className="space-y-3">
                {summary.upcomingAnniversaries.map((event) => (
                  <article key={event.id} className="rounded-xl border border-[#E2E8F0] bg-[#F8FAF8] p-3">
                    <p className="font-semibold text-[#0F172A]">{event.title}</p>
                    <p className="mt-1 text-xs text-[#64748B]">
                      {new Date(event.startsAt).toLocaleDateString("vi-VN")} •{" "}
                      {new Date(event.startsAt).toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </article>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#64748B]">Chưa có lịch ngày giỗ sắp tới.</p>
            )}
          </section>

          <section className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#0F172A]">Sinh nhật thành viên</h2>
              <Link href="/event" className="text-sm font-semibold text-[#16A34A] hover:text-[#15803D]">
                Xem lịch sự kiện
              </Link>
            </div>
            {isLoading ? (
              <p className="text-sm text-[#64748B]">Đang tải dữ liệu...</p>
            ) : summary?.upcomingBirthdays.length ? (
              <div className="space-y-3">
                {summary.upcomingBirthdays.map((event) => (
                  <article key={event.id} className="rounded-xl border border-[#E2E8F0] bg-[#F8FAF8] p-3">
                    <p className="font-semibold text-[#0F172A]">{event.title}</p>
                    <p className="mt-1 text-xs text-[#64748B]">
                      {new Date(event.startsAt).toLocaleDateString("vi-VN")} •{" "}
                      {new Date(event.startsAt).toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </article>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#64748B]">Chưa có sinh nhật sắp tới.</p>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}
