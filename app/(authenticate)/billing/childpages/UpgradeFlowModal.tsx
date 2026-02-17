"use client";

import { useState } from "react";
import { X, CheckCircle2, Check, RefreshCw, RotateCcw, ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "../../../../components/lib/utils";
import { toast } from "sonner";
import PaymentStep from "./PaymentStep";

interface Plan {
    name: string;
    price: { monthly: number; yearly: number };
    features: string[];
}

const plans: Plan[] = [
    {
        name: "Pro",
        price: { monthly: 19, yearly: 182 },
        features: ["Không giới hạn dự án", "50GB lưu trữ", "Hỗ trợ 24/7", "API access"],
    },
    {
        name: "Enterprise",
        price: { monthly: 79, yearly: 758 },
        features: ["Mọi tính năng Pro", "Lưu trữ không giới hạn", "SSO & SAML", "SLA 99.99%"],
    },
];

type RenewalType = "auto" | "manual";
type Step = "plan" | "renewal" | "payment";

interface UpgradeFlowModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialYearly?: boolean;
    preselectedPlanName?: string;
}


const UpgradeFlowModal = ({ isOpen, onClose, initialYearly = false, preselectedPlanName }: UpgradeFlowModalProps) => {
    const preselected = preselectedPlanName ? plans.find(p => p.name === preselectedPlanName) || null : null;
    const [step, setStep] = useState<Step>(preselected ? "renewal" : "plan");
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(preselected);
    const [isYearly, setIsYearly] = useState(initialYearly);
    const [renewalType, setRenewalType] = useState<RenewalType>("auto");

    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const currentPrice = selectedPlan ? (isYearly ? selectedPlan.price.yearly : selectedPlan.price.monthly) : 0;
    const billingLabel = isYearly ? "năm" : "tháng";

    const handlePayment = () => {
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            setIsSuccess(true);
            setTimeout(() => {
                toast.success(`Đã nâng cấp lên gói ${selectedPlan?.name} thành công!`);
                resetAndClose();
            }, 1500);
        }, 2000);
    };

    const resetAndClose = () => {
        setStep(preselected ? "renewal" : "plan");
        setSelectedPlan(preselected);
        setRenewalType("auto");
        setIsProcessing(false);
        setIsSuccess(false);
        setIsProcessing(false);
        setIsSuccess(false);
        onClose();
    };

    if (!isOpen) return null;

    const stepIndex = step === "plan" ? 0 : step === "renewal" ? 1 : 2;

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
                            Gói {selectedPlan?.name} ({renewalType === "auto" ? "gia hạn tự động" : "gia hạn thủ công"}) đã được kích hoạt.
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Progress Steps */}
                        <div className="px-6 pt-6 pb-4">
                            <div className="flex items-center justify-between mb-1">
                                {["Chọn gói", "Gia hạn", "Thanh toán"].map((label, i) => (
                                    <div key={label} className="flex items-center gap-2">
                                        <div
                                            className={cn(
                                                "flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                                                i <= stepIndex
                                                    ? "bg-primary text-primary-foreground"
                                                    : "bg-secondary text-muted-foreground"
                                            )}
                                        >
                                            {i < stepIndex ? <Check className="h-3.5 w-3.5" /> : i + 1}
                                        </div>
                                        <span
                                            className={cn(
                                                "text-xs font-medium hidden sm:block",
                                                i <= stepIndex ? "text-foreground" : "text-muted-foreground"
                                            )}
                                        >
                                            {label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-3 h-1 rounded-full bg-secondary overflow-hidden">
                                <div
                                    className="h-full bg-primary rounded-full transition-all duration-300"
                                    style={{ width: `${((stepIndex + 1) / 3) * 100}%` }}
                                />
                            </div>
                        </div>

                        {/* Step 1: Choose Plan */}
                        {step === "plan" && (
                            <div className="px-6 pb-6">
                                <h3 className="text-lg font-semibold text-foreground mb-1">Chọn gói nâng cấp</h3>
                                <p className="text-sm text-muted-foreground mb-4">Chọn gói phù hợp với nhu cầu của bạn</p>

                                {/* Billing Toggle */}
                                <div className="flex justify-center mb-4">
                                    <div className="inline-flex items-center rounded-full bg-secondary p-1">
                                        <button
                                            onClick={() => setIsYearly(false)}
                                            className={cn(
                                                "rounded-full px-4 py-1.5 text-xs font-medium transition-all",
                                                !isYearly ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                                            )}
                                        >
                                            Hàng tháng
                                        </button>
                                        <button
                                            onClick={() => setIsYearly(true)}
                                            className={cn(
                                                "rounded-full px-4 py-1.5 text-xs font-medium transition-all",
                                                isYearly ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                                            )}
                                        >
                                            Hàng năm <span className="text-primary">-20%</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {plans.map((plan) => {
                                        const price = isYearly ? plan.price.yearly : plan.price.monthly;
                                        const isSelected = selectedPlan?.name === plan.name;
                                        return (
                                            <button
                                                key={plan.name}
                                                onClick={() => setSelectedPlan(plan)}
                                                className={cn(
                                                    "w-full rounded-xl p-4 text-left transition-all",
                                                    isSelected
                                                        ? "bg-primary/10 border border-primary/40 ring-1 ring-primary/20"
                                                        : "bg-secondary hover:bg-secondary/80 border border-transparent"
                                                )}
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm font-semibold text-foreground">{plan.name}</span>
                                                    <span className="text-gradient font-bold">${price}<span className="text-xs text-muted-foreground font-normal">/{billingLabel}</span></span>
                                                </div>
                                                <div className="flex flex-wrap gap-x-4 gap-y-1">
                                                    {plan.features.map((f) => (
                                                        <span key={f} className="flex items-center gap-1 text-xs text-muted-foreground">
                                                            <Check className="h-3 w-3 text-primary" />{f}
                                                        </span>
                                                    ))}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>

                                <button
                                    onClick={() => selectedPlan && setStep("renewal")}
                                    disabled={!selectedPlan}
                                    className={cn(
                                        "w-full mt-5 rounded-lg py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-all",
                                        selectedPlan
                                            ? "bg-primary text-primary-foreground btn-primary-glow hover:opacity-90"
                                            : "bg-secondary text-muted-foreground cursor-not-allowed"
                                    )}
                                >
                                    Tiếp tục <ArrowRight className="h-4 w-4" />
                                </button>
                            </div>
                        )}

                        {/* Step 2: Renewal Type */}
                        {step === "renewal" && (
                            <div className="px-6 pb-6">
                                <h3 className="text-lg font-semibold text-foreground mb-1">Chọn kiểu gia hạn</h3>
                                <p className="text-sm text-muted-foreground mb-4">Chọn cách bạn muốn gia hạn gói {selectedPlan?.name}</p>

                                <div className="space-y-3">
                                    <button
                                        onClick={() => setRenewalType("auto")}
                                        className={cn(
                                            "w-full rounded-xl p-5 text-left transition-all",
                                            renewalType === "auto"
                                                ? "bg-primary/10 border border-primary/40 ring-1 ring-primary/20"
                                                : "bg-secondary hover:bg-secondary/80 border border-transparent"
                                        )}
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <RefreshCw className="h-5 w-5 text-primary" />
                                            <span className="font-semibold text-foreground">Gia hạn tự động</span>
                                            {renewalType === "auto" && (
                                                <span className="ml-auto rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">Khuyên dùng</span>
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground pl-8">
                                            Gói sẽ tự động gia hạn mỗi {billingLabel}. Không cần thao tác thủ công, không bị gián đoạn dịch vụ.
                                        </p>
                                    </button>

                                    <button
                                        onClick={() => setRenewalType("manual")}
                                        className={cn(
                                            "w-full rounded-xl p-5 text-left transition-all",
                                            renewalType === "manual"
                                                ? "bg-primary/10 border border-primary/40 ring-1 ring-primary/20"
                                                : "bg-secondary hover:bg-secondary/80 border border-transparent"
                                        )}
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <RotateCcw className="h-5 w-5 text-muted-foreground" />
                                            <span className="font-semibold text-foreground">Gia hạn thủ công</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground pl-8">
                                            Bạn tự gia hạn khi cần. Gói sẽ hết hạn khi chu kỳ kết thúc nếu không gia hạn.
                                        </p>
                                    </button>
                                </div>

                                <div className="flex gap-3 mt-5">
                                    <button
                                        onClick={() => setStep("plan")}
                                        className="flex-1 rounded-lg bg-secondary py-3 text-sm font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <ArrowLeft className="h-4 w-4" /> Quay lại
                                    </button>
                                    <button
                                        onClick={() => setStep("payment")}
                                        className="flex-1 rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground btn-primary-glow hover:opacity-90 transition-all flex items-center justify-center gap-2"
                                    >
                                        Tiếp tục <ArrowRight className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === "payment" && (
                            <PaymentStep
                                planName={selectedPlan?.name || ""}
                                renewalLabel={renewalType === "auto" ? "Tự động" : "Thủ công"}
                                billingLabel={billingLabel}
                                currentPrice={currentPrice}
                                isProcessing={isProcessing}
                                onSubmit={handlePayment}
                                onBack={() => setStep("renewal")}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default UpgradeFlowModal;
