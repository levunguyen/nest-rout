"use client";

import { cn } from "../../../../components/lib/utils";

interface BillingToggleProps {
    isYearly: boolean;
    onToggle: (yearly: boolean) => void;
}

const BillingToggle = ({ isYearly, onToggle }: BillingToggleProps) => {
    return (
        <div className="inline-flex items-center gap-3 rounded-full bg-secondary p-1">
            <button
                onClick={() => onToggle(false)}
                className={cn(
                    "rounded-full px-5 py-2 text-sm font-medium transition-all duration-200",
                    !isYearly
                        ? "bg-card text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                )}
            >
                Hàng tháng
            </button>
            <button
                onClick={() => onToggle(true)}
                className={cn(
                    "rounded-full px-5 py-2 text-sm font-medium transition-all duration-200",
                    isYearly
                        ? "bg-card text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                )}
            >
                Hàng năm
                <span className="ml-1.5 text-xs text-primary">-20%</span>
            </button>
        </div>
    );
};

export default BillingToggle;
