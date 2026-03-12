"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { MemberDialog } from "../tree/components/family-tree/MemberDialog";
import type { FamilyMember } from "../tree/types/FamilyTree";

type ApiGender = "MALE" | "FEMALE" | "OTHER";

interface ApiFamilyMember {
  id: string;
  fullName: string;
  gender?: ApiGender | null;
  birthYear?: number | null;
  deathYear?: number | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  phone?: string | null;
  generation?: number | null;
  parentId?: string | null;
  spouseIds?: string[] | null;
  imageUrl?: string | null;
}

type SortMode = "generation-asc" | "generation-desc" | "name-asc" | "name-desc";

const fromApiMember = (member: ApiFamilyMember): FamilyMember => ({
  id: member.id,
  name: member.fullName,
  birthYear: member.birthYear ?? undefined,
  deathYear: member.deathYear ?? undefined,
  address: member.address ?? undefined,
  city: member.city ?? undefined,
  country: member.country ?? undefined,
  phone: member.phone ?? undefined,
  gender:
    member.gender === "FEMALE"
      ? "female"
      : member.gender === "MALE"
        ? "male"
        : "other",
  generation: member.generation ?? 1,
  parentId: member.parentId ?? undefined,
  spouseIds: member.spouseIds ?? [],
  imageUrl: member.imageUrl ?? undefined,
});

const toApiPayload = (member: Omit<FamilyMember, "id">) => ({
  fullName: member.name,
  birthYear: member.birthYear,
  deathYear: member.deathYear ?? undefined,
  address: member.address?.trim() || undefined,
  city: member.city?.trim() || undefined,
  country: member.country?.trim() || undefined,
  phone: member.phone?.trim() || undefined,
  gender:
    member.gender === "female"
      ? "FEMALE"
      : member.gender === "male"
        ? "MALE"
        : "OTHER",
  generation: member.generation,
  parentId: member.parentId ?? undefined,
  spouseIds: member.spouseIds ?? [],
  imageUrl: member.imageUrl ?? undefined,
});

