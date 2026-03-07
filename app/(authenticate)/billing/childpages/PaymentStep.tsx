"use client";

import { useState } from "react";
import { ArrowLeft, Building2, CreditCard, Lock, Smartphone, Wallet } from "lucide-react";

type PaymentMethod = "card" | "ewallet" | "bank" | "inapp";

interface PaymentStepProps {
  planName: string;
  renewalLabel: string;
  billingLabel: string;
  currentPrice: number;
  isProcessing: boolean;
  onSubmit: () => void;
  onBack: () => void;
}

const formatCardNumber = (value: string) => value.replace(/\D/g, "").slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 ");
const formatExpiry = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
};

export default function PaymentStep({
  planName,
  renewalLabel,
  billingLabel,
  currentPrice,
  isProcessing,
  onSubmit,
  onBack,
}: PaymentStepProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const isCardValid = cardNumber.replace(/\s/g, "").length === 16 && !!cardName && expiry.length === 5 && cvv.length >= 3;
  const isFormValid = paymentMethod === "card" ? isCardValid : true;

  return (
    <div className="space-y-4 px-6 pb-6">
      <h3 className="text-lg font-semibold text-[#0F172A]">Thanh toán</h3>

      <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAF8] p-4 text-sm">
        <div className="flex justify-between"><span className="text-[#64748B]">Gói</span><span className="font-medium text-[#0F172A]">{planName}</span></div>
        <div className="mt-1 flex justify-between"><span className="text-[#64748B]">Gia hạn</span><span className="font-medium text-[#0F172A]">{renewalLabel}</span></div>
        <div className="mt-1 flex justify-between"><span className="text-[#64748B]">Chu kỳ</span><span className="font-medium text-[#0F172A]">{billingLabel}</span></div>
        <div className="mt-2 border-t border-[#E2E8F0] pt-2 flex justify-between"><span className="font-semibold text-[#0F172A]">Tổng cộng</span><span className="text-lg font-bold text-[#16A34A]">${currentPrice}/{billingLabel}</span></div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {[
          { id: "card", icon: CreditCard, label: "Card" },
          { id: "ewallet", icon: Wallet, label: "Ví điện tử" },
          { id: "bank", icon: Building2, label: "Chuyển khoản" },
          { id: "inapp", icon: Smartphone, label: "In-app" },
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setPaymentMethod(item.id as PaymentMethod)}
            className={`rounded-lg border px-3 py-2 text-left text-sm ${paymentMethod === item.id ? "border-[#16A34A] bg-[#DCFCE7] text-[#166534]" : "border-[#E2E8F0] bg-white text-[#334155]"}`}
          >
            <span className="inline-flex items-center gap-2">
              <item.icon className="h-4 w-4" />
              {item.label}
            </span>
          </button>
        ))}
      </div>

      {paymentMethod === "card" ? (
        <div className="space-y-3">
          <input value={cardNumber} onChange={(e) => setCardNumber(formatCardNumber(e.target.value))} placeholder="1234 5678 9012 3456" className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2.5 text-sm" />
          <input value={cardName} onChange={(e) => setCardName(e.target.value.toUpperCase())} placeholder="CARD HOLDER NAME" className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2.5 text-sm" />
          <div className="grid grid-cols-2 gap-3">
            <input value={expiry} onChange={(e) => setExpiry(formatExpiry(e.target.value))} placeholder="MM/YY" className="rounded-lg border border-[#E2E8F0] px-3 py-2.5 text-sm" />
            <input value={cvv} onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="CVV" className="rounded-lg border border-[#E2E8F0] px-3 py-2.5 text-sm" />
          </div>
        </div>
      ) : (
        <p className="rounded-lg border border-[#E2E8F0] bg-[#F8FAF8] p-3 text-sm text-[#475569]">
          Bạn sẽ được chuyển đến cổng thanh toán để hoàn tất giao dịch.
        </p>
      )}

      <div className="flex gap-2">
        <button onClick={onBack} className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#E2E8F0] py-2.5 text-sm font-medium text-[#0F172A]">
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </button>
        <button
          onClick={onSubmit}
          disabled={!isFormValid || isProcessing}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#16A34A] py-2.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          {isProcessing ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
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
    </div>
  );
}
