import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  iconColor?: string;
  subtitle?: string;
}

export function StatsCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  iconColor = "bg-primary/10 text-primary",
  subtitle,
}: StatsCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 transition-all duration-200 hover:border-primary/30">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-2 text-2xl font-bold text-foreground">{value}</p>
          {subtitle && (
            <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
          )}
          {change && (
            <div className="mt-2 flex items-center gap-1">
              <span
                className={cn(
                  "text-xs font-medium",
                  changeType === "positive" && "text-success",
                  changeType === "negative" && "text-destructive",
                  changeType === "neutral" && "text-muted-foreground"
                )}
              >
                {change}
              </span>
              <span className="text-xs text-muted-foreground">so với tháng trước</span>
            </div>
          )}
        </div>
        <div className={cn("flex h-12 w-12 items-center justify-center rounded-lg", iconColor)}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}

interface MiniStatsProps {
  label: string;
  value: string | number;
  color?: string;
}

export function MiniStats({ label, value, color = "text-foreground" }: MiniStatsProps) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-secondary/50 px-4 py-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={cn("text-sm font-semibold", color)}>{value}</span>
    </div>
  );
}
