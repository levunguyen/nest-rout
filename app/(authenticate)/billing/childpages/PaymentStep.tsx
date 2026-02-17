"use client"
import { useState } from "react";
import { CreditCard, Lock, Wallet, Building2, Smartphone, Bookmark, ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "../../../../components/lib/utils";

type PaymentMethod = "card" | "ewallet" | "bank" | "inapp";
type PaymentFrequency = "onetime" | "recurring";

interface PaymentStepProps {
    planName: string;
    renewalLabel: string;
    billingLabel: string;
    currentPrice: number;
    isProcessing: boolean;
    onSubmit: () => void;
    onBack: () => void;
}

const paymentMethods: { id: PaymentMethod; label: string; icon: React.ElementType; desc: string }[] = [
    { id: "card", label: "Credit/Debit Card", icon: CreditCard, desc: "Visa, Mastercard, JCB" },
    { id: "ewallet", label: "Ví điện tử", icon: Wallet, desc: "MoMo, ZaloPay, VNPay" },
    { id: "bank", label: "Chuyển khoản", icon: Building2, desc: "Chuyển khoản ngân hàng" },
    { id: "inapp", label: "In-App Purchase", icon: Smartphone, desc: "Apple Pay / Google Pay" },
];

const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
};

const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length > 2) return digits.slice(0, 2) + "/" + digits.slice(2);
    return digits;
};

