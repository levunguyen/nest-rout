import { FamilyMember } from "../../types/FamilyTree";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { User, Calendar, Users, Edit2, Heart } from "lucide-react";
import { cn } from "../../lib/utils";

interface MemberDetailsProps {
  member: FamilyMember | null;
  allMembers: FamilyMember[];
  onEdit: (member: FamilyMember) => void;
  onClose: () => void;
}

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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Chi tiết thành viên</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Avatar and Name */}
          <div className="text-center">
            <div
              className={cn(
                "w-20 h-20 mx-auto mb-3 rounded-full flex items-center justify-center",
                member.gender === "male"
                  ? "bg-primary/20 text-primary"
                  : "bg-accent-foreground/20 text-accent-foreground"
              )}
            >
              <User className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">{member.name}</h3>
            <p className="text-sm text-muted-foreground">
              Đời thứ {member.generation} •{" "}
              {member.gender === "male" ? "Nam" : "Nữ"}
            </p>
          </div>

          {/* Dates */}
          <div className="flex items-center justify-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span>
              {member.birthYear}
              {member.deathYear ? ` - ${member.deathYear}` : " - nay"}
            </span>
          </div>

          {/* Relations */}
          <div className="space-y-3 pt-2 border-t">
            {/* Spouses */}
            {spouses.length > 0 && (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Heart className="w-4 h-4" />
                  <span>Vợ/Chồng ({spouses.length})</span>
                </div>
                <div className="pl-6 space-y-0.5">
                  {spouses.map((spouse) => (
                    <p key={spouse.id} className="text-sm">{spouse.name}</p>
                  ))}
                </div>
              </div>
            )}

            {/* Parent */}
            {parent && (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>Cha/Mẹ</span>
                </div>
                <p className="text-sm pl-6">{parent.name}</p>
              </div>
            )}

            {/* Siblings */}
            {siblings.length > 0 && (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>Anh/Chị/Em ({siblings.length})</span>
                </div>
                <div className="pl-6 space-y-0.5">
                  {siblings.slice(0, 5).map((sibling) => (
                    <p key={sibling.id} className="text-sm">
                      {sibling.name}
                    </p>
                  ))}
                  {siblings.length > 5 && (
                    <p className="text-sm text-muted-foreground">
                      +{siblings.length - 5} người khác
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Children */}
            {children.length > 0 && (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>Con cái ({children.length})</span>
                </div>
                <div className="pl-6 space-y-0.5">
                  {children.slice(0, 5).map((child) => (
                    <p key={child.id} className="text-sm">
                      {child.name}
                    </p>
                  ))}
                  {children.length > 5 && (
                    <p className="text-sm text-muted-foreground">
                      +{children.length - 5} người khác
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Edit Button */}
          <Button
            onClick={() => onEdit(member)}
            className="w-full mt-4"
            variant="outline"
          >
            <Edit2 className="w-4 h-4 mr-2" />
            Chỉnh sửa
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
