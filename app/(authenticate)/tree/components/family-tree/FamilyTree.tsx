"use client";
import { useMemo, useState, useCallback, useEffect, useRef } from "react";
import { FamilyMember } from "../../types/FamilyTree";
import { useRouter } from "next/navigation";
import { TreeControls } from "./TreeControls";
import { FamilyTreeCanvas } from "./FamilyTreeCanvas";
import { GenerationList } from "./GenerationList";
import { MemberDialog } from "./MemberDialog";
import { MemberDetails } from "./MemberDetails";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { getSpouses, hasSpouse } from "../../utils/relations";

type ApiGender = "MALE" | "FEMALE" | "OTHER";

interface ApiFamilyMember {
  id: string;
  fullName: string;
  gender?: ApiGender | null;
  birthYear?: number | null;
  deathYear?: number | null;
  generation?: number | null;
  parentId?: string | null;
  spouseIds?: string[] | null;
  imageUrl?: string | null;
}

const fromApiMember = (member: ApiFamilyMember): FamilyMember => ({
  id: member.id,
  name: member.fullName,
  birthYear: member.birthYear ?? 2000,
  deathYear: member.deathYear ?? undefined,
  gender: member.gender === "FEMALE" ? "female" : "male",
  generation: member.generation ?? 1,
  parentId: member.parentId ?? undefined,
  spouseIds: member.spouseIds ?? [],
  imageUrl: member.imageUrl ?? undefined,
});

const toApiPayload = (member: Omit<FamilyMember, "id">) => ({
  fullName: member.name,
  birthYear: member.birthYear,
  deathYear: member.deathYear ?? undefined,
  gender: member.gender === "female" ? "FEMALE" : "MALE",
  generation: member.generation,
  parentId: member.parentId ?? undefined,
  spouseIds: member.spouseIds ?? [],
  imageUrl: member.imageUrl ?? undefined,
});

const sanitizeNoSingleParentChildren = (allMembers: FamilyMember[]) => {
  const validParentIds = new Set(
    allMembers.filter((m) => hasSpouse(m, allMembers)).map((m) => m.id)
  );

  const invalidIds = new Set<string>();

  // Mark children whose parent has no spouse
  allMembers.forEach((m) => {
    if (m.parentId && !validParentIds.has(m.parentId)) {
      invalidIds.add(m.id);
    }
  });

  // Cascade: if a member is removed, remove all of their descendants
  let changed = true;
  while (changed) {
    changed = false;
    allMembers.forEach((m) => {
      if (m.parentId && invalidIds.has(m.parentId) && !invalidIds.has(m.id)) {
        invalidIds.add(m.id);
        changed = true;
      }
    });
  }

  // Also remove spouses of removed members (to avoid floating spouse nodes)
  if (invalidIds.size > 0) {
    allMembers.forEach((m) => {
      if (!invalidIds.has(m.id)) return;
      const spouses = getSpouses(m, allMembers);
      spouses.forEach(spouse => invalidIds.add(spouse.id));
    });
  }

  if (invalidIds.size === 0) return allMembers;
  return allMembers.filter((m) => !invalidIds.has(m.id));
};

