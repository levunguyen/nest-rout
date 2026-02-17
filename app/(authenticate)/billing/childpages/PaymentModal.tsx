"use client"
import { useState } from "react";
import { X, CreditCard, Lock, CheckCircle2 } from "lucide-react";
import { cn } from "../../../../components/lib/utils";
import { toast } from "sonner";

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    planName?: string;
    planPrice?: number;
    billingCycle?: string;
}

const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
};

const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length > 2) return digits.slice(0, 2) + "/" + digits.slice(2);
    return digits;
};

const PaymentModal = ({
    isOpen,
    onClose,
    planName = "Pro",
    planPrice = 19,
    billingCycle = "tháng",
}: PaymentModalProps) => {
    const [cardNumber, setCardNumber] = useState("");
    const [cardName, setCardName] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cvv, setCvv] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const isFormValid =
        cardNumber.replace(/\s/g, "").length === 16 &&
        cardName.trim().length > 0 &&
        expiry.length === 5 &&
        cvv.length >= 3;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid) return;

        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            setIsSuccess(true);
            setTimeout(() => {
                toast.success(`Đã nâng cấp lên gói ${planName} thành công!`);
                resetAndClose();
            }, 1500);
        }, 2000);
    };

    const resetAndClose = () => {
        setCardNumber("");
        setCardName("");
        setExpiry("");
        setCvv("");
        setIsProcessing(false);
        setIsSuccess(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm px-4">
            <div className="glass-card-featured w-full max-w-lg rounded-2xl relative overflow-hidden">
                <button
                    onClick={resetAndClose}
                    className="absolute top-4 right-4 z-10 text-muted-foreground hover:text-foreground transition-colors"
                >
                    <X className="h-5 w-5" />
                </button>

                {/* Success State */}
                {isSuccess ? (
                    <div className="p-10 text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                            <CheckCircle2 className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground">Thanh toán thành công!</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Gói {planName} đã được kích hoạt.
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Header */}
                        <div className="border-b border-border p-6">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                                    <CreditCard className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-foreground">Thanh toán</h3>
                                    <p className="text-sm text-muted-foreground">Nâng cấp lên gói {planName}</p>
                                </div>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="mx-6 mt-5 rounded-xl bg-secondary p-4">
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-muted-foreground">Gói {planName}</span>
                                <span className="text-foreground font-medium">${planPrice}/{billingCycle}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Thuế</span>
                                <span className="text-foreground font-medium">$0.00</span>
                            </div>
                            <div className="border-t border-border my-3" />
                            <div className="flex justify-between text-sm">
                                <span className="text-foreground font-semibold">Tổng cộng</span>
                                <span className="text-gradient font-bold text-lg">${planPrice}</span>
                            </div>
                        </div>

                        {/* Card Form */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {/* Card Number */}
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1.5">
                                    Số thẻ
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="1234 5678 9012 3456"
                                        value={cardNumber}
                                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                                        className="w-full rounded-lg bg-secondary border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring pr-12"
                                    />
                                    <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                </div>
                            </div>

                            {/* Card Holder */}
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1.5">
                                    Tên chủ thẻ
                                </label>
                                <input
                                    type="text"
                                    placeholder="NGUYEN VAN A"
                                    value={cardName}
                                    onChange={(e) => setCardName(e.target.value.toUpperCase())}
                                    className="w-full rounded-lg bg-secondary border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                />
                            </div>

                            {/* Expiry & CVV */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1.5">
                                        Ngày hết hạn
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="MM/YY"
                                        value={expiry}
                                        onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                                        className="w-full rounded-lg bg-secondary border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1.5">
                                        CVV
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="123"
                                        value={cvv}
                                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                                        className="w-full rounded-lg bg-secondary border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                    />
                                </div>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={!isFormValid || isProcessing}
                                className={cn(
                                    "w-full rounded-lg py-3.5 text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2",
                                    isFormValid && !isProcessing
                                        ? "bg-primary text-primary-foreground btn-primary-glow hover:opacity-90"
                                        : "bg-secondary text-muted-foreground cursor-not-allowed"
                                )}
                            >
                                {isProcessing ? (
                                    <>
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                                        Đang xử lý...
                                    </>
                                ) : (
                                    <>
                                        <Lock className="h-4 w-4" />
                                        Thanh toán ${planPrice}
                                    </>
                                )}
                            </button>

                            <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1">
                                <Lock className="h-3 w-3" />
                                Thanh toán được mã hóa và bảo mật SSL
                            </p>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default PaymentModal;
