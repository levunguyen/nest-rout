"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import UpgradeFlowModal from "./UpgradeFlowModal";

interface PricingCardProps {
  name: string;
  price: { monthly: number; yearly: number };
  description: string;
  features: string[];
  featured?: boolean;
  isYearly: boolean;
  cta: string;
}

export default function PricingCard({
  name,
  price,
  description,
  features,
  featured = false,
  isYearly,
  cta,
}: PricingCardProps) {
  const [showUpgrade, setShowUpgrade] = useState(false);
  const currentPrice = isYearly ? price.yearly : price.monthly;

  return (
    <>
      <article className={`rounded-2xl border bg-white p-6 shadow-sm ${featured ? "border-[#16A34A]" : "border-[#E2E8F0]"}`}>
        {featured ? (
          <span className="mb-3 inline-flex rounded-full bg-[#DCFCE7] px-2.5 py-1 text-xs font-semibold text-[#166534]">
            Phổ biến nhất
          </span>
        ) : null}
        <h3 className="text-lg font-bold text-[#0F172A]">{name}</h3>
        <p className="mt-1 text-sm text-[#475569]">{description}</p>

        <div className="mt-4">
          <p className="text-4xl font-bold text-[#0F172A]">{currentPrice === 0 ? "Miễn phí" : `$${currentPrice}`}</p>
          {currentPrice > 0 ? <p className="text-xs text-[#64748B]">/{isYearly ? "năm" : "tháng"}</p> : null}
        </div>

        <ul className="mt-4 space-y-2">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-2 text-sm text-[#334155]">
              <Check className="mt-0.5 h-4 w-4 text-[#16A34A]" />
              {feature}
            </li>
          ))}
        </ul>

        <button
          onClick={() => currentPrice > 0 && setShowUpgrade(true)}
          className={`mt-5 w-full rounded-lg py-2.5 text-sm font-semibold ${
            featured ? "bg-[#16A34A] text-white hover:bg-[#15803D]" : "border border-[#E2E8F0] text-[#0F172A] hover:bg-[#F8FAF8]"
          }`}
        >
          {cta}
        </button>
      </article>

      <UpgradeFlowModal
        isOpen={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        initialYearly={isYearly}
        preselectedPlanName={name}
      />
    </>
  );
}
