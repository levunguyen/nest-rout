import { FamilyMember } from "../../types/FamilyTree";
import { FamilyMemberCard } from "./FamilyMemberCard";
import { cn } from "@/components/lib/utils";
import { Pencil } from "lucide-react";

interface GenerationListProps {
  members: FamilyMember[];
  generation: number;
  onMemberClick: (member: FamilyMember) => void;
  onMemberEdit: (member: FamilyMember) => void;
  selectedMemberId?: string;
}

export const GenerationList = ({
  members,
  generation,
  onMemberClick,
  onMemberEdit,
  selectedMemberId,
}: GenerationListProps) => {
  const generationMembers = members.filter((m) => m.generation === generation);

  if (generationMembers.length === 0) return null;

  const generationColors = [
    "from-amber-500/20 to-amber-500/5", // Generation 0 - Ancestors
    "from-primary/10 to-primary/5",
    "from-accent/30 to-accent/10",
    "from-secondary/20 to-secondary/10",
    "from-muted to-muted/50",
    "from-primary/5 to-transparent",
    "from-accent/20 to-transparent",
  ];

  const getGenerationLabel = (gen: number) => {
    if (gen === -1) return "Thủy Tổ";
    if (gen === 0) return "Tổ tiên";
    return `Đời thứ ${gen}`;
  };

  const getColorIndex = (gen: number) => {
    // Map negative generations to positive indices
    return (gen + 1 + generationColors.length) % generationColors.length;
  };

  return (
    <div
      className={cn(
        "rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-sm",
        "bg-gradient-to-br",
        generationColors[getColorIndex(generation)]
      )}
    >
      <h3 className="text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
        <span
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center text-sm",
            generation <= 0 ? "bg-amber-500 text-white" : "bg-primary text-primary-foreground"
          )}
        >
          {generation}
        </span>
        {getGenerationLabel(generation)}
        <span className="text-sm font-normal text-muted-foreground ml-2">
          ({generationMembers.length} người)
        </span>
      </h3>

      <div className="flex flex-wrap justify-start gap-6">
        {generationMembers.map((member) => (
          <div key={member.id} className="group relative">
            <FamilyMemberCard
              member={member}
              isSelected={member.id === selectedMemberId}
              onClick={() => onMemberClick(member)}
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onMemberEdit(member);
              }}
              className="absolute -right-2 -top-2 inline-flex h-7 w-7 items-center justify-center rounded-full border border-[#E2E8F0] bg-white text-[#16A34A] opacity-0 shadow-sm transition group-hover:opacity-100 hover:bg-[#DCFCE7]"
              title="Chỉnh sửa thành viên"
              aria-label={`Chỉnh sửa ${member.name}`}
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
