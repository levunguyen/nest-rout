"use client";

import { cn } from "@/components/lib/utils";

interface BillingToggleProps {
  isYearly: boolean;
  onToggle: (yearly: boolean) => void;
}

export default function BillingToggle({ isYearly, onToggle }: BillingToggleProps) {
  return (
    <div className="inline-flex items-center rounded-lg border border-[#E2E8F0] bg-[#F8FAF8] p-1">
      <button
        onClick={() => onToggle(false)}
        className={cn(
          "rounded-md px-4 py-1.5 text-sm font-medium transition",
          !isYearly ? "bg-[#16A34A] text-white" : "text-[#334155]",
        )}
      >
        Hàng tháng
      </button>
      <button
        onClick={() => onToggle(true)}
        className={cn(
          "rounded-md px-4 py-1.5 text-sm font-medium transition",
          isYearly ? "bg-[#16A34A] text-white" : "text-[#334155]",
        )}
      >
        Hàng năm <span className={cn("ml-1 text-xs", isYearly ? "text-white/90" : "text-[#166534]")}>-20%</span>
      </button>
    </div>
  );
}
