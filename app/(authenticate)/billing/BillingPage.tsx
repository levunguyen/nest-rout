"use client";

import { useState } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    CreditCard,
    Download,
    Receipt,
    Calendar,
    CheckCircle2,
    Clock,
    XCircle,
    Filter,
} from "lucide-react";
import { cn } from "@/components/lib/utils";

type InvoiceStatus = "paid" | "pending" | "failed";

interface Invoice {
    id: string;
    date: string;
    description: string;
    amount: number;
    status: InvoiceStatus;
}

const invoices: Invoice[] = [
    { id: "INV-2024-001", date: "15/02/2024", description: "Gói Pro — Tháng 2", amount: 19, status: "paid" },
    { id: "INV-2024-002", date: "15/01/2024", description: "Gói Pro — Tháng 1", amount: 19, status: "paid" },
    { id: "INV-2024-003", date: "15/12/2023", description: "Gói Pro — Tháng 12", amount: 19, status: "paid" },
    { id: "INV-2024-004", date: "15/11/2023", description: "Gói Pro — Tháng 11", amount: 19, status: "paid" },
    { id: "INV-2024-005", date: "15/10/2023", description: "Gói Pro — Tháng 10", amount: 19, status: "failed" },
    { id: "INV-2024-006", date: "15/09/2023", description: "Gói Starter — Tháng 9", amount: 0, status: "paid" },
];

const statusConfig: Record<
    InvoiceStatus,
    { label: string; icon: typeof CheckCircle2; className: string }
> = {
    paid: { label: "Đã thanh toán", icon: CheckCircle2, className: "text-emerald-400 bg-emerald-400/10" },
    pending: { label: "Đang chờ", icon: Clock, className: "text-amber-400 bg-amber-400/10" },
    failed: { label: "Thất bại", icon: XCircle, className: "text-red-400 bg-red-400/10" },
};

export default function BillingPage() {
    const [filterStatus, setFilterStatus] = useState<InvoiceStatus | "all">("all");

    const filtered =
        filterStatus === "all"
            ? invoices
            : invoices.filter((inv) => inv.status === filterStatus);

    const totalSpent = invoices
        .filter((i) => i.status === "paid")
        .reduce((sum, i) => sum + i.amount, 0);

    return (
        <div className="min-h-screen bg-background">
            <div className="mx-auto max-w-4xl px-6 py-12">
                {/* Header */}
                <div className="mb-10">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Quay lại
                    </Link>

                    <h1 className="text-3xl font-bold text-foreground">
                        Lịch sử thanh toán
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        Theo dõi tất cả giao dịch và hóa đơn của bạn
                    </p>
                </div>

                {/* Summary */}
                <div className="grid gap-4 sm:grid-cols-3 mb-10">
                    <div className="glass-card rounded-xl p-5">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                                <CreditCard className="h-4 w-4 text-primary" />
                            </div>
                            <span className="text-sm text-muted-foreground">Tổng chi tiêu</span>
                        </div>
                        <p className="text-2xl font-bold text-foreground">
                            ${totalSpent}
                        </p>
                    </div>

                    <div className="glass-card rounded-xl p-5">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                                <Receipt className="h-4 w-4 text-primary" />
                            </div>
                            <span className="text-sm text-muted-foreground">Số hóa đơn</span>
                        </div>
                        <p className="text-2xl font-bold text-foreground">
                            {invoices.length}
                        </p>
                    </div>

                    <div className="glass-card rounded-xl p-5">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                                <Calendar className="h-4 w-4 text-primary" />
                            </div>
                            <span className="text-sm text-muted-foreground">
                                Thanh toán tiếp theo
                            </span>
                        </div>
                        <p className="text-2xl font-bold text-foreground">
                            15/03/2024
                        </p>
                    </div>
                </div>

                {/* Filter */}
                <div className="flex items-center gap-2 mb-6">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground mr-2">Lọc:</span>

                    {(["all", "paid", "pending", "failed"] as const).map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={cn(
                                "rounded-full px-3 py-1.5 text-xs font-medium transition-all",
                                filterStatus === status
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-secondary text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {status === "all" ? "Tất cả" : statusConfig[status].label}
                        </button>
                    ))}
                </div>

                {/* Table */}
                <div className="glass-card rounded-xl overflow-hidden">
                    <div className="grid grid-cols-12 gap-4 border-b border-border px-6 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        <div className="col-span-3">Mã hóa đơn</div>
                        <div className="col-span-2">Ngày</div>
                        <div className="col-span-3">Mô tả</div>
                        <div className="col-span-2 text-right">Số tiền</div>
                        <div className="col-span-2 text-right">Trạng thái</div>
                    </div>

                    {filtered.length === 0 ? (
                        <div className="px-6 py-12 text-center text-sm text-muted-foreground">
                            Không có hóa đơn nào
                        </div>
                    ) : (
                        filtered.map((invoice, i) => {
                            const config = statusConfig[invoice.status];
                            const StatusIcon = config.icon;

                            return (
                                <div
                                    key={invoice.id}
                                    className={cn(
                                        "grid grid-cols-12 gap-4 items-center px-6 py-4 text-sm hover:bg-secondary/40 transition-colors",
                                        i < filtered.length - 1 && "border-b border-border"
                                    )}
                                >
                                    <div className="col-span-3 font-medium text-foreground">
                                        {invoice.id}
                                    </div>
                                    <div className="col-span-2 text-muted-foreground">
                                        {invoice.date}
                                    </div>
                                    <div className="col-span-3 text-muted-foreground">
                                        {invoice.description}
                                    </div>
                                    <div className="col-span-2 text-right font-medium text-foreground">
                                        ${invoice.amount}
                                    </div>
                                    <div className="col-span-2 flex justify-end">
                                        <span
                                            className={cn(
                                                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
                                                config.className
                                            )}
                                        >
                                            <StatusIcon className="h-3 w-3" />
                                            {config.label}
                                        </span>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Download */}
                <div className="mt-6 flex justify-end">
                    <button className="inline-flex items-center gap-2 rounded-lg bg-secondary px-4 py-2.5 text-sm font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors">
                        <Download className="h-4 w-4" />
                        Tải tất cả hóa đơn
                    </button>
                </div>
            </div>
        </div>
    );
}