export const FamilyTree = () => {
  const router = useRouter();
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [zoom, setZoom] = useState(0.7);
  const [selectedGeneration, setSelectedGeneration] = useState<number | null>(null);
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [dialogSeed, setDialogSeed] = useState(0);
  const [collapsedNodes, setCollapsedNodes] = useState<Set<string>>(new Set());
  const [hoveredMemberId, setHoveredMemberId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoadingMembers, setIsLoadingMembers] = useState(true);
  const [dialogInitialValues, setDialogInitialValues] = useState<
    Partial<Omit<FamilyMember, "id">> | null
  >(null);
  const [isSpouseQuickAdd, setIsSpouseQuickAdd] = useState(false);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    member: FamilyMember;
  } | null>(null);
  const contextMenuRef = useRef<HTMLDivElement | null>(null);

  const normalizeApiError = useCallback(
    (raw?: string, fallback = "Có lỗi xảy ra") => {
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
    },
    [router],
  );

  const sanitizedMembers = useMemo(
    () => sanitizeNoSingleParentChildren(members),
    [members]
  );

  const { minGeneration, totalGenerations } = useMemo(() => {
    if (sanitizedMembers.length === 0) {
      return { minGeneration: 0, totalGenerations: 0 };
    }
    return {
      minGeneration: Math.min(...sanitizedMembers.map((m) => m.generation)),
      totalGenerations: Math.max(...sanitizedMembers.map((m) => m.generation)),
    };
  }, [sanitizedMembers]);

  const handleZoomIn = useCallback(() => {
    setZoom((prev) => Math.min(prev + 0.1, 2));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom((prev) => Math.max(prev - 0.1, 0.3));
  }, []);

  const handleReset = useCallback(() => {
    setZoom(0.7);
    setSelectedGeneration(null);
    setCollapsedNodes(new Set());
  }, []);

  // Get all descendant IDs of a member using iterative traversal.
  const getDescendantIds = useCallback(
    (memberId: string): Set<string> => {
      const descendants = new Set<string>();
      const stack = [memberId];

      while (stack.length > 0) {
        const current = stack.pop();
        if (!current) continue;

        const children = sanitizedMembers.filter((m) => m.parentId === current);
        children.forEach((child) => {
          if (!descendants.has(child.id)) {
            descendants.add(child.id);
            stack.push(child.id);
          }
        });
      }

      return descendants;
    },
    [sanitizedMembers]
  );

  const handleToggleCollapse = useCallback((memberId: string) => {
    setCollapsedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(memberId)) {
        // When expanding, also remove all descendant collapse states
        newSet.delete(memberId);
        const descendants = getDescendantIds(memberId);
        descendants.forEach(id => newSet.delete(id));
      } else {
        // When collapsing, also remove descendant collapse states (they're now hidden anyway)
        const descendants = getDescendantIds(memberId);
        descendants.forEach(id => newSet.delete(id));
        newSet.add(memberId);
      }
      return newSet;
    });
  }, [getDescendantIds]);

  const handleAddMember = useCallback(() => {
    setDialogInitialValues(null);
    setIsSpouseQuickAdd(false);
    setIsAddingNew(true);
    setEditingMember(null);
    setDialogSeed(Date.now());
    setIsDialogOpen(true);
  }, []);

  const handleEditMember = useCallback((member: FamilyMember) => {
    setDialogInitialValues(null);
    setIsSpouseQuickAdd(false);
    setIsAddingNew(false);
    setEditingMember(member);
    setDialogSeed(Date.now());
    setIsDialogOpen(true);
  }, []);

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
            return;
          }
          const created = fromApiMember(payload.data as ApiFamilyMember);
          setMembers((prev) => [...prev, created]);
          toast.success("Đã thêm thành viên mới!");
        } else if (editingMember) {
          const response = await fetch(`/api/family-members/${editingMember.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(toApiPayload(memberData)),
          });
          const payload = await response.json().catch(() => ({}));
          if (!response.ok) {
            toast.error(normalizeApiError(payload?.error, "Không thể cập nhật thành viên"));
            return;
          }
          const updated = fromApiMember(payload.data as ApiFamilyMember);
          setMembers((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
          toast.success("Đã cập nhật thông tin!");
        }
        setIsDialogOpen(false);
      } catch {
        toast.error("Lỗi kết nối khi lưu thành viên");
      }
    },
    [isAddingNew, editingMember, normalizeApiError]
  );

  const handleDeleteMember = useCallback(async () => {
    if (!editingMember) return;
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
      setSelectedMember(null);
      toast.success("Đã xóa thành viên!");
    } catch {
      toast.error("Lỗi kết nối khi xóa thành viên");
    }
  }, [editingMember, normalizeApiError]);

  const handleMemberClick = useCallback((member: FamilyMember) => {
    setContextMenu(null);
    setSelectedMember(member);
  }, []);

  const handleMemberContextMenu = useCallback(
    (member: FamilyMember, position: { clientX: number; clientY: number }) => {
      const menuWidth = 220;
      const menuHeight = 110;
      const safeX =
        typeof window === "undefined"
          ? position.clientX
          : Math.min(position.clientX, window.innerWidth - menuWidth - 12);
      const safeY =
        typeof window === "undefined"
          ? position.clientY
          : Math.min(position.clientY, window.innerHeight - menuHeight - 12);

      setContextMenu({
        member,
        x: Math.max(12, safeX),
        y: Math.max(12, safeY),
      });
    },
    [],
  );

  const handleAddChildFromContext = useCallback(() => {
    if (!contextMenu) return;
    setIsSpouseQuickAdd(false);
    setDialogInitialValues({
      parentId: contextMenu.member.id,
      generation: contextMenu.member.generation + 1,
      spouseIds: [],
    });
    setIsAddingNew(true);
    setEditingMember(null);
    setDialogSeed(Date.now());
    setIsDialogOpen(true);
    setContextMenu(null);
  }, [contextMenu]);

  const handleAddSpouseFromContext = useCallback(() => {
    if (!contextMenu) return;
    setIsSpouseQuickAdd(true);
    setDialogInitialValues({
      parentId: undefined,
      generation: contextMenu.member.generation,
      spouseIds: [contextMenu.member.id],
    });
    setIsAddingNew(true);
    setEditingMember(null);
    setDialogSeed(Date.now());
    setIsDialogOpen(true);
    setContextMenu(null);
  }, [contextMenu]);

  // Get potential parents (members who can have children) - must have a spouse
  const potentialParents = sanitizedMembers.filter(
    (m) => m.generation < 6 && hasSpouse(m, sanitizedMembers)
  );

  useEffect(() => {
    if (!isFullscreen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsFullscreen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isFullscreen]);

  useEffect(() => {
    if (!contextMenu) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (
        contextMenuRef.current &&
        event.target instanceof Node &&
        contextMenuRef.current.contains(event.target)
      ) {
        return;
      }
      setContextMenu(null);
    };

    const handleGlobalContextMenu = (event: MouseEvent) => {
      if (
        contextMenuRef.current &&
        event.target instanceof Node &&
        contextMenuRef.current.contains(event.target)
      ) {
        return;
      }
      setContextMenu(null);
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setContextMenu(null);
      }
    };

    const closeMenu = () => setContextMenu(null);

    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("contextmenu", handleGlobalContextMenu);
    window.addEventListener("wheel", closeMenu, { passive: true });
    window.addEventListener("scroll", closeMenu, true);
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("contextmenu", handleGlobalContextMenu);
      window.removeEventListener("wheel", closeMenu);
      window.removeEventListener("scroll", closeMenu, true);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [contextMenu]);

  useEffect(() => {
    const loadMembers = async () => {
      setIsLoadingMembers(true);
      try {
        const response = await fetch("/api/family-members", { method: "GET" });
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) {
          toast.error(normalizeApiError(payload?.error, "Không thể tải dữ liệu gia phả"));
          setMembers([]);
          return;
        }
        const list = (payload?.data ?? []) as ApiFamilyMember[];
        setMembers(list.map(fromApiMember));
      } catch {
        toast.error("Lỗi kết nối khi tải dữ liệu gia phả");
        setMembers([]);
      } finally {
        setIsLoadingMembers(false);
      }
    };

    loadMembers();
  }, [normalizeApiError]);

  useEffect(() => {
    if (!isFullscreen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isFullscreen]);

  return (
    <div className="min-h-screen bg-[#F8FAF8] p-6">
      <div
        className={[
          "mx-auto max-w-7xl space-y-6",
          isFullscreen
            ? "fixed inset-0 z-50 max-w-none overflow-auto bg-[#F8FAF8] p-6"
            : "",
        ].join(" ")}
      >
        {/* Header */}
        <div className="space-y-2 text-center">
          <h1 className="text-4xl font-serif font-bold text-[#0F172A]">
            Gia Phả Dòng Họ
          </h1>
          <p className="text-[#475569]">
            Quản lý và xem thông tin các thành viên trong gia đình
          </p>
        </div>

        {/* Controls */}
        <TreeControls
          zoom={zoom}
          selectedGeneration={selectedGeneration}
          totalGenerations={totalGenerations}
          minGeneration={minGeneration}
          memberCount={sanitizedMembers.length}
          searchQuery={searchQuery}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onReset={handleReset}
          onGenerationChange={setSelectedGeneration}
          onAddMember={handleAddMember}
          onSearchChange={setSearchQuery}
          isFullscreen={isFullscreen}
          onToggleFullscreen={() => setIsFullscreen((prev) => !prev)}
        />

        {/* Main Content - Full Width */}
        <Tabs defaultValue="tree" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="tree">Sơ đồ cây</TabsTrigger>
            <TabsTrigger value="list">Danh sách theo đời</TabsTrigger>
          </TabsList>

          <TabsContent value="tree">
            {isLoadingMembers ? (
              <div className="rounded-xl border border-[#E2E8F0] bg-white p-10 text-center text-sm text-[#475569]">
                Đang tải dữ liệu gia phả...
              </div>
            ) : sanitizedMembers.length === 0 ? (
              <div className="rounded-xl border border-[#E2E8F0] bg-white p-10 text-center">
                <h3 className="text-lg font-semibold text-[#0F172A]">Chưa có dữ liệu gia phả</h3>
                <p className="mt-2 text-sm text-[#475569]">
                  Hãy thêm thành viên đầu tiên để bắt đầu xây dựng cây gia phả.
                </p>
              </div>
            ) : (
              <FamilyTreeCanvas
                members={sanitizedMembers}
                zoom={zoom}
                selectedGeneration={selectedGeneration}
                searchQuery={searchQuery}
                onMemberClick={handleMemberClick}
                onMemberContextMenu={handleMemberContextMenu}
                selectedMemberId={selectedMember?.id}
                collapsedNodes={collapsedNodes}
                onToggleCollapse={handleToggleCollapse}
                hoveredMemberId={hoveredMemberId}
                onMemberHover={setHoveredMemberId}
                onZoomChange={setZoom}
              />
            )}
          </TabsContent>

          <TabsContent value="list" className="space-y-4">
            {(selectedGeneration !== null
              ? [selectedGeneration]
              : Array.from({ length: totalGenerations - minGeneration + 1 }, (_, i) => minGeneration + i)
            ).map((gen) => (
              <GenerationList
                key={gen}
                members={sanitizedMembers}
                generation={gen}
                onMemberClick={handleMemberClick}
                onMemberEdit={handleEditMember}
                selectedMemberId={selectedMember?.id}
              />
            ))}
          </TabsContent>
        </Tabs>

        {/* Member Details Dialog */}
        <MemberDetails
          member={selectedMember}
          allMembers={sanitizedMembers}
          onEdit={handleEditMember}
          onClose={() => setSelectedMember(null)}
        />

        {/* Member Dialog */}
        <MemberDialog
          key={`${isAddingNew ? "new-member" : "edit-member"}-${dialogSeed}-${editingMember?.id ?? ""}`}
          open={isDialogOpen}
          member={isAddingNew ? null : editingMember}
          initialValues={isAddingNew ? dialogInitialValues ?? undefined : undefined}
          lockParentSelection={isAddingNew && isSpouseQuickAdd}
          allMembers={sanitizedMembers}
          parents={potentialParents}
          onClose={() => setIsDialogOpen(false)}
          onSave={handleSaveMember}
          onDelete={isAddingNew ? undefined : handleDeleteMember}
        />

        {contextMenu && (
          <div
            ref={contextMenuRef}
            className="fixed z-[120] w-56 overflow-hidden rounded-xl border border-[#BBF7D0] bg-white/95 shadow-xl backdrop-blur"
            style={{ left: contextMenu.x, top: contextMenu.y }}
          >
            <div className="border-b border-[#DCFCE7] bg-[#F0FDF4] px-3 py-2">
              <p className="line-clamp-1 text-xs font-semibold text-[#166534]">{contextMenu.member.name}</p>
            </div>
            <button
              type="button"
              onClick={handleAddChildFromContext}
              className="flex w-full flex-col items-start gap-0.5 px-3 py-2 text-left transition hover:bg-[#F8FAFC]"
            >
              <span className="text-sm font-medium text-[#0F172A]">Thêm con</span>
              <span className="text-xs text-[#64748B]">Tự gán cha/mẹ là thành viên đang chọn</span>
            </button>
            <button
              type="button"
              onClick={handleAddSpouseFromContext}
              className="flex w-full flex-col items-start gap-0.5 border-t border-[#F1F5F9] px-3 py-2 text-left transition hover:bg-[#F8FAFC]"
            >
              <span className="text-sm font-medium text-[#0F172A]">Thêm vợ/chồng</span>
              <span className="text-xs text-[#64748B]">Tự gán quan hệ hôn nhân với thành viên này</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
