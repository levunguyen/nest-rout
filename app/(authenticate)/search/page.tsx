"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarDays,
  Filter,
  MapPin,
  RotateCcw,
  Search,
  SlidersHorizontal,
  UserRound,
  Users,
} from "lucide-react";

type Person = {
  id: number;
  firstName: string;
  lastName: string;
  relation: string;
  birthYear: number;
  deathYear?: number;
  location: string;
  father?: string;
  mother?: string;
  image: string;
};

type SearchMode = "name" | "location";

const DATA: Person[] = [
  {
    id: 1,
    firstName: "Nguyen",
    lastName: "Van A",
    relation: "Grandfather",
    birthYear: 1930,
    deathYear: 1995,
    location: "Hue",
    image: "/images/grandfather.png",
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
    image: "/images/grandmother.png",
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
    image: "/images/dad.png",
  },
];

export default function FamilyTreeSearchPage() {
  const [query, setQuery] = useState("");
  const [appliedQuery, setAppliedQuery] = useState("");
  const [mode, setMode] = useState<SearchMode>("name");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [relation, setRelation] = useState("");
  const [birthFrom, setBirthFrom] = useState("");
  const [birthTo, setBirthTo] = useState("");

  const relationOptions = useMemo(() => {
    return Array.from(new Set(DATA.map((item) => item.relation))).sort();
  }, []);

  const results = useMemo(() => {
    let filtered = [...DATA];
    const q = appliedQuery.trim().toLowerCase();

    if (q) {
      filtered = filtered.filter((p) =>
        mode === "name"
          ? `${p.firstName} ${p.lastName}`.toLowerCase().includes(q)
          : p.location.toLowerCase().includes(q),
      );
    }

    if (relation) {
      filtered = filtered.filter((p) => p.relation === relation);
    }

    if (birthFrom) {
      filtered = filtered.filter((p) => p.birthYear >= Number(birthFrom));
    }

    if (birthTo) {
      filtered = filtered.filter((p) => p.birthYear <= Number(birthTo));
    }

    return filtered;
  }, [appliedQuery, mode, relation, birthFrom, birthTo]);

  const handleSearch = () => setAppliedQuery(query);

  const resetAll = () => {
    setQuery("");
    setAppliedQuery("");
    setMode("name");
    setRelation("");
    setBirthFrom("");
    setBirthTo("");
  };

  return (
    <main className="min-h-screen bg-[#F8FAF8] px-4 py-8 text-[#0F172A] md:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-bold md:text-4xl">Tìm kiếm thành viên gia đình</h1>
          <p className="mt-2 text-sm text-[#475569]">
            Tìm theo tên hoặc địa điểm, kết hợp bộ lọc nâng cao để truy xuất hồ sơ nhanh và chính xác.
          </p>
        </section>

        <section className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder={mode === "name" ? "Nhập tên thành viên..." : "Nhập địa điểm..."}
                className="w-full rounded-lg border border-[#E2E8F0] bg-white py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20"
              />
            </div>

            <div className="inline-flex rounded-lg border border-[#E2E8F0] bg-[#F8FAF8] p-1">
              <button
                type="button"
                onClick={() => setMode("name")}
                className={[
                  "rounded-md px-3 py-1.5 text-sm font-medium",
                  mode === "name" ? "bg-[#16A34A] text-white" : "text-[#0F172A]",
                ].join(" ")}
              >
                Tên
              </button>
              <button
                type="button"
                onClick={() => setMode("location")}
                className={[
                  "rounded-md px-3 py-1.5 text-sm font-medium",
                  mode === "location" ? "bg-[#16A34A] text-white" : "text-[#0F172A]",
                ].join(" ")}
              >
                Địa điểm
              </button>
            </div>

            <button
              type="button"
              onClick={handleSearch}
              className="rounded-lg bg-[#16A34A] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#15803D]"
            >
              Tìm kiếm
            </button>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setShowAdvanced((prev) => !prev)}
              className="inline-flex items-center gap-2 text-sm font-medium text-[#475569] hover:text-[#0F172A]"
            >
              <SlidersHorizontal className="h-4 w-4 text-[#16A34A]" />
              Bộ lọc nâng cao
            </button>
            <button
              type="button"
              onClick={resetAll}
              className="inline-flex items-center gap-2 text-sm font-medium text-[#475569] hover:text-[#0F172A]"
            >
              <RotateCcw className="h-4 w-4 text-[#16A34A]" />
              Reset
            </button>
          </div>

          <AnimatePresence>
            {showAdvanced && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 grid gap-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAF8] p-4 md:grid-cols-3"
              >
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#64748B]">
                    Quan hệ
                  </label>
                  <select
                    value={relation}
                    onChange={(e) => setRelation(e.target.value)}
                    className="w-full rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20"
                  >
                    <option value="">Tất cả</option>
                    {relationOptions.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#64748B]">
                    Năm sinh từ
                  </label>
                  <input
                    type="number"
                    value={birthFrom}
                    onChange={(e) => setBirthFrom(e.target.value)}
                    className="w-full rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20"
                    placeholder="Ví dụ: 1940"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#64748B]">
                    Năm sinh đến
                  </label>
                  <input
                    type="number"
                    value={birthTo}
                    onChange={(e) => setBirthTo(e.target.value)}
                    className="w-full rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20"
                    placeholder="Ví dụ: 2010"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        <section className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Kết quả tìm kiếm</h2>
            <span className="inline-flex items-center gap-1 rounded-full border border-[#16A34A]/30 bg-[#DCFCE7] px-3 py-1 text-xs font-medium text-[#166534]">
              <Filter className="h-3.5 w-3.5" />
              {results.length} bản ghi
            </span>
          </div>

          {results.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#CBD5E1] bg-[#F8FAF8] p-8 text-center">
              <p className="font-medium text-[#334155]">Không tìm thấy kết quả phù hợp</p>
              <p className="mt-1 text-sm text-[#64748B]">Thử đổi từ khóa hoặc nới rộng bộ lọc nâng cao.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {results.map((person) => (
                <article key={person.id} className="rounded-xl border border-[#E2E8F0] bg-[#F8FAF8] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-[#E2E8F0] bg-white">
                        <Image src={person.image} alt={`${person.firstName} ${person.lastName}`} fill className="object-cover" />
                      </div>
                      <div>
                        <p className="font-semibold text-[#0F172A]">
                          {person.firstName} {person.lastName}
                        </p>
                        <p className="mt-1 text-xs text-[#64748B]">{person.relation}</p>
                      </div>
                    </div>
                    <span className="rounded-md bg-white px-2 py-1 text-xs text-[#166534] border border-[#E2E8F0]">
                      ID: {person.id}
                    </span>
                  </div>

                  <div className="mt-3 space-y-2 text-sm text-[#475569]">
                    <p className="inline-flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-[#16A34A]" />
                      {person.location}
                    </p>
                    <p className="inline-flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-[#16A34A]" />
                      {person.birthYear}
                      {person.deathYear ? ` - ${person.deathYear}` : " - nay"}
                    </p>
                    <p className="inline-flex items-center gap-2">
                      <UserRound className="h-4 w-4 text-[#16A34A]" />
                      Cha: {person.father ?? "—"} | Mẹ: {person.mother ?? "—"}
                    </p>
                  </div>

                  <button
                    type="button"
                    className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#16A34A] px-3 py-2 text-xs font-semibold text-white hover:bg-[#15803D]"
                  >
                    <Users className="h-3.5 w-3.5" />
                    Xem hồ sơ
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
