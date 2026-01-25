import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Target } from "lucide-react";

interface ProgressGoalProps {
    current: number;
    goal: number;
    title?: string;
}

export function ProgressGoal({ current, goal, title = "Mục tiêu quỹ" }: ProgressGoalProps) {
    const percentage = Math.min((current / goal) * 100, 100);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(amount);
    };

    return (
        <Card className="overflow-hidden">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Target className="h-5 w-5 text-primary" />
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="relative">
                    <Progress
                        value={percentage}
                        className="h-4 bg-secondary"
                    />
                    <div
                        className="absolute inset-0 h-4 rounded-full bg-gradient-to-r from-primary via-gold to-gold-light transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                    />
                </div>

                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-sm text-muted-foreground">Đã đóng góp</p>
                        <p className="text-xl font-bold text-primary">{formatCurrency(current)}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-muted-foreground">Mục tiêu</p>
                        <p className="text-xl font-bold text-foreground">{formatCurrency(goal)}</p>
                    </div>
                </div>

                <div className="bg-secondary/50 rounded-lg p-3 text-center">
                    <span className="text-2xl font-bold text-primary">{percentage.toFixed(1)}%</span>
                    <p className="text-sm text-muted-foreground mt-1">hoàn thành mục tiêu</p>
                </div>
            </CardContent>
        </Card>
    );
}