export default function PeoplePage() {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [generationFilter, setGenerationFilter] = useState("all");
  const [genderFilter, setGenderFilter] = useState("all");
  const [relationFilter, setRelationFilter] = useState("all");
  const [sortMode, setSortMode] = useState<SortMode>("generation-asc");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);
  const [dialogSeed, setDialogSeed] = useState(0);

  const normalizeApiError = (raw?: string, fallback = "Có lỗi xảy ra") => {
    if (!raw) return fallback;
    if (raw === "No active tenant selected") return "Bạn chưa chọn cây gia phả đang hoạt động.";
    if (raw.includes("Forbidden")) return "Bạn không có quyền thao tác.";
    return raw;
  };

  const loadMembers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/family-members", { method: "GET" });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        toast.error(normalizeApiError(payload?.error, "Không thể tải danh sách thành viên"));
        setMembers([]);
        return;
      }
      const list = (payload?.data ?? []) as ApiFamilyMember[];
      setMembers(list.map(fromApiMember));
    } catch {
      toast.error("Lỗi kết nối khi tải danh sách thành viên");
      setMembers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  const parentById = useMemo(() => new Map(members.map((m) => [m.id, m])), [members]);

  const generationOptions = useMemo(
    () => Array.from(new Set(members.map((m) => m.generation))).sort((a, b) => a - b),
    [members],
  );

  const filteredMembers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = members.filter((member) => {
      const parent = member.parentId ? parentById.get(member.parentId) : undefined;
      const location = [member.city, member.country].filter(Boolean).join(", ");

      const matchesQuery =
        !q ||
        member.name.toLowerCase().includes(q) ||
        (member.phone ?? "").toLowerCase().includes(q) ||
        location.toLowerCase().includes(q) ||
        (parent?.name ?? "").toLowerCase().includes(q);

      const matchesGeneration =
        generationFilter === "all" || member.generation === Number(generationFilter);

      const matchesGender = genderFilter === "all" || member.gender === genderFilter;

      const hasParent = Boolean(member.parentId);
      const hasSpouse = (member.spouseIds?.length ?? 0) > 0;
      const matchesRelation =
        relationFilter === "all" ||
        (relationFilter === "has-parent" && hasParent) ||
        (relationFilter === "no-parent" && !hasParent) ||
        (relationFilter === "has-spouse" && hasSpouse) ||
        (relationFilter === "no-spouse" && !hasSpouse);

      return matchesQuery && matchesGeneration && matchesGender && matchesRelation;
    });

    return [...list].sort((a, b) => {
      if (sortMode === "generation-asc") {
        return a.generation - b.generation || a.name.localeCompare(b.name, "vi");
      }
      if (sortMode === "generation-desc") {
        return b.generation - a.generation || a.name.localeCompare(b.name, "vi");
      }
      if (sortMode === "name-desc") {
        return b.name.localeCompare(a.name, "vi");
      }
      return a.name.localeCompare(b.name, "vi");
    });
  }, [searchQuery, members, generationFilter, genderFilter, relationFilter, sortMode, parentById]);

  const handleAddMember = () => {
    setIsAddingNew(true);
    setEditingMember(null);
    setDialogSeed(Date.now());
    setIsDialogOpen(true);
  };

  const handleEditMember = (member: FamilyMember) => {
    setIsAddingNew(false);
    setEditingMember(member);
    setDialogSeed(Date.now());
    setIsDialogOpen(true);
  };

  const handleSaveMember = useCallback(
    async (memberData: Omit<FamilyMember, "id">) => {
      try {
        if (isAddingNew) {
          const response = await fetch("/api/family-members", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(toApiPayload(memberData)),
          });
          const payload = await response.json().catch(() => ({}));
          if (!response.ok) {
            toast.error(normalizeApiError(payload?.error, "Không thể thêm thành viên"));
            return false;
          }
          const created = fromApiMember(payload.data as ApiFamilyMember);
          setMembers((prev) => [...prev, created]);
          toast.success("Đã thêm thành viên mới");
          return true;
        }

        if (!editingMember) return false;

        const response = await fetch(`/api/family-members/${editingMember.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(toApiPayload(memberData)),
        });
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) {
          toast.error(normalizeApiError(payload?.error, "Không thể cập nhật thành viên"));
          return false;
        }
        const updated = fromApiMember(payload.data as ApiFamilyMember);
        setMembers((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
        toast.success("Đã cập nhật thành viên");
        return true;
      } catch {
        toast.error("Lỗi kết nối khi lưu thành viên");
        return false;
      }
    },
    [isAddingNew, editingMember],
  );

  const handleDeleteMember = useCallback(async () => {
    if (!editingMember) return;
    const confirmed = window.confirm(`Xóa thành viên "${editingMember.name}"?`);
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/family-members/${editingMember.id}`, {
        method: "DELETE",
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        toast.error(normalizeApiError(payload?.error, "Không thể xóa thành viên"));
        return;
      }
      setMembers((prev) => prev.filter((m) => m.id !== editingMember.id));
      setIsDialogOpen(false);
      toast.success("Đã xóa thành viên");
    } catch {
      toast.error("Lỗi kết nối khi xóa thành viên");
    }
  }, [editingMember]);

  const parents = useMemo(() => members.filter((m) => m.generation < 20), [members]);
  const allFilteredSelected =
    filteredMembers.length > 0 && filteredMembers.every((member) => selectedIds.has(member.id));

  const toggleSelected = (memberId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(memberId)) {
        next.delete(memberId);
      } else {
        next.add(memberId);
      }
      return next;
    });
  };

  const toggleSelectAllFiltered = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allFilteredSelected) {
        filteredMembers.forEach((member) => next.delete(member.id));
      } else {
        filteredMembers.forEach((member) => next.add(member.id));
      }
      return next;
    });
  };

  const handleBulkDelete = async () => {
    const targetIds = Array.from(selectedIds);
    if (targetIds.length === 0) {
      toast.error("Chưa chọn thành viên để xóa");
      return;
    }
    const confirmed = window.confirm(`Xóa ${targetIds.length} thành viên đã chọn?`);
    if (!confirmed) return;

    let success = 0;
    let failed = 0;
    await Promise.all(
      targetIds.map(async (memberId) => {
        try {
          const response = await fetch(`/api/family-members/${memberId}`, {
            method: "DELETE",
          });
          if (!response.ok) {
            failed += 1;
            return;
          }
          success += 1;
        } catch {
          failed += 1;
        }
      }),
    );

    if (success > 0) {
      setMembers((prev) => prev.filter((member) => !selectedIds.has(member.id)));
      setSelectedIds(new Set());
      toast.success(`Đã xóa ${success} thành viên`);
    }
    if (failed > 0) {
      toast.error(`${failed} thành viên không xóa được`);
    }
  };

  const handleExportCsv = () => {
    const rows = filteredMembers.map((member) => {
      const parent = member.parentId ? parentById.get(member.parentId) : undefined;
      const spouses = (member.spouseIds ?? [])
        .map((id) => parentById.get(id)?.name)
        .filter(Boolean)
        .join(" | ");

      return [
        member.id,
        member.name,
        member.gender,
        String(member.generation),
        parent?.name ?? "",
        spouses,
        member.phone ?? "",
        member.birthYear?.toString() ?? "",
        member.deathYear?.toString() ?? "",
        member.city ?? "",
        member.country ?? "",
      ];
    });

    const headers = [
      "id",
      "name",
      "gender",
      "generation",
      "parent_name",
      "spouses",
      "phone",
      "birth_year",
      "death_year",
      "city",
      "country",
    ];
    const escapeCell = (cell: string) => `"${cell.replace(/"/g, '""')}"`;
    const csv = [headers, ...rows].map((line) => line.map((cell) => escapeCell(cell)).join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `danh-ba-export-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen bg-[#F8FAF8] px-4 py-8 text-[#0F172A] md:px-8">
      <div className="mx-auto max-w-7xl space-y-5">
        <section className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-bold md:text-4xl">Danh bạ</h1>
              <p className="mt-2 text-sm text-[#475569]">
                Danh bạ quản trị thành viên. Tìm nhanh, lọc theo đời và chỉnh sửa dữ liệu trực tiếp.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/tree"
                className="inline-flex items-center rounded-lg border border-[#E2E8F0] px-4 py-2.5 text-sm font-medium hover:bg-[#F8FAF8]"
              >
                Xem sơ đồ cây
              </Link>
              <button
                type="button"
                onClick={handleAddMember}
                className="inline-flex items-center gap-2 rounded-lg bg-[#16A34A] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#15803D]"
              >
                <Plus className="h-4 w-4" />
                Thêm thành viên
              </button>
              <button
                type="button"
                onClick={handleExportCsv}
                className="inline-flex items-center rounded-lg border border-[#E2E8F0] px-4 py-2.5 text-sm font-medium hover:bg-[#F8FAF8]"
              >
                Export CSV
              </button>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            <label className="relative block md:col-span-2 xl:col-span-2">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm theo tên, cha/mẹ, vị trí, số điện thoại..."
                className="w-full rounded-lg border border-[#E2E8F0] bg-white py-2.5 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20"
              />
            </label>

            <select
              value={generationFilter}
              onChange={(e) => setGenerationFilter(e.target.value)}
              className="rounded-lg border border-[#E2E8F0] bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20"
            >
              <option value="all">Tất cả đời</option>
              {generationOptions.map((generation) => (
                <option key={generation} value={generation}>
                  Đời {generation}
                </option>
              ))}
            </select>

            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              className="rounded-lg border border-[#E2E8F0] bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20"
            >
              <option value="all">Tất cả giới tính</option>
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
              <option value="other">Khác/Không rõ</option>
            </select>

            <select
              value={relationFilter}
              onChange={(e) => setRelationFilter(e.target.value)}
              className="rounded-lg border border-[#E2E8F0] bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20"
            >
              <option value="all">Quan hệ (tất cả)</option>
              <option value="has-parent">Có cha/mẹ</option>
              <option value="no-parent">Không có cha/mẹ</option>
              <option value="has-spouse">Có vợ/chồng</option>
              <option value="no-spouse">Chưa có vợ/chồng</option>
            </select>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <label className="text-sm font-medium text-[#334155]">Sắp xếp:</label>
            <select
              value={sortMode}
              onChange={(e) => setSortMode(e.target.value as SortMode)}
              className="rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20"
            >
              <option value="generation-asc">Đời tăng dần</option>
              <option value="generation-desc">Đời giảm dần</option>
              <option value="name-asc">Tên A-Z</option>
              <option value="name-desc">Tên Z-A</option>
            </select>
            <span className="rounded-lg bg-[#F1F5F9] px-2 py-1 text-xs text-[#475569]">
              {filteredMembers.length} thành viên
            </span>
            <span className="rounded-lg bg-[#DCFCE7] px-2 py-1 text-xs text-[#166534]">
              Đã chọn: {selectedIds.size}
            </span>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-[#E2E8F0] pt-3">
            <button
              type="button"
              onClick={handleBulkDelete}
              className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              Xóa đã chọn
            </button>
          </div>
        </section>

        <section className="rounded-2xl border border-[#E2E8F0] bg-white shadow-sm">
          {loading ? (
            <div className="p-6 text-sm text-[#64748B]">Đang tải dữ liệu thành viên...</div>
          ) : filteredMembers.length === 0 ? (
            <div className="p-6 text-sm text-[#64748B]">Không có thành viên phù hợp bộ lọc hiện tại.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[#E2E8F0]">
                <thead className="bg-[#F8FAF8]">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                      <input
                        type="checkbox"
                        checked={allFilteredSelected}
                        onChange={toggleSelectAllFiltered}
                        aria-label="Chọn tất cả"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#64748B]">Thành viên</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#64748B]">Giới tính</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#64748B]">Đời</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#64748B]">Cha/Mẹ</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#64748B]">Vợ/Chồng</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#64748B]">Liên hệ</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[#64748B]">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0] bg-white">
                  {filteredMembers.map((member) => {
                    const parent = member.parentId ? parentById.get(member.parentId) : undefined;
                    const spouseNames = (member.spouseIds ?? [])
                      .map((id) => parentById.get(id)?.name)
                      .filter(Boolean) as string[];
                    const genderLabel =
                      member.gender === "male" ? "Nam" : member.gender === "female" ? "Nữ" : "Khác";
                    const location = [member.city, member.country].filter(Boolean).join(", ");
                    return (
                      <tr key={member.id}>
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selectedIds.has(member.id)}
                            onChange={() => toggleSelected(member.id)}
                            aria-label={`Chọn ${member.name}`}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-[#0F172A]">{member.name}</p>
                          <p className="text-xs text-[#64748B]">
                            {member.birthYear ?? "?"}
                            {member.deathYear ? ` - ${member.deathYear}` : " - nay"}
                          </p>
                        </td>
                        <td className="px-4 py-3 text-sm text-[#334155]">{genderLabel}</td>
                        <td className="px-4 py-3 text-sm text-[#334155]">Đời {member.generation}</td>
                        <td className="px-4 py-3 text-sm text-[#334155]">{parent?.name ?? "Chưa gán"}</td>
                        <td className="px-4 py-3 text-sm text-[#334155]">
                          {spouseNames.length > 0 ? spouseNames.join(", ") : "Chưa gán"}
                        </td>
                        <td className="px-4 py-3 text-sm text-[#334155]">
                          <p>{member.phone ?? "-"}</p>
                          <p className="text-xs text-[#64748B]">{location || "-"}</p>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleEditMember(member)}
                              className="rounded-lg border border-[#E2E8F0] px-3 py-1.5 text-sm hover:bg-[#F8FAF8]"
                            >
                              Sửa
                            </button>
                            <Link
                              href={`/tree?memberId=${member.id}`}
                              className="rounded-lg border border-[#E2E8F0] px-3 py-1.5 text-sm hover:bg-[#F8FAF8]"
                            >
                              Xem cây
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      <MemberDialog
        key={`${isAddingNew ? "new-member" : "edit-member"}-${dialogSeed}-${editingMember?.id ?? ""}`}
        open={isDialogOpen}
        member={isAddingNew ? null : editingMember}
        allMembers={members}
        parents={parents}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSaveMember}
        onDelete={isAddingNew ? undefined : handleDeleteMember}
      />
    </main>
  );
}
