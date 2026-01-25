export interface FamilyMember {
    id: string;
    name: string;
    avatar: string;
    relationship: string;
    totalDonated: number;
}

export interface Donation {
    id: string;
    memberId: string;
    memberName: string;
    amount: number;
    purpose: string;
    date: string;
    note?: string;
}
