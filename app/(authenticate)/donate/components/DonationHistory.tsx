import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Donation } from "../types/donation";
import { Calendar, Gift, MessageSquare, Clock } from "lucide-react";

interface DonationHistoryProps {
    donations: Donation[];
    title?: string;
    limit?: number;
}

export function DonationHistory({
    donations,
    title = "Đóng góp gần đây",
    limit = 50
}: DonationHistoryProps) {
    const recentDonations = useMemo(() => {
        return [...donations]
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, limit);
    }, [donations, limit]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    return (
        <Card className="h-full">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Clock className="h-5 w-5 text-primary" />
                    {title}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                    Hiển thị {recentDonations.length} đóng góp gần nhất
                </p>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                    {recentDonations.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <Gift className="h-12 w-12 mx-auto mb-3 opacity-50" />
                            <p>Chưa có đóng góp nào</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {recentDonations.map((donation, index) => (
                                <div
                                    key={donation.id}
                                    className="relative pl-6 pb-4 last:pb-0"
                                >
                                    {/* Timeline line */}
                                    {index !== recentDonations.length - 1 && (
                                        <div className="absolute left-[9px] top-6 bottom-0 w-0.5 bg-border" />
                                    )}

                                    {/* Timeline dot */}
                                    <div className="absolute left-0 top-1.5 w-[18px] h-[18px] rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
                                        <div className="w-2 h-2 rounded-full bg-primary" />
                                    </div>

                                    <div className="bg-secondary/50 rounded-lg p-4 ml-2 hover:bg-secondary transition-colors">
                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <div>
                                                <p className="font-semibold text-foreground">{donation.memberName}</p>
                                                <p className="text-sm text-muted-foreground">{donation.purpose}</p>
                                            </div>
                                            <span className="text-primary font-bold whitespace-nowrap">
                                                {formatCurrency(donation.amount)}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                {formatDate(donation.date)}
                                            </span>
                                            {donation.note && (
                                                <span className="flex items-center gap-1">
                                                    <MessageSquare className="h-3 w-3" />
                                                    {donation.note}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
