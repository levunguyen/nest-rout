"use client"
import { useState, useMemo } from "react";
import { familyMembers as initialMembers, donations as initialDonations, donationGoal } from "./data/mockData";
import { Donation } from "./types/donation";
import { StatCard } from "./components/StatCard";
import { FamilyMemberCard } from "./components/FamilyMemberCard";
import { DonationHistory } from "./components/DonationHistory";
import { ProgressGoal } from "./components/ProgressGoal";
import { AddDonationDialog } from "./components/AddDonationDialog";
import { YearlyDonationList } from "./components/YearlyDonationList";
import { Users, Coins, TrendingUp, Heart } from "lucide-react";

const Index = () => {
    const [donations, setDonations] = useState<Donation[]>(initialDonations);
    const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

    const members = useMemo(() => {
        return initialMembers.map((member) => {
            const memberDonations = donations.filter((d) => d.memberId === member.id);
            const totalDonated = memberDonations.reduce((sum, d) => sum + d.amount, 0);
            return { ...member, totalDonated };
        });
    }, [donations]);

    const totalDonated = useMemo(() => {
        return donations.reduce((sum, d) => sum + d.amount, 0);
    }, [donations]);


    const handleAddDonation = (donation: Omit<Donation, "id">) => {
        const newDonation: Donation = {
            ...donation,
            id: `d${Date.now()}`,
        };
        setDonations([newDonation, ...donations]);
    };

    const formatCurrency = (amount: number) => {
        if (amount >= 1000000) {
            return `${(amount / 1000000).toFixed(1)}M`;
        }
        return new Intl.NumberFormat("vi-VN").format(amount);
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="bg-card border-b border-border sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-gold-dark flex items-center justify-center">
                                <Heart className="h-5 w-5 text-primary-foreground" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-foreground">Quỹ Gia Đình</h1>
                                <p className="text-sm text-muted-foreground">Dòng họ Nguyễn</p>
                            </div>
                        </div>
                        <AddDonationDialog members={members} onAddDonation={handleAddDonation} />
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-6 space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        title="Tổng đóng góp"
                        value={`${formatCurrency(totalDonated)} ₫`}
                        icon={Coins}
                        variant="primary"
                        description="Tất cả thành viên"
                    />
                    <StatCard
                        title="Thành viên"
                        value={members.length.toString()}
                        icon={Users}
                        description="Đang tham gia"
                    />
                    <StatCard
                        title="Lượt đóng góp"
                        value={donations.length.toString()}
                        icon={TrendingUp}
                        description="Tổng số lần"
                    />
                    <StatCard
                        title="Trung bình"
                        value={`${formatCurrency(totalDonated / donations.length)} ₫`}
                        icon={Heart}
                        description="Mỗi lần đóng góp"
                    />
                </div>

                {/* Progress */}
                <ProgressGoal current={totalDonated} goal={donationGoal} />

                {/* Family Members */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-foreground">Thành viên gia đình</h2>
                        {selectedMemberId && (
                            <button
                                onClick={() => setSelectedMemberId(null)}
                                className="text-sm text-primary hover:underline"
                            >
                                Xem tất cả
                            </button>
                        )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {members.map((member) => (
                            <FamilyMemberCard
                                key={member.id}
                                member={member}
                                isSelected={selectedMemberId === member.id}
                                onClick={() =>
                                    setSelectedMemberId(
                                        selectedMemberId === member.id ? null : member.id
                                    )
                                }
                            />
                        ))}
                    </div>
                </div>

                {/* Yearly Donations */}
                <YearlyDonationList donations={donations} />

                {/* Recent Donations */}
                <DonationHistory donations={donations} limit={50} />
            </main>

            {/* Footer */}
            <footer className="bg-card border-t border-border py-4 mt-8">
                <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
                    <p>Hệ thống quản lý quỹ gia đình © 2024</p>
                </div>
            </footer>
        </div>
    );
};

export default Index;
