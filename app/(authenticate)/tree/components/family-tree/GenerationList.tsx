import { FamilyMember } from "../../types/FamilyTree";
import { FamilyMemberCard } from "./FamilyMemberCard";
import { cn } from "../../lib/utils";

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
        "p-6 rounded-xl bg-gradient-to-br",
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

      <div className="flex flex-wrap gap-6 justify-start">
        {generationMembers.map((member) => (
          <div key={member.id} onClick={() => onMemberEdit(member)}>
            <FamilyMemberCard
              member={member}
              isSelected={member.id === selectedMemberId}
              onClick={() => onMemberClick(member)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
