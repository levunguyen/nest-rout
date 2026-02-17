"use client";

import { useState } from "react";
import Link from "next/link";
import { CreditCard, Receipt, Settings, Zap, AlertTriangle, X } from "lucide-react";
import { cn } from "../../../../components/lib/utils";
import { toast } from "sonner";
import UpgradeFlowModal from "./UpgradeFlowModal";

const CurrentPlanSection = () => {
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelReason, setCancelReason] = useState("");
    const [isCancelled, setIsCancelled] = useState(false);
    const [showUpgradeFlow, setShowUpgradeFlow] = useState(false);

    const handleCancel = () => {
        setIsCancelled(true);
        setShowCancelModal(false);
        setCancelReason("");
        toast.success("Đã hủy gói đăng ký");
    };

    return (
        <section className="mx-auto mt-24 max-w-4xl px-6">
            <h2 className="mb-8 text-2xl font-bold text-foreground">Quản lý thanh toán</h2>

            {/* Current Plan */}
            <div className="glass-card-featured rounded-2xl p-6 mb-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                            <Zap className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Gói hiện tại</p>
                            <p className="text-lg font-semibold text-foreground">Free Plan</p>
                            {isCancelled && (
                                <p className="text-xs text-destructive mt-1">Đã hủy — Còn hiệu lực đến 15/03/2024</p>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                        {!isCancelled && (
                            <button
                                onClick={() => setShowCancelModal(true)}
                                className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-destructive hover:border-destructive/50 transition-all"
                            >
                                Hủy gói
                            </button>
                        )}
                        {isCancelled ? (
                            <button
                                onClick={() => { setIsCancelled(false); toast.success("Đã kích hoạt lại gói"); }}
                                className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground btn-primary-glow transition-all hover:opacity-90"
                            >
                                Kích hoạt lại
                            </button>
                        ) : (
                            <button
                                onClick={() => setShowUpgradeFlow(true)}
                                className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground btn-primary-glow transition-all hover:opacity-90"
                            >
                                Nâng cấp
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Billing Info Cards */}
            <div className="grid gap-4 sm:grid-cols-3">
                <div className="glass-card rounded-xl p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <CreditCard className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm font-medium text-foreground">Phương thức thanh toán</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Chưa thêm thẻ</p>
                    <button className="mt-3 text-sm font-medium text-primary hover:underline">
                        Thêm thẻ
                    </button>
                </div>

                <div className="glass-card rounded-xl p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <Receipt className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm font-medium text-foreground">Hóa đơn tiếp theo</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Không có hóa đơn</p>
                    <Link href="/billing" className="mt-3 inline-block text-sm font-medium text-primary hover:underline">
                        Xem lịch sử
                    </Link>
                </div>

                <div className="glass-card rounded-xl p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <Settings className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm font-medium text-foreground">Cài đặt</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Quản lý tài khoản</p>
                    <button className="mt-3 text-sm font-medium text-primary hover:underline">
                        Cài đặt
                    </button>
                </div>
            </div>

            {/* Cancel Subscription Modal */}
            {showCancelModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm px-4">
                    <div className="glass-card-featured w-full max-w-md rounded-2xl p-6 relative">
                        <button
                            onClick={() => setShowCancelModal(false)}
                            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10">
                                <AlertTriangle className="h-5 w-5 text-destructive" />
                            </div>
                            <h3 className="text-lg font-semibold text-foreground">Hủy gói đăng ký</h3>
                        </div>

                        <p className="text-sm text-muted-foreground mb-4">
                            Bạn sẽ mất quyền truy cập các tính năng cao cấp khi chu kỳ thanh toán hiện tại kết thúc. Bạn có chắc chắn muốn hủy?
                        </p>

                        <label className="block text-sm font-medium text-foreground mb-2">
                            Lý do hủy <span className="text-muted-foreground font-normal">(tùy chọn)</span>
                        </label>
                        <div className="space-y-2 mb-5">
                            {["Quá đắt", "Không sử dụng đủ", "Chuyển sang dịch vụ khác", "Thiếu tính năng cần thiết"].map((reason) => (
                                <button
                                    key={reason}
                                    onClick={() => setCancelReason(reason)}
                                    className={cn(
                                        "w-full rounded-lg px-4 py-2.5 text-left text-sm transition-all",
                                        cancelReason === reason
                                            ? "bg-destructive/10 text-destructive border border-destructive/30"
                                            : "bg-secondary text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    {reason}
                                </button>
                            ))}
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowCancelModal(false)}
                                className="flex-1 rounded-lg bg-secondary py-2.5 text-sm font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors"
                            >
                                Giữ gói
                            </button>
                            <button
                                onClick={handleCancel}
                                className="flex-1 rounded-lg bg-destructive py-2.5 text-sm font-medium text-destructive-foreground hover:opacity-90 transition-all"
                            >
                                Xác nhận hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Upgrade Flow Modal */}
            <UpgradeFlowModal
                isOpen={showUpgradeFlow}
                onClose={() => setShowUpgradeFlow(false)}
            />
        </section>
    );
};

export default CurrentPlanSection;
