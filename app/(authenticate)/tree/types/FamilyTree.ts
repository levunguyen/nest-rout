export interface FamilyMember {
  id: string;
  name: string;
  birthYear?: number;
  deathYear?: number;
  address?: string;
  city?: string;
  country?: string;
  phone?: string;
  gender: "male" | "female" | "other";
  generation: number;
  parentId?: string;
  spouseIds?: string[]; // Support multiple spouses
  imageUrl?: string;
}

export interface TreeNode extends FamilyMember {
  children: TreeNode[];
  spouse?: FamilyMember;
  x: number;
  y: number;
}
