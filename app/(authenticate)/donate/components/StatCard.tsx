import { Card, CardContent } from "./ui/card";
import { cn } from "../lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
    title: string;
    value: string;
    icon: LucideIcon;
    description?: string;
    variant?: "default" | "primary" | "accent";
}

export function StatCard({
    title,
    value,
    icon: Icon,
    description,
    variant = "default"
}: StatCardProps) {
    return (
        <Card className={cn(
            "overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
            variant === "primary" && "bg-primary text-primary-foreground",
            variant === "accent" && "bg-accent text-accent-foreground"
        )}>
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <p className={cn(
                            "text-sm font-medium",
                            variant === "default" ? "text-muted-foreground" : "opacity-90"
                        )}>
                            {title}
                        </p>
                        <p className="text-2xl font-bold">{value}</p>
                        {description && (
                            <p className={cn(
                                "text-xs",
                                variant === "default" ? "text-muted-foreground" : "opacity-80"
                            )}>
                                {description}
                            </p>
                        )}
                    </div>
                    <div className={cn(
                        "p-3 rounded-full",
                        variant === "default" && "bg-primary/10",
                        variant === "primary" && "bg-primary-foreground/20",
                        variant === "accent" && "bg-accent-foreground/20"
                    )}>
                        <Icon className="h-6 w-6" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
