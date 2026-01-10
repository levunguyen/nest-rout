import { FamilyMember } from "../../types/FamilyTree";
import { cn } from "../../lib/utils";

// Custom Female Icon component
const FemaleIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* Head */}
    <circle cx="12" cy="7" r="4" />
    {/* Body with dress shape */}
    <path d="M12 11 C8 11, 6 15, 6 20 L18 20 C18 15, 16 11, 12 11" />
  </svg>
);

// Custom Male Icon component
const MaleIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* Head */}
    <circle cx="12" cy="7" r="4" />
    {/* Body - shoulders and torso */}
    <path d="M5 21 L5 17 C5 14, 8 12, 12 12 C16 12, 19 14, 19 17 L19 21" />
  </svg>
);

interface FamilyMemberCardProps {
  member: FamilyMember;
  isSelected?: boolean;
  isHighlighted?: boolean;
  isSearchMatch?: boolean;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const FamilyMemberCard = ({
  member,
  isSelected,
  isHighlighted,
  isSearchMatch,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: FamilyMemberCardProps) => {
  const isMale = member.gender === "male";

  return (
    <div
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={cn(
        "relative cursor-pointer transition-all duration-200",
        "hover:scale-105",
        isHighlighted && "scale-110",
        isSearchMatch && "scale-110"
      )}
      style={{ width: 100 }}
    >
      {/* Card Container */}
      <div
        className={cn(
          "flex flex-col items-center p-2 rounded-lg transition-all",
          isSelected && "bg-primary/20 ring-2 ring-primary",
          isHighlighted && "bg-orange-100",
          isSearchMatch && "bg-green-100 ring-2 ring-green-500"
        )}
      >
        {/* Avatar Circle */}
        <div className="relative">
          <div
            className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all overflow-hidden",
              isMale
                ? "border-blue-400 bg-blue-50"
                : "border-amber-400 bg-amber-50"
            )}
          >
            {member.imageUrl ? (
              <img
                src={member.imageUrl}
                alt={member.name}
                className="w-full h-full object-cover"
              />
            ) : isMale ? (
              <MaleIcon className="w-6 h-6 text-blue-500" />
            ) : (
              <FemaleIcon className="w-6 h-6 text-amber-500" />
            )}
          </div>
          {/* Search match indicator */}
          {isSearchMatch && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full flex items-center justify-center">
              <svg
                className="w-2.5 h-2.5 text-accent-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Name */}
        <h3 className="text-xs font-semibold text-center text-foreground mt-2 leading-tight line-clamp-2">
          {member.name}
        </h3>

        {/* Generation */}
        <p className="text-[10px] text-muted-foreground mt-0.5">
          Đời {member.generation}
        </p>

        {/* Birth - Death Years */}
        <p className={cn(
          "text-[10px] text-center mt-0.5",
          isMale ? "text-blue-600" : "text-amber-600"
        )}>
          {member.birthYear}
          {member.deathYear ? ` - ${member.deathYear}` : ""}
        </p>
      </div>
    </div>
  );
};
