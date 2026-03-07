import { FamilyMember } from "../types/FamilyTree";

export const getSpouses = (
  member: FamilyMember,
  allMembers: FamilyMember[],
): FamilyMember[] => {
  const spouses: FamilyMember[] = [];

  if (member.spouseIds && member.spouseIds.length > 0) {
    member.spouseIds.forEach((spouseId) => {
      const spouse = allMembers.find((m) => m.id === spouseId);
      if (spouse) spouses.push(spouse);
    });
  }

  allMembers.forEach((m) => {
    if (m.spouseIds?.includes(member.id) && !spouses.find((s) => s.id === m.id)) {
      spouses.push(m);
    }
  });

  return spouses;
};

export const hasSpouse = (member: FamilyMember, allMembers: FamilyMember[]) =>
  getSpouses(member, allMembers).length > 0;

export const buildChildrenMap = (members: FamilyMember[]) => {
  const byParent = new Map<string, FamilyMember[]>();
  members.forEach((m) => {
    if (!m.parentId) return;
    const current = byParent.get(m.parentId) ?? [];
    current.push(m);
    byParent.set(m.parentId, current);
  });
  return byParent;
};