const PaymentStep = ({
    planName,
    renewalLabel,
    billingLabel,
    currentPrice,
    isProcessing,
    onSubmit,
    onBack,
}: PaymentStepProps) => {
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
    const [paymentFrequency, setPaymentFrequency] = useState<PaymentFrequency>("recurring");
    const [saveMethod, setSaveMethod] = useState(true);

    // Card form
    const [cardNumber, setCardNumber] = useState("");
    const [cardName, setCardName] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cvv, setCvv] = useState("");

    const isCardValid =
        cardNumber.replace(/\s/g, "").length === 16 &&
        cardName.trim().length > 0 &&
        expiry.length === 5 &&
        cvv.length >= 3;

    const isFormValid = paymentMethod === "card" ? isCardValid : true;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid) return;
        onSubmit();
    };

    return (
        <div className="px-6 pb-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Thanh toán</h3>

            {/* Summary */}
            <div className="rounded-xl bg-secondary p-4 mb-5">
                <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-muted-foreground">Gói</span>
                    <span className="text-foreground font-medium">{planName}</span>
                </div>
                <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-muted-foreground">Gia hạn</span>
                    <span className="text-foreground font-medium">{renewalLabel}</span>
                </div>
                <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-muted-foreground">Chu kỳ</span>
                    <span className="text-foreground font-medium">{billingLabel === "năm" ? "Hàng năm" : "Hàng tháng"}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Loại thanh toán</span>
                    <span className="text-foreground font-medium">
                        {paymentFrequency === "recurring" ? "Định kỳ" : "Một lần"}
                    </span>
                </div>
                <div className="border-t border-border my-3" />
                <div className="flex justify-between">
                    <span className="text-foreground font-semibold text-sm">Tổng cộng</span>
                    <span className="text-gradient font-bold text-lg">${currentPrice}/{billingLabel}</span>
                </div>
            </div>

            {/* Payment Frequency */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-foreground mb-2">Loại thanh toán</label>
                <div className="inline-flex items-center rounded-full bg-secondary p-1">
                    <button
                        type="button"
                        onClick={() => setPaymentFrequency("recurring")}
                        className={cn(
                            "rounded-full px-4 py-1.5 text-xs font-medium transition-all",
                            paymentFrequency === "recurring" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                        )}
                    >
                        Định kỳ
                    </button>
                    <button
                        type="button"
                        onClick={() => setPaymentFrequency("onetime")}
                        className={cn(
                            "rounded-full px-4 py-1.5 text-xs font-medium transition-all",
                            paymentFrequency === "onetime" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                        )}
                    >
                        Một lần
                    </button>
                </div>
            </div>

            {/* Payment Methods */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-foreground mb-2">Phương thức thanh toán</label>
                <div className="grid grid-cols-2 gap-2">
                    {paymentMethods.map((m) => {
                        const Icon = m.icon;
                        const isActive = paymentMethod === m.id;
                        return (
                            <button
                                key={m.id}
                                type="button"
                                onClick={() => setPaymentMethod(m.id)}
                                className={cn(
                                    "rounded-xl p-3 text-left transition-all",
                                    isActive
                                        ? "bg-primary/10 border border-primary/40 ring-1 ring-primary/20"
                                        : "bg-secondary hover:bg-secondary/80 border border-transparent"
                                )}
                            >
                                <div className="flex items-center gap-2 mb-0.5">
                                    <Icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")} />
                                    <span className="text-xs font-semibold text-foreground">{m.label}</span>
                                </div>
                                <p className="text-[10px] text-muted-foreground pl-6">{m.desc}</p>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Payment Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                {paymentMethod === "card" && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1.5">Số thẻ</label>
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
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1.5">Tên chủ thẻ</label>
                            <input
                                type="text"
                                placeholder="NGUYEN VAN A"
                                value={cardName}
                                onChange={(e) => setCardName(e.target.value.toUpperCase())}
                                className="w-full rounded-lg bg-secondary border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1.5">Hết hạn</label>
                                <input
                                    type="text"
                                    placeholder="MM/YY"
                                    value={expiry}
                                    onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                                    className="w-full rounded-lg bg-secondary border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1.5">CVV</label>
                                <input
                                    type="text"
                                    placeholder="123"
                                    value={cvv}
                                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                                    className="w-full rounded-lg bg-secondary border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                />
                            </div>
                        </div>
                    </>
                )}

                {paymentMethod === "ewallet" && (
                    <div className="rounded-xl bg-secondary p-5 text-center">
                        <Wallet className="h-8 w-8 text-primary mx-auto mb-2" />
                        <p className="text-sm text-foreground font-medium mb-1">Chọn ví điện tử</p>
                        <p className="text-xs text-muted-foreground mb-3">Bạn sẽ được chuyển đến ứng dụng ví để hoàn tất thanh toán</p>
                        <div className="flex justify-center gap-2">
                            {["MoMo", "ZaloPay", "VNPay"].map((w) => (
                                <button
                                    key={w}
                                    type="button"
                                    className="rounded-lg bg-card border border-border px-4 py-2 text-xs font-medium text-foreground hover:border-primary/40 transition-colors"
                                >
                                    {w}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {paymentMethod === "bank" && (
                    <div className="rounded-xl bg-secondary p-5">
                        <Building2 className="h-8 w-8 text-primary mx-auto mb-2" />
                        <p className="text-sm text-foreground font-medium text-center mb-3">Thông tin chuyển khoản</p>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Ngân hàng</span>
                                <span className="text-foreground font-medium">Vietcombank</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Số tài khoản</span>
                                <span className="text-foreground font-medium">1234 5678 9012</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Chủ tài khoản</span>
                                <span className="text-foreground font-medium">CONG TY ABC</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Nội dung CK</span>
                                <span className="text-foreground font-medium">UPGRADE {planName.toUpperCase()}</span>
                            </div>
                        </div>
                    </div>
                )}

                {paymentMethod === "inapp" && (
                    <div className="rounded-xl bg-secondary p-5 text-center">
                        <Smartphone className="h-8 w-8 text-primary mx-auto mb-2" />
                        <p className="text-sm text-foreground font-medium mb-1">In-App Purchase</p>
                        <p className="text-xs text-muted-foreground mb-3">Thanh toán qua Apple Pay hoặc Google Pay</p>
                        <div className="flex justify-center gap-2">
                            {["Apple Pay", "Google Pay"].map((p) => (
                                <button
                                    key={p}
                                    type="button"
                                    className="rounded-lg bg-card border border-border px-4 py-2 text-xs font-medium text-foreground hover:border-primary/40 transition-colors"
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Save payment method */}
                <label className="flex items-center gap-3 cursor-pointer">
                    <button
                        type="button"
                        onClick={() => setSaveMethod(!saveMethod)}
                        className={cn(
                            "flex h-5 w-5 items-center justify-center rounded border transition-colors",
                            saveMethod
                                ? "bg-primary border-primary"
                                : "border-border bg-secondary"
                        )}
                    >
                        {saveMethod && <Bookmark className="h-3 w-3 text-primary-foreground" />}
                    </button>
                    <span className="text-sm text-foreground">Lưu phương thức thanh toán cho lần sau</span>
                </label>

                {/* Actions */}
                <div className="flex gap-3 pt-1">
                    <button
                        type="button"
                        onClick={onBack}
                        className="flex-1 rounded-lg bg-secondary py-3 text-sm font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors flex items-center justify-center gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" /> Quay lại
                    </button>
                    <button
                        type="submit"
                        disabled={!isFormValid || isProcessing}
                        className={cn(
                            "flex-1 rounded-lg py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-all",
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
                                Thanh toán ${currentPrice}
                            </>
                        )}
                    </button>
                </div>

                <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1">
                    <Lock className="h-3 w-3" />
                    Thanh toán được mã hóa và bảo mật SSL
                </p>
            </form>
        </div>
    );
};

export default PaymentStep;
