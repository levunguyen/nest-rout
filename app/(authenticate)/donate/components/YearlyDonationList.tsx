import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import { Donation } from "../types/donation";
import { Calendar, FileText } from "lucide-react";

interface YearlyDonationListProps {
    donations: Donation[];
}

export function YearlyDonationList({ donations }: YearlyDonationListProps) {
    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState<string>(currentYear.toString());

    const years = useMemo(() => {
        const uniqueYears = [...new Set(donations.map((d) => new Date(d.date).getFullYear()))];
        return uniqueYears.sort((a, b) => b - a);
    }, [donations]);

    const filteredDonations = useMemo(() => {
        return donations
            .filter((d) => new Date(d.date).getFullYear().toString() === selectedYear)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [donations, selectedYear]);

    const yearStats = useMemo(() => {
        const total = filteredDonations.reduce((sum, d) => sum + d.amount, 0);
        const byPurpose = filteredDonations.reduce((acc, d) => {
            acc[d.purpose] = (acc[d.purpose] || 0) + d.amount;
            return acc;
        }, {} as Record<string, number>);
        return { total, byPurpose, count: filteredDonations.length };
    }, [filteredDonations]);

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

    const getPurposeColor = (purpose: string) => {
        const colors: Record<string, string> = {
            "Xây dựng nhà thờ họ": "bg-primary/20 text-primary border-primary/30",
            "Giỗ tổ": "bg-accent/20 text-accent border-accent/30",
            "Tu sửa mộ phần": "bg-gold/20 text-gold-dark border-gold/30",
            "Quỹ học bổng": "bg-success/20 text-success border-success/30",
            "Hoạt động từ thiện": "bg-secondary text-secondary-foreground border-secondary",
        };
        return colors[purpose] || "bg-muted text-muted-foreground";
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <CardTitle className="flex items-center gap-2 text-xl">
                        <FileText className="h-5 w-5 text-primary" />
                        Danh sách đóng góp theo năm
                    </CardTitle>
                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                        <SelectTrigger className="w-[160px]">
                            <Calendar className="h-4 w-4 mr-2" />
                            <SelectValue placeholder="Chọn năm" />
                        </SelectTrigger>
                        <SelectContent>
                            {years.map((year) => (
                                <SelectItem key={year} value={year.toString()}>
                                    Năm {year}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Year Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                    <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                        <p className="text-sm text-muted-foreground">Tổng đóng góp năm {selectedYear}</p>
                        <p className="text-2xl font-bold text-primary">{formatCurrency(yearStats.total)}</p>
                    </div>
                    <div className="p-4 bg-secondary rounded-lg">
                        <p className="text-sm text-muted-foreground">Số lần đóng góp</p>
                        <p className="text-2xl font-bold text-foreground">{yearStats.count} lần</p>
                    </div>
                    <div className="p-4 bg-secondary rounded-lg">
                        <p className="text-sm text-muted-foreground">Trung bình mỗi lần</p>
                        <p className="text-2xl font-bold text-foreground">
                            {yearStats.count > 0 ? formatCurrency(yearStats.total / yearStats.count) : "0 ₫"}
                        </p>
                    </div>
                </div>

                {/* Purpose breakdown */}
                <div className="mt-4 p-4 bg-card border rounded-lg">
                    <p className="text-sm font-medium text-muted-foreground mb-3">Phân bổ theo mục đích:</p>
                    <div className="flex flex-wrap gap-2">
                        {Object.entries(yearStats.byPurpose).map(([purpose, amount]) => (
                            <div key={purpose} className="flex items-center gap-2 bg-secondary/50 rounded-lg px-3 py-2">
                                <span className="text-sm text-foreground">{purpose}:</span>
                                <span className="text-sm font-semibold text-primary">{formatCurrency(amount)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                {filteredDonations.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                        <FileText className="h-16 w-16 mx-auto mb-4 opacity-30" />
                        <p className="text-lg">Chưa có đóng góp nào trong năm {selectedYear}</p>
                    </div>
                ) : (
                    <div className="rounded-lg border overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50">
                                    <TableHead className="font-semibold">STT</TableHead>
                                    <TableHead className="font-semibold">Ngày</TableHead>
                                    <TableHead className="font-semibold">Người đóng góp</TableHead>
                                    <TableHead className="font-semibold">Mục đích</TableHead>
                                    <TableHead className="font-semibold">Ghi chú</TableHead>
                                    <TableHead className="font-semibold text-right">Số tiền</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredDonations.map((donation, index) => (
                                    <TableRow key={donation.id} className="hover:bg-muted/30">
                                        <TableCell className="font-medium">{index + 1}</TableCell>
                                        <TableCell>
                                            <span className="flex items-center gap-1.5">
                                                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                                                {formatDate(donation.date)}
                                            </span>
                                        </TableCell>
                                        <TableCell className="font-medium">{donation.memberName}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={getPurposeColor(donation.purpose)}>
                                                {donation.purpose}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {donation.note || "—"}
                                        </TableCell>
                                        <TableCell className="text-right font-bold text-primary">
                                            {formatCurrency(donation.amount)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {/* Total row */}
                                <TableRow className="bg-primary/5 border-t-2 border-primary/20">
                                    <TableCell colSpan={5} className="font-bold text-foreground">
                                        Tổng cộng năm {selectedYear}
                                    </TableCell>
                                    <TableCell className="text-right font-bold text-primary text-lg">
                                        {formatCurrency(yearStats.total)}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
