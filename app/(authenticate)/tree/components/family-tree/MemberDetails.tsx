import { FamilyMember } from "../../types/FamilyTree";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User, Calendar, Users, Edit2, Heart, Sparkles, Dot } from "lucide-react";
import { cn } from "@/components/lib/utils";
import { getSpouses } from "../../utils/relations";

interface MemberDetailsProps {
  member: FamilyMember | null;
  allMembers: FamilyMember[];
  onEdit: (member: FamilyMember) => void;
  onClose: () => void;
}

export const MemberDetails = ({
  member,
  allMembers,
  onEdit,
  onClose,
}: MemberDetailsProps) => {
  if (!member) return null;

  const parent = member.parentId
    ? allMembers.find((m) => m.id === member.parentId)
    : null;

  const spouses = getSpouses(member, allMembers);

  const children = allMembers.filter((m) => m.parentId === member.id);

  const siblings = parent
    ? allMembers.filter(
      (m) => m.parentId === parent.id && m.id !== member.id
    )
    : [];

  return (
    <Dialog open={!!member} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[88vh] overflow-y-auto border-[#E2E8F0] bg-[#FCFDFC] sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold text-[#0F172A]">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#DCFCE7] text-[#166534]">
              <Sparkles className="h-4 w-4" />
            </span>
            Chi tiết thành viên
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-xl border border-[#E2E8F0] bg-white p-4">
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  "flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border",
                  member.gender === "male"
                    ? "border-[#86EFAC] bg-[#DCFCE7] text-[#166534]"
                    : "border-[#FDE68A] bg-[#FEF3C7] text-[#92400E]"
                )}
              >
                <User className="h-10 w-10" />
              </div>
              <div className="min-w-0">
                <h3 className="truncate text-2xl font-bold text-[#0F172A]">{member.name}</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="rounded-full border border-[#E2E8F0] bg-[#F8FAF8] px-2.5 py-1 text-xs font-medium text-[#475569]">
                    Đời {member.generation}
                  </span>
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-1 text-xs font-medium",
                      member.gender === "male" ? "bg-[#DCFCE7] text-[#166534]" : "bg-[#FEF3C7] text-[#92400E]"
                    )}
                  >
                    {member.gender === "male" ? "Nam" : "Nữ"}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4 inline-flex items-center gap-2 rounded-lg border border-[#E2E8F0] bg-[#F8FAF8] px-3 py-2 text-sm text-[#334155]">
              <Calendar className="h-4 w-4 text-[#16A34A]" />
              {member.birthYear}
              {member.deathYear ? ` - ${member.deathYear}` : " - nay"}
            </div>
          </div>

          <div className="rounded-xl border border-[#E2E8F0] bg-white p-4">
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#64748B]">Quan hệ gia đình</h4>
            <div className="space-y-3">
            {spouses.length > 0 && (
              <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAF8] p-3">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#0F172A]">
                  <Heart className="h-4 w-4 text-[#E11D48]" />
                  <span>Vợ/Chồng ({spouses.length})</span>
                </div>
                <div className="space-y-1">
                  {spouses.map((spouse) => (
                    <p key={spouse.id} className="inline-flex items-center gap-1 text-sm text-[#334155]">
                      <Dot className="h-4 w-4 text-[#16A34A]" />
                      {spouse.name}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {parent && (
              <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAF8] p-3">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#0F172A]">
                  <Users className="h-4 w-4 text-[#16A34A]" />
                  <span>Cha/Mẹ</span>
                </div>
                <p className="text-sm text-[#334155]">{parent.name}</p>
              </div>
            )}

            {siblings.length > 0 && (
              <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAF8] p-3">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#0F172A]">
                  <Users className="h-4 w-4 text-[#16A34A]" />
                  <span>Anh/Chị/Em ({siblings.length})</span>
                </div>
                <div className="space-y-1">
                  {siblings.slice(0, 5).map((sibling) => (
                    <p key={sibling.id} className="inline-flex items-center gap-1 text-sm text-[#334155]">
                      <Dot className="h-4 w-4 text-[#16A34A]" />
                      {sibling.name}
                    </p>
                  ))}
                  {siblings.length > 5 && (
                    <p className="text-sm text-[#64748B]">
                      +{siblings.length - 5} người khác
                    </p>
                  )}
                </div>
              </div>
            )}

            {children.length > 0 && (
              <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAF8] p-3">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#0F172A]">
                  <Users className="h-4 w-4 text-[#16A34A]" />
                  <span>Con cái ({children.length})</span>
                </div>
                <div className="space-y-1">
                  {children.slice(0, 5).map((child) => (
                    <p key={child.id} className="inline-flex items-center gap-1 text-sm text-[#334155]">
                      <Dot className="h-4 w-4 text-[#16A34A]" />
                      {child.name}
                    </p>
                  ))}
                  {children.length > 5 && (
                    <p className="text-sm text-[#64748B]">
                      +{children.length - 5} người khác
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
          </div>

          <Button
            onClick={() => onEdit(member)}
            className="mt-2 w-full border-[#16A34A] text-[#166534] hover:bg-[#DCFCE7]"
            variant="outline"
          >
            <Edit2 className="mr-2 h-4 w-4" />
            Chỉnh sửa
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
