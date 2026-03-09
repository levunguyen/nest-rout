"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
  id: string;
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

export default function FamilyTreeSearchPage() {
  const router = useRouter();
  const searchBoxRef = useRef<HTMLDivElement | null>(null);
  const [query, setQuery] = useState("");
  const [appliedQuery, setAppliedQuery] = useState("");
  const [appliedMode, setAppliedMode] = useState<SearchMode>("name");
  const [appliedRelation, setAppliedRelation] = useState("");
  const [appliedBirthFrom, setAppliedBirthFrom] = useState("");
  const [appliedBirthTo, setAppliedBirthTo] = useState("");
  const [mode, setMode] = useState<SearchMode>("name");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [relation, setRelation] = useState("");
  const [birthFrom, setBirthFrom] = useState("");
  const [birthTo, setBirthTo] = useState("");
  const [results, setResults] = useState<Person[]>([]);
  const [relationOptions, setRelationOptions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (!hasSearched) {
      setResults([]);
      setError("");
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    const loadResults = async () => {
      setIsLoading(true);
      setError("");
      try {
        const params = new URLSearchParams({
          mode: appliedMode,
          pageSize: "100",
        });
        if (appliedQuery.trim()) params.set("q", appliedQuery.trim());
        if (appliedRelation) params.set("relation", appliedRelation);
        if (appliedBirthFrom) params.set("birthFrom", appliedBirthFrom);
        if (appliedBirthTo) params.set("birthTo", appliedBirthTo);

        const response = await fetch(`/api/search?${params.toString()}`, {
          method: "GET",
          signal: controller.signal,
        });
        const payload = await response.json().catch(() => ({}));

        if (response.status === 401) {
          router.push("/login");
          return;
        }
        if (!response.ok) {
          setError(payload?.error || "Không thể tải dữ liệu tìm kiếm.");
          setResults([]);
          return;
        }

        setResults((payload?.data ?? []) as Person[]);
        const optionList = payload?.meta?.relationOptions;
        setRelationOptions(Array.isArray(optionList) ? optionList : []);
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        setError("Không thể tải dữ liệu tìm kiếm.");
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadResults();
    return () => controller.abort();
  }, [
    appliedBirthFrom,
    appliedBirthTo,
    appliedMode,
    appliedQuery,
    appliedRelation,
    hasSearched,
    router,
  ]);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setSuggestions([]);
      setShowSuggestions(false);
      setActiveSuggestionIndex(-1);
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setIsLoadingSuggestions(true);
      try {
        const params = new URLSearchParams({
          q: trimmed,
          mode,
          limit: "8",
        });
        const response = await fetch(`/api/search/suggestions?${params.toString()}`, {
          method: "GET",
          signal: controller.signal,
        });
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) {
          setSuggestions([]);
          return;
        }
        const items = Array.isArray(payload?.data)
          ? (payload.data as string[]).filter((item) => typeof item === "string" && item.trim())
          : [];
        setSuggestions(items);
        setShowSuggestions(items.length > 0);
        setActiveSuggestionIndex(items.length > 0 ? 0 : -1);
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        setSuggestions([]);
      } finally {
        setIsLoadingSuggestions(false);
      }
    }, 220);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [mode, query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchBoxRef.current &&
        event.target instanceof Node &&
        !searchBoxRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
        setActiveSuggestionIndex(-1);
      }
    };
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (nextQuery?: string) => {
    const candidateQuery = (nextQuery ?? query).trim();
    const hasCondition = Boolean(candidateQuery || relation || birthFrom || birthTo);

    if (!hasCondition) {
      setHasSearched(false);
      setAppliedQuery("");
      setAppliedRelation("");
      setAppliedBirthFrom("");
      setAppliedBirthTo("");
      setError("");
      setResults([]);
      return;
    }

    setAppliedQuery(candidateQuery);
    setAppliedMode(mode);
    setAppliedRelation(relation);
    setAppliedBirthFrom(birthFrom);
    setAppliedBirthTo(birthTo);
    setHasSearched(true);
  };

  const handleSelectSuggestion = (value: string) => {
    setQuery(value);
    setShowSuggestions(false);
    setActiveSuggestionIndex(-1);
  };

  const resetAll = () => {
    setQuery("");
    setAppliedQuery("");
    setMode("name");
    setRelation("");
    setBirthFrom("");
    setBirthTo("");
    setAppliedMode("name");
    setAppliedRelation("");
    setAppliedBirthFrom("");
    setAppliedBirthTo("");
    setHasSearched(false);
    setResults([]);
    setError("");
  };

  const resultCountBadge = useMemo(() => {
    if (!hasSearched) return "Chưa tìm kiếm";
    if (isLoading) return "Đang tải...";
    return `${results.length} bản ghi`;
  }, [hasSearched, isLoading, results.length]);

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
            <div ref={searchBoxRef} className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => {
                  const shouldShow = suggestions.length > 0;
                  setShowSuggestions(shouldShow);
                  if (shouldShow) {
                    setActiveSuggestionIndex((prev) => (prev >= 0 ? prev : 0));
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown" && suggestions.length > 0) {
                    e.preventDefault();
                    setShowSuggestions(true);
                    setActiveSuggestionIndex((prev) =>
                      prev < 0 ? 0 : (prev + 1) % suggestions.length,
                    );
                    return;
                  }
                  if (e.key === "ArrowUp" && suggestions.length > 0) {
                    e.preventDefault();
                    setShowSuggestions(true);
                    setActiveSuggestionIndex((prev) =>
                      prev < 0 ? suggestions.length - 1 : (prev - 1 + suggestions.length) % suggestions.length,
                    );
                    return;
                  }
                  if (e.key === "Enter") {
                    if (
                      showSuggestions &&
                      activeSuggestionIndex >= 0 &&
                      activeSuggestionIndex < suggestions.length
                    ) {
                      e.preventDefault();
                      handleSelectSuggestion(suggestions[activeSuggestionIndex]);
                    } else {
                      setShowSuggestions(false);
                      setActiveSuggestionIndex(-1);
                    }
                  }
                  if (e.key === "Escape") {
                    setShowSuggestions(false);
                    setActiveSuggestionIndex(-1);
                  }
                }}
                placeholder={mode === "name" ? "Nhập tên thành viên..." : "Nhập địa điểm..."}
                className="w-full rounded-lg border border-[#E2E8F0] bg-white py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20"
              />
              {(showSuggestions || isLoadingSuggestions) && (
                <div
                  className="mt-1 overflow-hidden rounded-lg border border-[#E2E8F0] bg-white shadow-sm"
                >
                  {isLoadingSuggestions ? (
                    <p className="px-3 py-2 text-sm text-[#64748B]">Đang gợi ý...</p>
                  ) : suggestions.length === 0 ? (
                    <p className="px-3 py-2 text-sm text-[#64748B]">Không có gợi ý</p>
                  ) : (
                    <ul className="max-h-60 overflow-y-auto py-1">
                      {suggestions.map((item) => (
                        <li key={item}>
                          <button
                            type="button"
                            onClick={() => handleSelectSuggestion(item)}
                            onMouseEnter={() =>
                              setActiveSuggestionIndex(
                                suggestions.findIndex((candidate) => candidate === item),
                              )
                            }
                            className={[
                              "w-full px-3 py-2 text-left text-sm text-[#0F172A] hover:bg-[#F8FAF8]",
                              activeSuggestionIndex >= 0 &&
                              suggestions[activeSuggestionIndex] === item
                                ? "bg-[#F8FAF8]"
                                : "",
                            ].join(" ")}
                          >
                            {item}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
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
              onClick={() => {
                setShowSuggestions(false);
                setActiveSuggestionIndex(-1);
                handleSearch();
              }}
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
              {resultCountBadge}
            </span>
          </div>

          {!hasSearched ? (
            <div className="rounded-xl border border-dashed border-[#CBD5E1] bg-[#F8FAF8] p-8 text-center">
              <p className="font-medium text-[#334155]">Chưa có kết quả</p>
              <p className="mt-1 text-sm text-[#64748B]">Nhập điều kiện và bấm Tìm kiếm để xem kết quả.</p>
            </div>
          ) : error ? (
            <div className="rounded-xl border border-[#FCA5A5] bg-[#FEF2F2] p-6 text-center">
              <p className="font-medium text-[#991B1B]">{error}</p>
            </div>
          ) : isLoading ? (
            <div className="rounded-xl border border-dashed border-[#CBD5E1] bg-[#F8FAF8] p-8 text-center">
              <p className="font-medium text-[#334155]">Đang tải kết quả...</p>
            </div>
          ) : results.length === 0 ? (
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
