"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, RefreshCw, RotateCcw, X } from "lucide-react";
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

type Step = "plan" | "renewal" | "payment";
type RenewalType = "auto" | "manual";

interface UpgradeFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialYearly?: boolean;
  preselectedPlanName?: string;
}

export default function UpgradeFlowModal({
  isOpen,
  onClose,
  initialYearly = false,
  preselectedPlanName,
}: UpgradeFlowModalProps) {
  const preselected = useMemo(
    () => (preselectedPlanName ? plans.find((plan) => plan.name === preselectedPlanName) ?? null : null),
    [preselectedPlanName],
  );
  const [step, setStep] = useState<Step>(preselected ? "renewal" : "plan");
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(preselected);
  const [isYearly, setIsYearly] = useState(initialYearly);
  const [renewalType, setRenewalType] = useState<RenewalType>("auto");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const currentPrice = selectedPlan ? (isYearly ? selectedPlan.price.yearly : selectedPlan.price.monthly) : 0;
  const billingLabel = isYearly ? "năm" : "tháng";
  const stepIndex = step === "plan" ? 0 : step === "renewal" ? 1 : 2;

  const resetAndClose = () => {
    setStep(preselected ? "renewal" : "plan");
    setSelectedPlan(preselected);
    setRenewalType("auto");
    setIsYearly(initialYearly);
    setIsProcessing(false);
    setIsSuccess(false);
    onClose();
  };

  const handlePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(resetAndClose, 1200);
    }, 1600);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="relative w-full max-w-lg rounded-2xl border border-[#E2E8F0] bg-white shadow-xl">
        <button onClick={resetAndClose} className="absolute right-4 top-4 text-[#64748B] hover:text-[#0F172A]">
          <X className="h-5 w-5" />
        </button>

        {isSuccess ? (
          <div className="p-10 text-center">
            <div className="mx-auto mb-3 inline-flex rounded-full bg-[#DCFCE7] p-3 text-[#16A34A]">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-bold text-[#0F172A]">Nâng cấp thành công</h3>
            <p className="mt-1 text-sm text-[#475569]">
              Gói {selectedPlan?.name} ({renewalType === "auto" ? "gia hạn tự động" : "gia hạn thủ công"}) đã kích hoạt.
            </p>
          </div>
        ) : (
          <>
            <div className="border-b border-[#E2E8F0] px-6 py-4">
              <div className="flex items-center justify-between">
                {["Chọn gói", "Gia hạn", "Thanh toán"].map((label, i) => (
                  <div key={label} className="flex items-center gap-2">
                    <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${i <= stepIndex ? "bg-[#16A34A] text-white" : "bg-[#E2E8F0] text-[#64748B]"}`}>
                      {i < stepIndex ? <Check className="h-3.5 w-3.5" /> : i + 1}
                    </span>
                    <span className={`hidden text-xs font-medium sm:block ${i <= stepIndex ? "text-[#0F172A]" : "text-[#64748B]"}`}>{label}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 h-1 rounded-full bg-[#E2E8F0]">
                <div className="h-1 rounded-full bg-[#16A34A] transition-all" style={{ width: `${((stepIndex + 1) / 3) * 100}%` }} />
              </div>
            </div>

            {step === "plan" ? (
              <div className="space-y-4 px-6 pb-6 pt-4">
                <div className="flex justify-center">
                  <div className="inline-flex rounded-lg border border-[#E2E8F0] bg-[#F8FAF8] p-1">
                    <button onClick={() => setIsYearly(false)} className={`rounded-md px-3 py-1.5 text-xs font-medium ${!isYearly ? "bg-[#16A34A] text-white" : "text-[#334155]"}`}>Hàng tháng</button>
                    <button onClick={() => setIsYearly(true)} className={`rounded-md px-3 py-1.5 text-xs font-medium ${isYearly ? "bg-[#16A34A] text-white" : "text-[#334155]"}`}>Hàng năm</button>
                  </div>
                </div>

                <div className="space-y-2">
                  {plans.map((plan) => {
                    const price = isYearly ? plan.price.yearly : plan.price.monthly;
                    const selected = selectedPlan?.name === plan.name;
                    return (
                      <button
                        key={plan.name}
                        onClick={() => setSelectedPlan(plan)}
                        className={`w-full rounded-xl border p-4 text-left ${selected ? "border-[#16A34A] bg-[#DCFCE7]" : "border-[#E2E8F0] bg-[#F8FAF8]"}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-[#0F172A]">{plan.name}</span>
                          <span className="font-bold text-[#16A34A]">${price}/{billingLabel}</span>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {plan.features.map((feature) => (
                            <span key={feature} className="rounded-full bg-white px-2 py-0.5 text-[11px] text-[#475569]">{feature}</span>
                          ))}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => selectedPlan && setStep("renewal")}
                  disabled={!selectedPlan}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#16A34A] py-2.5 text-sm font-semibold text-white disabled:opacity-50"
                >
                  Tiếp tục <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            ) : null}

            {step === "renewal" ? (
              <div className="space-y-3 px-6 pb-6 pt-4">
                <button
                  onClick={() => setRenewalType("auto")}
                  className={`w-full rounded-xl border p-4 text-left ${renewalType === "auto" ? "border-[#16A34A] bg-[#DCFCE7]" : "border-[#E2E8F0] bg-[#F8FAF8]"}`}
                >
                  <p className="inline-flex items-center gap-2 font-semibold text-[#0F172A]"><RefreshCw className="h-4 w-4 text-[#16A34A]" /> Gia hạn tự động</p>
                  <p className="mt-1 text-sm text-[#475569]">Tự động gia hạn mỗi {billingLabel} để không bị gián đoạn.</p>
                </button>
                <button
                  onClick={() => setRenewalType("manual")}
                  className={`w-full rounded-xl border p-4 text-left ${renewalType === "manual" ? "border-[#16A34A] bg-[#DCFCE7]" : "border-[#E2E8F0] bg-[#F8FAF8]"}`}
                >
                  <p className="inline-flex items-center gap-2 font-semibold text-[#0F172A]"><RotateCcw className="h-4 w-4 text-[#16A34A]" /> Gia hạn thủ công</p>
                  <p className="mt-1 text-sm text-[#475569]">Tự gia hạn khi cần trước khi đến hạn.</p>
                </button>
                <div className="flex gap-2">
                  <button onClick={() => setStep("plan")} className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#E2E8F0] py-2.5 text-sm font-medium text-[#0F172A]">
                    <ArrowLeft className="h-4 w-4" /> Quay lại
                  </button>
                  <button onClick={() => setStep("payment")} className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#16A34A] py-2.5 text-sm font-semibold text-white">
                    Tiếp tục <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : null}

            {step === "payment" ? (
              <PaymentStep
                planName={selectedPlan?.name ?? ""}
                renewalLabel={renewalType === "auto" ? "Tự động" : "Thủ công"}
                billingLabel={billingLabel}
                currentPrice={currentPrice}
                isProcessing={isProcessing}
                onSubmit={handlePayment}
                onBack={() => setStep("renewal")}
              />
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
