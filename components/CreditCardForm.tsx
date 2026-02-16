import { useState } from "react";
import { CreditCard, Lock, X, Check } from "lucide-react";
import { cn } from "./lib/utils";
import { useToast } from "./hooks/use-toast";

interface CreditCardFormProps {
    planName: string;
    price: string;
    period?: string;
    onClose: () => void;
}

const CreditCardForm = ({ planName, price, period, onClose }: CreditCardFormProps) => {
    const { toast } = useToast();
    const [cardNumber, setCardNumber] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cvv, setCvv] = useState("");
    const [name, setName] = useState("");
    const [processing, setProcessing] = useState(false);
    const [success, setSuccess] = useState(false);

    const formatCardNumber = (value: string) => {
        const digits = value.replace(/\D/g, "").slice(0, 16);
        return digits.replace(/(.{4})/g, "$1 ").trim();
    };

    const formatExpiry = (value: string) => {
        const digits = value.replace(/\D/g, "").slice(0, 4);
        if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
        return digits;
    };

    const getCardType = () => {
        const num = cardNumber.replace(/\s/g, "");
        if (num.startsWith("4")) return "Visa";
        if (/^5[1-5]/.test(num) || /^2[2-7]/.test(num)) return "Mastercard";
        if (num.startsWith("3")) return "Amex";
        return null;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        setTimeout(() => {
            setProcessing(false);
            setSuccess(true);
            toast({
                title: "Đăng ký thành công! (Demo)",
                description: `Gói ${planName} – ${price}${period ? `/${period}` : ""}`,
            });
        }, 2000);
    };

    const cardType = getCardType();
    const isValid =
        cardNumber.replace(/\s/g, "").length >= 15 &&
        expiry.length === 5 &&
        cvv.length >= 3 &&
        name.trim().length > 1;

    if (success) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-xl animate-in fade-in zoom-in-95">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/20">
                        <Check className="h-8 w-8 text-accent" />
                    </div>
                    <h3 className="font-display text-xl font-bold text-foreground">Đăng ký thành công!</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Gói <strong>{planName}</strong> – {price}{period ? `/${period}` : ""}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">(Đây là bản demo, chưa tính phí thật)</p>
                    <button
                        onClick={onClose}
                        className="mt-6 w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-md rounded-2xl border border-border bg-card shadow-xl animate-in fade-in zoom-in-95">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-border px-6 py-4">
                    <div>
                        <h3 className="font-display text-lg font-bold text-foreground">Thanh toán</h3>
                        <p className="text-xs text-muted-foreground">
                            {planName} – {price}{period ? `/${period}` : ""}
                        </p>
                    </div>
                    <button onClick={onClose} className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Card Number */}
                    <div>
                        <label className="mb-1.5 block text-xs font-medium text-foreground">Số thẻ</label>
                        <div className="relative">
                            <CreditCard className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="1234 5678 9012 3456"
                                value={cardNumber}
                                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                                className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-16 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                                maxLength={19}
                            />
                            {cardType && (
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 rounded bg-secondary px-2 py-0.5 text-[10px] font-semibold text-secondary-foreground">
                                    {cardType}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Expiry + CVV */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-foreground">Ngày hết hạn</label>
                            <input
                                type="text"
                                placeholder="MM/YY"
                                value={expiry}
                                onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                                className="w-full rounded-xl border border-border bg-background py-3 px-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                                maxLength={5}
                            />
                        </div>
                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-foreground">CVV</label>
                            <input
                                type="text"
                                placeholder="123"
                                value={cvv}
                                onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                                className="w-full rounded-xl border border-border bg-background py-3 px-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                                maxLength={4}
                            />
                        </div>
                    </div>

                    {/* Cardholder Name */}
                    <div>
                        <label className="mb-1.5 block text-xs font-medium text-foreground">Tên chủ thẻ</label>
                        <input
                            type="text"
                            placeholder="NGUYEN VAN A"
                            value={name}
                            onChange={(e) => setName(e.target.value.toUpperCase())}
                            className="w-full rounded-xl border border-border bg-background py-3 px-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent uppercase"
                            maxLength={50}
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={!isValid || processing}
                        className={cn(
                            "w-full rounded-xl py-3 text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2",
                            isValid
                                ? "bg-accent text-accent-foreground hover:brightness-110 shadow-sm"
                                : "bg-muted text-muted-foreground cursor-not-allowed"
                        )}
                    >
                        {processing ? (
                            <>
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-accent-foreground/30 border-t-accent-foreground" />
                                Đang xử lý...
                            </>
                        ) : (
                            <>
                                <Lock className="h-4 w-4" />
                                Thanh toán {price}{period ? `/${period}` : ""}
                            </>
                        )}
                    </button>

                    {/* Security note */}
                    <p className="flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground">
                        <Lock className="h-3 w-3" />
                        Bảo mật SSL 256-bit · Demo – không tính phí thật
                    </p>
                </form>
            </div>
        </div>
    );
};

export default CreditCardForm;
