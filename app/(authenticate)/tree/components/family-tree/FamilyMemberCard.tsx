import { FamilyMember } from "../../types/FamilyTree";
import { cn } from "@/components/lib/utils";
import type { MouseEventHandler } from "react";

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
  onContextMenu?: MouseEventHandler<HTMLDivElement>;
  onContextAction?: (position: { clientX: number; clientY: number }) => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const FamilyMemberCard = ({
  member,
  isSelected,
  isHighlighted,
  isSearchMatch,
  onClick,
  onContextMenu,
  onContextAction,
  onMouseEnter,
  onMouseLeave,
}: FamilyMemberCardProps) => {
  const isMale = member.gender === "male";
  const isFemale = member.gender === "female";

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Thành viên ${member.name}`}
      onClick={onClick}
      onContextMenu={onContextMenu}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
        if ((e.key === "F10" && e.shiftKey) || e.key === "ContextMenu") {
          e.preventDefault();
          const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
          onContextAction?.({
            clientX: rect.left + rect.width / 2,
            clientY: rect.bottom - 4,
          });
        }
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={cn(
        "relative cursor-pointer rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14532D]/40",
        "hover:scale-105",
        isHighlighted && "scale-110",
        isSearchMatch && "scale-110"
      )}
      style={{ width: 100 }}
    >
      {/* Card Container */}
      <div
        className={cn(
          "flex flex-col items-center rounded-lg border border-[#E2E8F0] bg-white p-2 shadow-sm transition-all",
          isSelected && "bg-[#DCFCE7] ring-2 ring-[#16A34A]",
          isHighlighted && "bg-[#ECFDF5]",
          isSearchMatch && "bg-[#DCFCE7] ring-2 ring-[#16A34A]"
        )}
      >
        {/* Avatar Circle */}
        <div className="relative">
          <div
            className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all overflow-hidden",
              isMale
                ? "border-emerald-400 bg-emerald-50"
                : isFemale
                  ? "border-rose-300 bg-rose-50"
                  : "border-slate-300 bg-slate-100"
            )}
          >
            {member.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={member.imageUrl}
                alt={member.name}
                className="w-full h-full object-cover"
              />
            ) : isMale ? (
              <MaleIcon className="w-6 h-6 text-emerald-600" />
            ) : isFemale ? (
              <FemaleIcon className="w-6 h-6 text-rose-500" />
            ) : (
              <span className="text-xs font-semibold text-slate-600">?</span>
            )}
          </div>
          {/* Search match indicator */}
          {isSearchMatch && (
            <div className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#16A34A]">
              <svg
                className="h-2.5 w-2.5 text-white"
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
        <h3 className="mt-2 line-clamp-2 text-center text-xs font-semibold leading-tight text-[#0F172A]">
          {member.name}
        </h3>

        {/* Generation */}
        <p className="mt-0.5 text-[10px] text-[#64748B]">
          Đời {member.generation}
        </p>

        {/* Birth - Death Years */}
        <p className={cn(
          "mt-0.5 text-center text-[10px]",
          isMale ? "text-emerald-700" : isFemale ? "text-rose-600" : "text-slate-600"
        )}>
          {member.birthYear ?? "?"}
          {member.deathYear ? ` - ${member.deathYear}` : ""}
        </p>
      </div>
    </div>
  );
};
