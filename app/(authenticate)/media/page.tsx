"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  ImageIcon,
  Loader2,
  PlayCircle,
  Search,
  Sparkles,
  Tag,
  Users,
  X,
} from "lucide-react";

type MediaType = "image" | "video";

type MediaItem = {
  id: string;
  type: MediaType;
  title: string;
  description: string;
  category: string;
  year: number;
  people: string[];
  thumbnail: string;
  src: string;
  uploadedDate: string;
};

const VIDEO_THUMBNAIL = "/images/grave-2.jpg";

interface MediaApiItem {
  id: string;
  name: string;
  kind: MediaType;
  category: string;
  usedBy: string;
  url: string;
  uploadedDate: string;
}

export default function MediaPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | MediaType>("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [active, setActive] = useState<MediaItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [items, setItems] = useState<MediaItem[]>([]);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/media", { cache: "no-store" });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) {
          setError(result?.error ?? "Không thể tải thư viện media.");
          setItems([]);
          return;
        }

        const rows = Array.isArray(result?.data) ? (result.data as MediaApiItem[]) : [];
        const mapped = rows.map((item) => {
              const uploadedDate = String(item.uploadedDate ?? "");
              const yearFromDate = Number(uploadedDate.slice(0, 4));
              return {
                id: String(item.id),
                type: item.kind === "video" ? "video" : "image",
                title: String(item.name ?? "Không tên"),
                description: `Tư liệu thuộc chủ đề ${String(item.category ?? "Khác")}.`,
                category: String(item.category ?? "Khác"),
                year: Number.isFinite(yearFromDate) ? yearFromDate : new Date().getFullYear(),
                people: [String(item.usedBy ?? "N/A")],
                thumbnail: item.kind === "video" ? VIDEO_THUMBNAIL : String(item.url ?? ""),
                src: String(item.url ?? ""),
                uploadedDate,
              } satisfies MediaItem;
            });

        setItems(mapped);
      } catch {
        setError("Không thể tải thư viện media.");
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  const categories = useMemo(
    () => Array.from(new Set(items.map((item) => item.category))).sort((a, b) => a.localeCompare(b, "vi")),
    [items],
  );
  const years = useMemo(
    () => Array.from(new Set(items.map((item) => item.year))).sort((a, b) => b - a),
    [items],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((item) => {
      const typeMatch = typeFilter === "all" || item.type === typeFilter;
      const categoryMatch = categoryFilter === "all" || item.category === categoryFilter;
      const yearMatch = yearFilter === "all" || item.year === Number(yearFilter);
      const searchMatch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.people.some((person) => person.toLowerCase().includes(q));
      return typeMatch && categoryMatch && yearMatch && searchMatch;
    });
  }, [categoryFilter, items, search, typeFilter, yearFilter]);

  const stats = useMemo(() => {
    const images = items.filter((item) => item.type === "image").length;
    const videos = items.filter((item) => item.type === "video").length;
    const people = new Set(items.flatMap((item) => item.people)).size;
    return { images, videos, people };
  }, [items]);

  return (
    <main className="min-h-screen bg-[#F6F8F7] px-4 py-8 text-[#0F172A] md:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="relative overflow-hidden rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-sm md:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(22,163,74,0.14),_transparent_45%),radial-gradient(circle_at_bottom_left,_rgba(14,165,233,0.14),_transparent_40%)]" />
          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#16A34A]/30 bg-[#DCFCE7] px-3 py-1 text-xs font-medium text-[#166534]">
              <Sparkles className="h-3.5 w-3.5" />
              Family Media Library
            </span>
            <h1 className="mt-4 text-3xl font-bold leading-tight md:text-5xl">Thư viện ảnh và video dòng họ</h1>
            <p className="mt-3 max-w-3xl text-sm text-[#475569] md:text-base">
              Nơi lưu trữ tư liệu hình ảnh, video tưởng niệm và các khoảnh khắc quan trọng của gia đình.
            </p>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <article className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
            <p className="text-xs text-[#64748B]">Ảnh</p>
            <p className="mt-2 text-3xl font-bold text-[#0F172A]">{stats.images}</p>
          </article>
          <article className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
            <p className="text-xs text-[#64748B]">Video</p>
            <p className="mt-2 text-3xl font-bold text-[#0F172A]">{stats.videos}</p>
          </article>
          <article className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
            <p className="text-xs text-[#64748B]">Thành viên xuất hiện</p>
            <p className="mt-2 text-3xl font-bold text-[#0F172A]">{stats.people}</p>
          </article>
        </section>

        <section className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
          <div className="grid gap-3 md:grid-cols-[1.4fr_0.8fr_1fr_1fr]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Tìm theo tiêu đề, mô tả, thành viên..."
                className="w-full rounded-lg border border-[#E2E8F0] bg-white py-2.5 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20"
              />
            </div>
            <select
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value as "all" | MediaType)}
              className="rounded-lg border border-[#E2E8F0] bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20"
            >
              <option value="all">Tất cả loại</option>
              <option value="image">Hình ảnh</option>
              <option value="video">Video</option>
            </select>
            <select
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
              className="rounded-lg border border-[#E2E8F0] bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20"
            >
              <option value="all">Tất cả chủ đề</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <select
              value={yearFilter}
              onChange={(event) => setYearFilter(event.target.value)}
              className="rounded-lg border border-[#E2E8F0] bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20"
            >
              <option value="all">Tất cả năm</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  Năm {year}
                </option>
              ))}
            </select>
          </div>
        </section>

        <section className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#0F172A]">Media Gallery</h2>
            <span className="text-sm text-[#64748B]">{filtered.length} kết quả</span>
          </div>

          {loading ? (
            <div className="rounded-xl border border-dashed border-[#CBD5E1] bg-[#F8FAF8] p-8 text-center text-sm text-[#64748B]">
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Đang tải media...
              </span>
            </div>
          ) : error ? (
            <div className="rounded-xl border border-[#FCA5A5] bg-[#FEF2F2] p-6 text-center text-sm text-[#991B1B]">
              {error}
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#CBD5E1] bg-[#F8FAF8] p-8 text-center text-sm text-[#64748B]">
              Chưa có tư liệu phù hợp bộ lọc hiện tại.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((item) => (
                <article
                  key={item.id}
                  onClick={() => setActive(item)}
                  className="group cursor-pointer overflow-hidden rounded-2xl border border-[#E2E8F0] bg-[#FCFDFC] transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="relative h-52 overflow-hidden bg-[#F1F5F9]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-[#166534]">
                      {item.type === "image" ? "Ảnh" : "Video"}
                    </span>
                    {item.type === "video" ? (
                      <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-[#0F172A]/80 px-2.5 py-1 text-[11px] font-semibold text-white">
                        <PlayCircle className="h-3.5 w-3.5" />
                        Video
                      </span>
                    ) : null}
                  </div>
                  <div className="space-y-2 p-4">
                    <h3 className="line-clamp-1 text-lg font-semibold text-[#0F172A]">{item.title}</h3>
                    <p className="line-clamp-2 text-sm text-[#475569]">{item.description}</p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#F1F5F9] px-2 py-1 text-[11px] text-[#475569]">
                        <Tag className="h-3 w-3" />
                        {item.category}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#F1F5F9] px-2 py-1 text-[11px] text-[#475569]">
                        <CalendarDays className="h-3 w-3" />
                        {item.year}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>

      {active ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/75 p-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-2xl border border-white/20 bg-white">
            <button
              type="button"
              onClick={() => setActive(null)}
              className="absolute right-3 top-3 z-10 rounded-full bg-white/90 p-2 text-[#0F172A] hover:bg-white"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="grid md:grid-cols-[1.3fr_0.7fr]">
              <div className="relative h-[55vh] bg-black">
                {active.type === "image" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={active.src} alt={active.title} className="h-full w-full object-contain" />
                ) : (
                  <video src={active.src} controls className="h-full w-full object-contain" />
                )}
              </div>
              <div className="space-y-3 p-5">
                <h3 className="text-xl font-semibold text-[#0F172A]">{active.title}</h3>
                <p className="text-sm text-[#475569]">{active.description}</p>
                <div className="space-y-2 rounded-xl border border-[#E2E8F0] bg-[#F8FAF8] p-3">
                  <p className="inline-flex items-center gap-2 text-sm font-medium text-[#0F172A]">
                    <Tag className="h-4 w-4 text-[#16A34A]" />
                    {active.category}
                  </p>
                  <p className="inline-flex items-center gap-2 text-sm text-[#475569]">
                    <CalendarDays className="h-4 w-4 text-[#16A34A]" />
                    Năm {active.year}
                  </p>
                  <p className="inline-flex items-center gap-2 text-sm text-[#475569]">
                    <Users className="h-4 w-4 text-[#16A34A]" />
                    {active.people.join(", ")}
                  </p>
                  <p className="inline-flex items-center gap-2 text-sm text-[#475569]">
                    {active.type === "image" ? (
                      <ImageIcon className="h-4 w-4 text-[#16A34A]" />
                    ) : (
                      <PlayCircle className="h-4 w-4 text-[#16A34A]" />
                    )}
                    {active.type === "image" ? "Hình ảnh" : "Video"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
