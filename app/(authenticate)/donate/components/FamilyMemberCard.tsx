import { Card, CardContent } from "./ui/card";
import { FamilyMember } from "../types/donation";

interface FamilyMemberCardProps {
    member: FamilyMember;
    isSelected?: boolean;
    onClick?: () => void;
}

export function FamilyMemberCard({ member, isSelected, onClick }: FamilyMemberCardProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(amount);
    };

    return (
        <Card
            className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${isSelected ? "ring-2 ring-primary shadow-lg" : ""
                }`}
            onClick={onClick}
        >
            <CardContent className="p-5">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-gold-dark flex items-center justify-center text-3xl shadow-md">
                        {member.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground truncate">{member.name}</h3>
                        <p className="text-sm text-muted-foreground">{member.relationship}</p>
                        <p className="text-sm font-medium text-primary mt-1">
                            {formatCurrency(member.totalDonated)}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
