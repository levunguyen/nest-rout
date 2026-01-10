"use client";
import { useEffect, useState, useCallback } from "react";
import { FamilyMember } from "../../types/FamilyTree";
import { initialFamilyData } from "../../data/familyTreeData";
import { TreeControls } from "./TreeControls";
import { FamilyTreeCanvas } from "./FamilyTreeCanvas";
import { GenerationList } from "./GenerationList";
import { MemberDialog } from "./MemberDialog";
import { MemberDetails } from "./MemberDetails";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { toast } from "sonner";

// Get all spouses of a member (supports multiple spouses)
const getSpouses = (member: FamilyMember, allMembers: FamilyMember[]): FamilyMember[] => {
  const spouses: FamilyMember[] = [];

  // Check if member has spouseIds
  if (member.spouseIds && member.spouseIds.length > 0) {
    member.spouseIds.forEach(spouseId => {
      const spouse = allMembers.find(m => m.id === spouseId);
      if (spouse) spouses.push(spouse);
    });
  }

  // Also check if this member is listed as someone else's spouse
  allMembers.forEach(m => {
    if (m.spouseIds?.includes(member.id) && !spouses.find(s => s.id === m.id)) {
      spouses.push(m);
    }
  });

  return spouses;
};

const hasSpouse = (member: FamilyMember, allMembers: FamilyMember[]) => {
  return getSpouses(member, allMembers).length > 0;
};

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
  const [members, setMembers] = useState<FamilyMember[]>(initialFamilyData);
  const [zoom, setZoom] = useState(0.7);
  const [selectedGeneration, setSelectedGeneration] = useState<number | null>(null);
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [collapsedNodes, setCollapsedNodes] = useState<Set<string>>(new Set());
  const [hoveredMemberId, setHoveredMemberId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const next = sanitizeNoSingleParentChildren(members);
    if (next.length !== members.length) {
      setMembers(next);
    }
  }, [members]);

  const minGeneration = Math.min(...members.map((m) => m.generation));
  const totalGenerations = Math.max(...members.map((m) => m.generation));

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

  // Get all descendant IDs of a member
  const getDescendantIds = useCallback((memberId: string): Set<string> => {
    const descendants = new Set<string>();
    const children = members.filter(m => m.parentId === memberId);

    children.forEach(child => {
      descendants.add(child.id);
      // Recursively get descendants
      const childDescendants = getDescendantIds(child.id);
      childDescendants.forEach(id => descendants.add(id));
    });

    return descendants;
  }, [members]);

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
    setIsAddingNew(true);
    setEditingMember(null);
    setIsDialogOpen(true);
  }, []);

  const handleEditMember = useCallback((member: FamilyMember) => {
    setIsAddingNew(false);
    setEditingMember(member);
    setIsDialogOpen(true);
  }, []);

  const handleSaveMember = useCallback(
    (memberData: Omit<FamilyMember, "id">) => {
      if (isAddingNew) {
        const newMember: FamilyMember = {
          ...memberData,
          id: `member-${Date.now()}`,
        };
        setMembers((prev) => [...prev, newMember]);
        toast.success("Đã thêm thành viên mới!");
      } else if (editingMember) {
        setMembers((prev) =>
          prev.map((m) =>
            m.id === editingMember.id ? { ...m, ...memberData } : m
          )
        );
        toast.success("Đã cập nhật thông tin!");
      }
      setIsDialogOpen(false);
    },
    [isAddingNew, editingMember]
  );

  const handleDeleteMember = useCallback(() => {
    if (editingMember) {
      setMembers((prev) => prev.filter((m) => m.id !== editingMember.id));
      setIsDialogOpen(false);
      setSelectedMember(null);
      toast.success("Đã xóa thành viên!");
    }
  }, [editingMember]);

  const handleMemberClick = useCallback((member: FamilyMember) => {
    setSelectedMember(member);
  }, []);

  // Get potential parents (members who can have children) - must have a spouse
  const potentialParents = members.filter(
    (m) => m.generation < 6 && hasSpouse(m, members)
  );

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-serif font-bold text-foreground">
            Gia Phả Dòng Họ
          </h1>
          <p className="text-muted-foreground">
            Quản lý và xem thông tin các thành viên trong gia đình
          </p>
        </div>

        {/* Controls */}
        <TreeControls
          zoom={zoom}
          selectedGeneration={selectedGeneration}
          totalGenerations={totalGenerations}
          minGeneration={minGeneration}
          memberCount={members.length}
          searchQuery={searchQuery}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onReset={handleReset}
          onGenerationChange={setSelectedGeneration}
          onAddMember={handleAddMember}
          onSearchChange={setSearchQuery}
        />

        {/* Main Content - Full Width */}
        <Tabs defaultValue="tree" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="tree">Sơ đồ cây</TabsTrigger>
            <TabsTrigger value="list">Danh sách theo đời</TabsTrigger>
          </TabsList>

          <TabsContent value="tree">
            <FamilyTreeCanvas
              members={members}
              zoom={zoom}
              selectedGeneration={selectedGeneration}
              searchQuery={searchQuery}
              onMemberClick={handleMemberClick}
              onMemberEdit={handleEditMember}
              selectedMemberId={selectedMember?.id}
              collapsedNodes={collapsedNodes}
              onToggleCollapse={handleToggleCollapse}
              hoveredMemberId={hoveredMemberId}
              onMemberHover={setHoveredMemberId}
              onZoomChange={setZoom}
            />
          </TabsContent>

          <TabsContent value="list" className="space-y-4">
            {(selectedGeneration !== null
              ? [selectedGeneration]
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
          open={isDialogOpen}
          member={isAddingNew ? null : editingMember}
          parents={potentialParents}
          onClose={() => setIsDialogOpen(false)}
          onSave={handleSaveMember}
          onDelete={isAddingNew ? undefined : handleDeleteMember}
        />
      </div>
    </div>
  );
};
