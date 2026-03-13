"use client";
import { useMemo, useState, useCallback, useEffect, useRef } from "react";
import { FamilyMember } from "../../types/FamilyTree";
import { useRouter, useSearchParams } from "next/navigation";
import { TreeControls } from "./TreeControls";
import { FamilyTreeCanvas } from "./FamilyTreeCanvas";
import { GenerationList } from "./GenerationList";
import { MemberDialog } from "./MemberDialog";
import { MemberDetails } from "./MemberDetails";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { getSpouses } from "../../utils/relations";

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

export const FamilyTree = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
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
  const [isAutoFixingGenerations, setIsAutoFixingGenerations] = useState(false);
  const [dialogInitialValues, setDialogInitialValues] = useState<
    Partial<Omit<FamilyMember, "id">> | null
  >(null);
  const [isSpouseQuickAdd, setIsSpouseQuickAdd] = useState(false);
  const [isChildQuickAdd, setIsChildQuickAdd] = useState(false);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    member: FamilyMember;
  } | null>(null);
  const contextMenuRef = useRef<HTMLDivElement | null>(null);
  const printAreaRef = useRef<HTMLDivElement | null>(null);
  const focusedQueryMemberRef = useRef<string | null>(null);

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

  const { minGeneration, totalGenerations } = useMemo(() => {
    if (members.length === 0) {
      return { minGeneration: 0, totalGenerations: 0 };
    }
    return {
      minGeneration: Math.min(...members.map((m) => m.generation)),
      totalGenerations: Math.max(...members.map((m) => m.generation)),
    };
  }, [members]);

  const dataIntegrityWarnings = useMemo(() => {
    const memberById = new Map(members.map((member) => [member.id, member]));
    const missingParentMembers = members.filter(
      (member) => member.parentId && !memberById.has(member.parentId),
    );
    const parentGenerationMismatchMembers = members.filter((member) => {
      if (!member.parentId) return false;
      const parent = memberById.get(member.parentId);
      if (!parent) return false;
      return member.generation !== parent.generation + 1;
    });
    const singleParentMembers = members.filter((member) => {
      if (!member.parentId) return false;
      const parent = memberById.get(member.parentId);
      if (!parent) return false;
      return getSpouses(parent, members).length === 0;
    });

    return {
      missingParentMembers,
      parentGenerationMismatchMembers,
      singleParentMembers,
      total:
        missingParentMembers.length +
        parentGenerationMismatchMembers.length +
        singleParentMembers.length,
    };
  }, [members]);

  const handleReset = useCallback(() => {
    setZoom(0.7);
    setSelectedGeneration(null);
    setCollapsedNodes(new Set());
  }, []);

  const handlePrintTree = useCallback(() => {
    if (typeof window === "undefined") return;
    if (!printAreaRef.current) {
      toast.error("Không tìm thấy khu vực cây để in.");
      return;
    }
    const existingRoot = document.getElementById("tree-print-clone-root");
    if (existingRoot) {
      existingRoot.remove();
    }

    const cloneRoot = document.createElement("div");
    cloneRoot.id = "tree-print-clone-root";
    const cloneTree = printAreaRef.current.cloneNode(true);
    cloneRoot.appendChild(cloneTree);
    document.body.appendChild(cloneRoot);

    const styleTag = document.createElement("style");
    styleTag.id = "tree-print-style";
    styleTag.innerHTML = `
      #tree-print-clone-root {
        display: none;
      }
      @media print {
        body * {
          visibility: hidden !important;
        }
        #tree-print-clone-root {
          display: block !important;
          position: fixed !important;
          inset: 0 !important;
          z-index: 999999 !important;
          background: #fff !important;
          padding: 0 !important;
          margin: 0 !important;
        }
        #tree-print-clone-root, #tree-print-clone-root * {
          visibility: visible !important;
        }
        #tree-print-clone-root .tree-content {
          left: 0 !important;
          transform-origin: top left !important;
        }
      }
    `;
    document.head.appendChild(styleTag);

    const cleanup = () => {
      styleTag.remove();
      cloneRoot.remove();
      window.removeEventListener("afterprint", cleanup);
    };

    window.addEventListener("afterprint", cleanup);
    window.print();
  }, []);

  const handleAutoFixGenerationMismatch = useCallback(async () => {
    if (isAutoFixingGenerations) return;
    setIsAutoFixingGenerations(true);

    try {
      const memberById = new Map(members.map((member) => [member.id, member]));
      const resolvedGeneration = new Map<string, number>();
      const visiting = new Set<string>();

      const resolveGeneration = (memberId: string): number => {
        if (resolvedGeneration.has(memberId)) {
          return resolvedGeneration.get(memberId)!;
        }
        if (visiting.has(memberId)) {
          throw new Error("Cycle detected");
        }

        const member = memberById.get(memberId);
        if (!member) {
          throw new Error("Member not found");
        }

        visiting.add(memberId);

        let nextGeneration = member.generation;
        if (member.parentId) {
          const parent = memberById.get(member.parentId);
          if (parent) {
            nextGeneration = resolveGeneration(parent.id) + 1;
          }
        }

        visiting.delete(memberId);
        resolvedGeneration.set(memberId, nextGeneration);
        return nextGeneration;
      };

      members.forEach((member) => resolveGeneration(member.id));

      const mismatches = members
        .map((member) => ({
          id: member.id,
          currentGeneration: member.generation,
          nextGeneration: resolvedGeneration.get(member.id) ?? member.generation,
        }))
        .filter((row) => row.currentGeneration !== row.nextGeneration)
        .sort((a, b) => a.nextGeneration - b.nextGeneration);

      if (mismatches.length === 0) {
        toast.success("Không có dữ liệu lệch đời để tự sửa.");
        return;
      }

      const updatedGenerationById = new Map<string, number>();
      let failedCount = 0;

      for (const row of mismatches) {
        try {
          const response = await fetch(`/api/family-members/${row.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ generation: row.nextGeneration }),
          });

          if (!response.ok) {
            failedCount += 1;
            continue;
          }

          updatedGenerationById.set(row.id, row.nextGeneration);
        } catch {
          failedCount += 1;
        }
      }

      if (updatedGenerationById.size > 0) {
        setMembers((prev) =>
          prev.map((member) =>
            updatedGenerationById.has(member.id)
              ? { ...member, generation: updatedGenerationById.get(member.id)! }
              : member,
          ),
        );
        toast.success(`Đã tự sửa đời cho ${updatedGenerationById.size} thành viên.`);
      }

      if (failedCount > 0) {
        toast.error(`${failedCount} thành viên chưa sửa được, vui lòng kiểm tra thủ công.`);
      }
    } catch {
      toast.error("Không thể tự sửa dữ liệu lệch đời.");
    } finally {
      setIsAutoFixingGenerations(false);
    }
  }, [isAutoFixingGenerations, members]);

  // Get all descendant IDs of a member using iterative traversal.
  const getDescendantIds = useCallback(
    (memberId: string): Set<string> => {
      const descendants = new Set<string>();
      const stack = [memberId];

      while (stack.length > 0) {
        const current = stack.pop();
        if (!current) continue;

        const children = members.filter((m) => m.parentId === current);
        children.forEach((child) => {
          if (!descendants.has(child.id)) {
            descendants.add(child.id);
            stack.push(child.id);
          }
        });
      }

      return descendants;
    },
    [members]
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
    setIsChildQuickAdd(false);
    setIsAddingNew(true);
    setEditingMember(null);
    setDialogSeed(Date.now());
    setIsDialogOpen(true);
  }, []);

  const handleEditMember = useCallback((member: FamilyMember) => {
    setDialogInitialValues(null);
    setIsSpouseQuickAdd(false);
    setIsChildQuickAdd(false);
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
            return false;
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
            return false;
          }
          const updated = fromApiMember(payload.data as ApiFamilyMember);
          setMembers((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
          toast.success("Đã cập nhật thông tin!");
        } else {
          return false;
        }
        return true;
      } catch {
        toast.error("Lỗi kết nối khi lưu thành viên");
        return false;
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

  const handleDeleteMemberFromContext = useCallback(async () => {
    if (!contextMenu) return;

    const target = contextMenu.member;
    const confirmed =
      typeof window === "undefined"
        ? false
        : window.confirm(`Bạn có chắc muốn xóa thành viên "${target.name}" không?`);

    if (!confirmed) return;

    try {
      const response = await fetch(`/api/family-members/${target.id}`, {
        method: "DELETE",
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        toast.error(normalizeApiError(payload?.error, "Không thể xóa thành viên"));
        return;
      }

      setMembers((prev) => prev.filter((member) => member.id !== target.id));
      if (selectedMember?.id === target.id) {
        setSelectedMember(null);
      }
      if (editingMember?.id === target.id) {
        setEditingMember(null);
      }
      setContextMenu(null);
      toast.success("Đã xóa thành viên!");
    } catch {
      toast.error("Lỗi kết nối khi xóa thành viên");
    }
  }, [contextMenu, editingMember?.id, normalizeApiError, selectedMember?.id]);

  const handleMemberClick = useCallback((member: FamilyMember) => {
    setContextMenu(null);
    setSelectedMember(member);
  }, []);

  const handleMemberContextMenu = useCallback(
    (member: FamilyMember, position: { clientX: number; clientY: number }) => {
      const menuWidth = 220;
      const menuHeight = member.gender === "male" ? 110 : 72;
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
    setIsChildQuickAdd(true);
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
    if (contextMenu.member.gender !== "male") {
      setContextMenu(null);
      return;
    }
    setIsSpouseQuickAdd(true);
    setIsChildQuickAdd(false);
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

  const potentialParents = members.filter((m) => m.generation < 20);
  const contextMenuSpouses = contextMenu ? getSpouses(contextMenu.member, members) : [];
  const contextMenuHasSpouse = contextMenuSpouses.length > 0;
  const canAddChildFromContext = contextMenu
    ? contextMenu.member.gender !== "male" || contextMenuHasSpouse
    : false;

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
    const memberIdFromQuery = searchParams.get("memberId");
    if (!memberIdFromQuery) return;
    if (focusedQueryMemberRef.current === memberIdFromQuery) return;

    const target = members.find((member) => member.id === memberIdFromQuery);
    if (!target) return;

    focusedQueryMemberRef.current = memberIdFromQuery;
    setSelectedMember(target);
    setSelectedGeneration(null);
    setSearchQuery(target.name);
    setCollapsedNodes(new Set());
  }, [members, searchParams]);

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
        {/* Controls */}
        <TreeControls
          selectedGeneration={selectedGeneration}
          totalGenerations={totalGenerations}
          minGeneration={minGeneration}
          memberCount={members.length}
          searchQuery={searchQuery}
          onReset={handleReset}
          onGenerationChange={setSelectedGeneration}
          onAddMember={handleAddMember}
          onSearchChange={setSearchQuery}
          isFullscreen={isFullscreen}
          onToggleFullscreen={() => setIsFullscreen((prev) => !prev)}
          onPrintTree={handlePrintTree}
        />

        {dataIntegrityWarnings.total > 0 && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            <p className="font-semibold">Dữ liệu gia phả cần rà soát</p>
            <div className="mt-2 space-y-2">
              {dataIntegrityWarnings.missingParentMembers.length > 0 && (
                <p>
                  - {dataIntegrityWarnings.missingParentMembers.length} thành viên đang trỏ đến
                  cha/mẹ không tồn tại.
                </p>
              )}
              {dataIntegrityWarnings.parentGenerationMismatchMembers.length > 0 && (
                <p>
                  - {dataIntegrityWarnings.parentGenerationMismatchMembers.length} thành viên lệch
                  đời so với cha/mẹ.
                </p>
              )}
              {dataIntegrityWarnings.singleParentMembers.length > 0 && (
                <p>
                  - {dataIntegrityWarnings.singleParentMembers.length} thành viên chỉ liên kết 1
                  phụ huynh.
                </p>
              )}
            </div>
            {dataIntegrityWarnings.parentGenerationMismatchMembers.length > 0 && (
              <div className="mt-3">
                <button
                  type="button"
                  onClick={handleAutoFixGenerationMismatch}
                  disabled={isAutoFixingGenerations}
                  className="rounded-md border border-amber-300 bg-white px-3 py-1.5 text-xs font-medium text-amber-900 hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isAutoFixingGenerations ? "Đang tự sửa..." : "Tự sửa lệch đời"}
                </button>
              </div>
            )}
            <div className="mt-3 flex flex-wrap gap-2">
              {[
                ...dataIntegrityWarnings.missingParentMembers,
                ...dataIntegrityWarnings.parentGenerationMismatchMembers,
                ...dataIntegrityWarnings.singleParentMembers,
              ]
                .slice(0, 6)
                .map((member) => (
                  <button
                    key={member.id}
                    type="button"
                    onClick={() => handleEditMember(member)}
                    className="rounded-md border border-amber-300 bg-white px-2.5 py-1 text-xs text-amber-900 hover:bg-amber-100"
                  >
                    Sửa: {member.name}
                  </button>
                ))}
            </div>
          </div>
        )}

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
            ) : members.length === 0 ? (
              <div className="rounded-xl border border-[#E2E8F0] bg-white p-10 text-center">
                <h3 className="text-lg font-semibold text-[#0F172A]">Chưa có dữ liệu gia phả</h3>
                <p className="mt-2 text-sm text-[#475569]">
                  Hãy thêm thành viên đầu tiên để bắt đầu xây dựng cây gia phả.
                </p>
              </div>
            ) : (
              <div ref={printAreaRef} data-tree-print-area>
                <FamilyTreeCanvas
                  members={members}
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
              </div>
            )}
          </TabsContent>

          <TabsContent value="list" className="space-y-4">
            {(selectedGeneration !== null
              ? Array.from({ length: 4 }, (_, i) => selectedGeneration + i)
              : Array.from({ length: totalGenerations - minGeneration + 1 }, (_, i) => minGeneration + i)
            ).map((gen) => (
              <GenerationList
                key={gen}
                members={members}
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
          allMembers={members}
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
          lockGeneration={isAddingNew && isChildQuickAdd}
          allMembers={members}
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
            {canAddChildFromContext && (
              <button
                type="button"
                onClick={handleAddChildFromContext}
                className="flex w-full flex-col items-start gap-0.5 px-3 py-2 text-left transition hover:bg-[#F8FAFC]"
              >
                <span className="text-sm font-medium text-[#0F172A]">Thêm con</span>
                <span className="text-xs text-[#64748B]">Tự gán cha/mẹ là thành viên đang chọn</span>
              </button>
            )}
            {contextMenu.member.gender === "male" && (
              <button
                type="button"
                onClick={handleAddSpouseFromContext}
                className={[
                  "flex w-full flex-col items-start gap-0.5 px-3 py-2 text-left transition hover:bg-[#F8FAFC]",
                  canAddChildFromContext ? "border-t border-[#F1F5F9]" : "",
                ].join(" ")}
              >
                <span className="text-sm font-medium text-[#0F172A]">
                  {contextMenuHasSpouse ? "Thêm vợ/chồng" : "Thêm vợ"}
                </span>
                <span className="text-xs text-[#64748B]">Tự gán quan hệ hôn nhân với thành viên này</span>
              </button>
            )}
            <button
              type="button"
              onClick={handleDeleteMemberFromContext}
              className={[
                "flex w-full flex-col items-start gap-0.5 border-t border-[#F1F5F9] px-3 py-2 text-left transition",
                "text-red-600 hover:bg-red-50",
              ].join(" ")}
            >
              <span className="text-sm font-medium">Xóa thành viên</span>
              <span className="text-xs text-red-500">Gỡ thành viên này khỏi cây gia phả</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
