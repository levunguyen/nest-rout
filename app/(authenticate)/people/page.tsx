"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, MapPin, Search, SlidersHorizontal, UserPlus } from "lucide-react";

type HealthStatus = "Excellent" | "Good" | "Fair";

interface FamilyMember {
  id: number;
  name: string;
  relation: string;
  age: number;
  location: string;
  healthStatus: HealthStatus;
  lastUpdate: string;
  image: string;
}

const familyMembers: FamilyMember[] = [
  {
    id: 1,
    name: "Robert Johnson",
    relation: "Grandfather",
    age: 72,
    location: "Chicago, IL",
    healthStatus: "Good",
    lastUpdate: "Had his annual checkup yesterday. Doctor says blood pressure is improving.",
    image: "/images/grandfather.png",
  },
  {
    id: 2,
    name: "Margaret Johnson",
    relation: "Grandmother",
    age: 70,
    location: "Chicago, IL",
    healthStatus: "Excellent",
    lastUpdate: "Started a new water aerobics class at the community center.",
    image: "/images/grandmother.png",
  },
  {
    id: 3,
    name: "James Anderson",
    relation: "Son",
    age: 45,
    location: "Boston, MA",
    healthStatus: "Good",
    lastUpdate: "Got promoted to Senior Manager at work.",
    image: "/images/dad.png",
  },
  {
    id: 4,
    name: "Elizabeth Parker",
    relation: "Daughter-in-law",
    age: 43,
    location: "Boston, MA",
    healthStatus: "Excellent",
    lastUpdate: "Completed her first half marathon. Training for full marathon next spring.",
    image: "/images/young-girl-portrait.png",
  },
  {
    id: 5,
    name: "Sarah Anderson",
    relation: "Granddaughter",
    age: 16,
    location: "Boston, MA",
    healthStatus: "Excellent",
    lastUpdate: "Made the honor roll and joined the school debate team.",
    image: "/images/young-girl-student-indoor.png",
  },
  {
    id: 6,
    name: "Michael Anderson",
    relation: "Grandson",
    age: 12,
    location: "Boston, MA",
    healthStatus: "Excellent",
    lastUpdate: "Scored two goals in his soccer match this weekend.",
    image: "/images/nephew.png",
  },
  {
    id: 7,
    name: "Thomas Clark",
    relation: "Uncle",
    age: 51,
    location: "Seattle, WA",
    healthStatus: "Fair",
    lastUpdate: "Started physiotherapy sessions and light daily walking.",
    image: "/images/uncle.png",
  },
  {
    id: 8,
    name: "Emma Clark",
    relation: "Aunt",
    age: 49,
    location: "Seattle, WA",
    healthStatus: "Good",
    lastUpdate: "Organized monthly family dinner and digitized old photo albums.",
    image: "/images/young-girl-face.png",
  },
];

const getStatusStyles = (status: HealthStatus) => {
  if (status === "Excellent") return "bg-[#DCFCE7] text-[#166534]";
  if (status === "Good") return "bg-[#ECFDF5] text-[#166534]";
  return "bg-[#FEF3C7] text-[#92400E]";
};

export default function PeoplePage() {
  const [search, setSearch] = useState("");
  const [relationFilter, setRelationFilter] = useState("all");
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  const relationOptions = useMemo(
    () => Array.from(new Set(familyMembers.map((member) => member.relation))).sort(),
    [],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return familyMembers.filter((member) => {
      const matchesQuery =
        !q ||
        member.name.toLowerCase().includes(q) ||
        member.location.toLowerCase().includes(q) ||
        member.relation.toLowerCase().includes(q);
      const matchesRelation = relationFilter === "all" || member.relation === relationFilter;
      return matchesQuery && matchesRelation;
    });
  }, [search, relationFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const safePage = Math.min(page, totalPages);
  const pagedMembers = filtered.slice((safePage - 1) * itemsPerPage, safePage * itemsPerPage);

  return (
    <main className="min-h-screen bg-[#F8FAF8] px-4 py-8 text-[#0F172A] md:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-bold md:text-4xl">Family Members</h1>
              <p className="mt-2 text-sm text-[#475569]">
                Quản lý hồ sơ thành viên theo nhánh gia đình, tình trạng sức khỏe và địa điểm sinh sống.
              </p>
            </div>
            <button className="inline-flex items-center gap-2 rounded-lg bg-[#16A34A] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#15803D]">
              <UserPlus className="h-4 w-4" />
              Add Family Member
            </button>
          </div>
        </section>

        <section className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search by name, relation, or location..."
                className="w-full rounded-lg border border-[#E2E8F0] bg-white py-2.5 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20"
              />
            </div>
            <div className="inline-flex items-center gap-2 rounded-lg border border-[#E2E8F0] bg-[#F8FAF8] px-3 py-2">
              <SlidersHorizontal className="h-4 w-4 text-[#16A34A]" />
              <select
                value={relationFilter}
                onChange={(e) => {
                  setRelationFilter(e.target.value);
                  setPage(1);
                }}
                className="bg-transparent text-sm text-[#0F172A] focus:outline-none"
              >
                <option value="all">All relations</option>
                {relationOptions.map((relation) => (
                  <option key={relation} value={relation}>
                    {relation}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {pagedMembers.map((member) => (
            <article key={member.id} className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-[#E2E8F0] bg-[#F8FAF8]">
                  <Image src={member.image} alt={member.name} fill className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-lg font-semibold text-[#0F172A]">{member.name}</p>
                  <div className="mt-1 flex flex-wrap gap-2">
                    <span className="rounded-full border border-[#E2E8F0] bg-[#F8FAF8] px-2.5 py-1 text-xs text-[#475569]">{member.relation}</span>
                    <span className="rounded-full border border-[#E2E8F0] bg-[#F8FAF8] px-2.5 py-1 text-xs text-[#475569]">{member.age} years</span>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${getStatusStyles(member.healthStatus)}`}>
                      {member.healthStatus}
                    </span>
                  </div>
                </div>
              </div>

              <p className="mt-3 inline-flex items-center gap-1 text-sm text-[#475569]">
                <MapPin className="h-4 w-4 text-[#16A34A]" />
                {member.location}
              </p>

              <p className="mt-3 line-clamp-3 text-sm text-[#475569]">{member.lastUpdate}</p>

              <div className="mt-4 flex gap-2">
                <button className="flex-1 rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm font-medium text-[#0F172A] hover:bg-[#F8FAF8]">
                  Message
                </button>
                <button className="flex-1 rounded-lg bg-[#16A34A] px-3 py-2 text-sm font-semibold text-white hover:bg-[#15803D]">
                  View Profile
                </button>
              </div>
            </article>
          ))}
        </section>

        <section className="flex flex-col gap-3 border-t border-[#E2E8F0] pt-5 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-[#64748B]">
            Showing {pagedMembers.length} of {filtered.length} members
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={safePage === 1}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#E2E8F0] bg-white text-[#0F172A] disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: totalPages }).map((_, idx) => {
              const value = idx + 1;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setPage(value)}
                  className={[
                    "h-9 min-w-9 rounded-lg px-2 text-sm font-semibold",
                    safePage === value ? "bg-[#16A34A] text-white" : "border border-[#E2E8F0] bg-white text-[#0F172A]",
                  ].join(" ")}
                >
                  {value}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={safePage === totalPages}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#E2E8F0] bg-white text-[#0F172A] disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
