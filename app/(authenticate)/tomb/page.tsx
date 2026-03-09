"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  CalendarDays,
  MapPin,
  Search,
  Sparkles,
  Trees,
  Users,
} from "lucide-react";
import MemberDetailModal from "./components/MemberDetailModal";
import { familyMembers, type FamilyMember } from "./data/familyMembers";

const normalizeImagePath = (path?: string) => {
  if (!path) return "/images/grave-1.jpg";
  if (path.startsWith("/assets/")) {
    return path.replace("/assets/", "/images/");
  }
  return path;
};

export default function TombPage() {
  const [query, setQuery] = useState("");
  const [relationFilter, setRelationFilter] = useState("all");
  const [cemeteryFilter, setCemeteryFilter] = useState("all");
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const relationOptions = useMemo(
    () => Array.from(new Set(familyMembers.map((member) => member.relation))).sort((a, b) => a.localeCompare(b, "vi")),
    [],
  );
  const cemeteryOptions = useMemo(
    () => Array.from(new Set(familyMembers.map((member) => member.cemetery))).sort((a, b) => a.localeCompare(b, "vi")),
    [],
  );

  const filteredMembers = useMemo(() => {
    const q = query.trim().toLowerCase();
    return familyMembers.filter((member) => {
      const matchKeyword =
        !q ||
        member.name.toLowerCase().includes(q) ||
        member.location.toLowerCase().includes(q) ||
        member.cemetery.toLowerCase().includes(q);
      const matchRelation = relationFilter === "all" || member.relation === relationFilter;
      const matchCemetery = cemeteryFilter === "all" || member.cemetery === cemeteryFilter;
      return matchKeyword && matchRelation && matchCemetery;
    });
  }, [cemeteryFilter, query, relationFilter]);

  const stats = useMemo(() => {
    const total = familyMembers.length;
    const avgLife =
      familyMembers.reduce((sum, member) => sum + (Number(member.deathYear) - Number(member.birthYear)), 0) / total;
    return {
      total,
      cemeteryCount: cemeteryOptions.length,
      avgLife: Math.round(avgLife),
    };
  }, [cemeteryOptions.length]);

  const openMember = (member: FamilyMember) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedMember(null), 250);
  };

  return (
    <main className="min-h-screen bg-[#F6F8F7] px-4 py-8 text-[#0F172A] md:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="relative overflow-hidden rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-sm md:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(22,163,74,0.14),_transparent_46%),radial-gradient(circle_at_bottom_left,_rgba(15,23,42,0.08),_transparent_42%)]" />
          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#16A34A]/30 bg-[#DCFCE7] px-3 py-1 text-xs font-medium text-[#166534]">
              <Sparkles className="h-3.5 w-3.5" />
              Memorial Archive
            </span>
            <h1 className="mt-4 text-3xl font-bold leading-tight md:text-5xl">
              Mộ phần người thân đã khuất
            </h1>
            <p className="mt-3 max-w-3xl text-sm text-[#475569] md:text-base">
              Không gian lưu trữ hình ảnh, vị trí và thông tin an nghỉ của những người thân trong gia đình.
            </p>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <article className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
            <p className="text-xs text-[#64748B]">Người đã an nghỉ</p>
            <p className="mt-2 text-3xl font-bold text-[#0F172A]">{stats.total}</p>
            <p className="mt-1 text-xs text-[#475569]">Toàn bộ hồ sơ mộ phần</p>
          </article>
          <article className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
            <p className="text-xs text-[#64748B]">Nghĩa trang</p>
            <p className="mt-2 text-3xl font-bold text-[#0F172A]">{stats.cemeteryCount}</p>
            <p className="mt-1 text-xs text-[#475569]">Điểm an táng khác nhau</p>
          </article>
          <article className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
            <p className="text-xs text-[#64748B]">Tuổi thọ trung bình</p>
            <p className="mt-2 text-3xl font-bold text-[#0F172A]">{stats.avgLife}</p>
            <p className="mt-1 text-xs text-[#475569]">Dựa trên dữ liệu hiện có</p>
          </article>
        </section>

        <section className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
          <div className="grid gap-3 md:grid-cols-[1.3fr_1fr_1fr]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Tìm theo tên hoặc địa điểm..."
                className="w-full rounded-lg border border-[#E2E8F0] bg-white py-2.5 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20"
              />
            </div>
            <select
              value={relationFilter}
              onChange={(event) => setRelationFilter(event.target.value)}
              className="rounded-lg border border-[#E2E8F0] bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20"
            >
              <option value="all">Tất cả quan hệ</option>
              {relationOptions.map((relation) => (
                <option key={relation} value={relation}>
                  {relation}
                </option>
              ))}
            </select>
            <select
              value={cemeteryFilter}
              onChange={(event) => setCemeteryFilter(event.target.value)}
              className="rounded-lg border border-[#E2E8F0] bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20"
            >
              <option value="all">Tất cả nghĩa trang</option>
              {cemeteryOptions.map((cemetery) => (
                <option key={cemetery} value={cemetery}>
                  {cemetery}
                </option>
              ))}
            </select>
          </div>
        </section>

        <section className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="inline-flex items-center gap-2 text-lg font-semibold text-[#0F172A]">
              <Trees className="h-5 w-5 text-[#16A34A]" />
              Danh sách mộ phần
            </h2>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#E2E8F0] bg-[#F8FAF8] px-3 py-1 text-xs text-[#475569]">
              <Users className="h-3.5 w-3.5 text-[#16A34A]" />
              {filteredMembers.length} hồ sơ
            </span>
          </div>

          {filteredMembers.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#CBD5E1] bg-[#F8FAF8] p-8 text-center text-sm text-[#64748B]">
              Không tìm thấy hồ sơ mộ phần phù hợp bộ lọc.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredMembers.map((member, index) => (
                <motion.article
                  key={member.id}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: index * 0.04 }}
                  viewport={{ once: true, margin: "-20px" }}
                  onClick={() => openMember(member)}
                  className="group cursor-pointer overflow-hidden rounded-2xl border border-[#E2E8F0] bg-[#FCFDFC] transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="relative h-48 overflow-hidden bg-[#F1F5F9]">
                    <Image
                      src={normalizeImagePath(member.graveImages?.[0])}
                      alt={member.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                    <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-[#166534]">
                      {member.relation}
                    </span>
                  </div>
                  <div className="space-y-2 p-4">
                    <h3 className="text-lg font-semibold text-[#0F172A]">{member.name}</h3>
                    <p className="inline-flex items-center gap-1.5 text-sm text-[#475569]">
                      <CalendarDays className="h-4 w-4 text-[#16A34A]" />
                      {member.birthYear} — {member.deathYear}
                    </p>
                    <p className="inline-flex items-center gap-1.5 text-sm text-[#475569]">
                      <MapPin className="h-4 w-4 text-[#16A34A]" />
                      {member.cemetery}
                    </p>
                    <p className="line-clamp-1 text-xs text-[#64748B]">{member.location}</p>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </section>
      </div>

      <MemberDetailModal member={selectedMember} isOpen={isModalOpen} onClose={closeModal} />
    </main>
  );
}
