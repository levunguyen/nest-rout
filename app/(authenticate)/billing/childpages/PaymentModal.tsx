"use client";

import { useState } from "react";
import { CheckCircle2, CreditCard, Lock, X } from "lucide-react";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName?: string;
  planPrice?: number;
  billingCycle?: string;
}

const formatCardNumber = (value: string) => value.replace(/\D/g, "").slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 ");
const formatExpiry = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
};

export default function PaymentModal({
  isOpen,
  onClose,
  planName = "Pro",
  planPrice = 19,
  billingCycle = "tháng",
}: PaymentModalProps) {
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const isFormValid = cardNumber.replace(/\s/g, "").length === 16 && !!cardName && expiry.length === 5 && cvv.length >= 3;

  const resetAndClose = () => {
    setCardNumber("");
    setCardName("");
    setExpiry("");
    setCvv("");
    setIsProcessing(false);
    setIsSuccess(false);
    onClose();
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(resetAndClose, 1200);
    }, 1500);
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
            <h3 className="text-xl font-bold text-[#0F172A]">Thanh toán thành công</h3>
            <p className="mt-1 text-sm text-[#475569]">Gói {planName} đã được kích hoạt.</p>
          </div>
        ) : (
          <>
            <div className="border-b border-[#E2E8F0] p-6">
              <h3 className="text-lg font-semibold text-[#0F172A]">Thanh toán gói {planName}</h3>
              <p className="mt-1 text-sm text-[#475569]">Tổng cộng ${planPrice}/{billingCycle}</p>
            </div>

            <form onSubmit={onSubmit} className="space-y-4 p-6">
              <div>
                <label className="mb-1 block text-sm font-medium text-[#0F172A]">Số thẻ</label>
                <div className="relative">
                  <input
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    placeholder="1234 5678 9012 3456"
                    className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20"
                  />
                  <CreditCard className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-[#0F172A]">Tên chủ thẻ</label>
                <input
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value.toUpperCase())}
                  placeholder="NGUYEN VAN A"
                  className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  value={expiry}
                  onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                  placeholder="MM/YY"
                  className="rounded-lg border border-[#E2E8F0] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20"
                />
                <input
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  placeholder="CVV"
                  className="rounded-lg border border-[#E2E8F0] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20"
                />
              </div>

              <button
                type="submit"
                disabled={!isFormValid || isProcessing}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#16A34A] py-2.5 text-sm font-semibold text-white hover:bg-[#15803D] disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    Thanh toán ${planPrice}
                  </>
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
