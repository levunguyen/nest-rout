"use client"

import { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "../../../../components/lib/utils";
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

const PricingCard = ({
    name,
    price,
    description,
    features,
    featured = false,
    isYearly,
    cta,
}: PricingCardProps) => {
    const [showUpgrade, setShowUpgrade] = useState(false);
    const currentPrice = isYearly ? price.yearly : price.monthly;

    return (
        <>
            <div
                className={cn(
                    "relative rounded-2xl p-8 flex flex-col transition-all duration-300 hover:-translate-y-1",
                    featured ? "glass-card-featured" : "glass-card"
                )}
            >
                {featured && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground">
                            Phổ biến nhất
                        </span>
                    </div>
                )}

                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-foreground">{name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{description}</p>
                </div>

                <div className="mb-8">
                    <div className="flex items-baseline gap-1">
                        <span className={cn("text-4xl font-bold", featured ? "text-gradient" : "text-foreground")}>
                            {currentPrice === 0 ? "Miễn phí" : `$${currentPrice}`}
                        </span>
                        {currentPrice > 0 && (
                            <span className="text-muted-foreground text-sm">
                                /{isYearly ? "năm" : "tháng"}
                            </span>
                        )}
                    </div>
                    {isYearly && currentPrice > 0 && (
                        <p className="mt-1 text-xs text-primary">
                            Tiết kiệm ${(price.monthly * 12 - price.yearly).toFixed(0)}/năm
                        </p>
                    )}
                </div>

                <ul className="mb-8 flex-1 space-y-3">
                    {features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3 text-sm">
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            <span className="text-muted-foreground">{feature}</span>
                        </li>
                    ))}
                </ul>

                <button
                    onClick={() => currentPrice > 0 && setShowUpgrade(true)}
                    className={cn(
                        "w-full rounded-lg py-3 text-sm font-semibold transition-all duration-200",
                        featured
                            ? "bg-primary text-primary-foreground btn-primary-glow hover:opacity-90"
                            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    )}
                >
                    {cta}
                </button>
            </div>

            <UpgradeFlowModal
                isOpen={showUpgrade}
                onClose={() => setShowUpgrade(false)}
                initialYearly={isYearly}
                preselectedPlanName={name}
            />
        </>
    );
};

export default PricingCard;
