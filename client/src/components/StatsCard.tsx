import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  variant?: "success" | "error" | "neutral";
  testId?: string;
}

export function StatsCard({ icon: Icon, label, value, variant = "neutral", testId }: StatsCardProps) {
  const iconColorClass = {
    success: "text-chart-2",
    error: "text-destructive",
    neutral: "text-primary",
  }[variant];

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className={cn("flex-shrink-0", iconColorClass)}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground truncate">{label}</p>
            <p className="text-2xl font-bold text-foreground" data-testid={testId}>
              {value}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
