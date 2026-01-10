export interface FamilyMember {
  id: string;
  name: string;
  birthYear: number;
  deathYear?: number;
  gender: 'male' | 'female';
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
