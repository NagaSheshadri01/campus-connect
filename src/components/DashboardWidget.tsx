import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface DashboardWidgetProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: "primary" | "accent" | "warning" | "success";
  delay?: number;
}

const colorMap = {
  primary: {
    icon: "text-primary",
    iconBg: "bg-primary/10",
    glow: "group-hover:shadow-[0_0_30px_-5px_hsl(217_100%_65%/0.3)]",
    border: "group-hover:border-primary/30",
    counter: "text-primary",
  },
  accent: {
    icon: "text-accent",
    iconBg: "bg-accent/10",
    glow: "group-hover:shadow-[0_0_30px_-5px_hsl(174_70%_55%/0.3)]",
    border: "group-hover:border-accent/30",
    counter: "text-accent",
  },
  warning: {
    icon: "text-warning",
    iconBg: "bg-warning/10",
    glow: "group-hover:shadow-[0_0_30px_-5px_hsl(38_92%_50%/0.3)]",
    border: "group-hover:border-warning/30",
    counter: "text-warning",
  },
  success: {
    icon: "text-success",
    iconBg: "bg-success/10",
    glow: "group-hover:shadow-[0_0_30px_-5px_hsl(160_84%_39%/0.3)]",
    border: "group-hover:border-success/30",
    counter: "text-success",
  },
};

export function DashboardWidget({ title, value, icon: Icon, color, delay = 0 }: DashboardWidgetProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const colors = colorMap[color];

  useEffect(() => {
    const timer = setTimeout(() => {
      const duration = 1200;
      const steps = 30;
      const increment = value / steps;
      let current = 0;
      const interval = setInterval(() => {
        current += increment;
        if (current >= value) {
          setDisplayValue(value);
          clearInterval(interval);
        } else {
          setDisplayValue(Math.floor(current));
        }
      }, duration / steps);
      return () => clearInterval(interval);
    }, delay + 200);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return (
    <div
      className={cn(
        "glass-panel p-5 hover-lift group cursor-default opacity-0 animate-fade-in-up transition-all duration-500",
        colors.glow,
        colors.border
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{title}</span>
        <div className={cn("p-2.5 rounded-xl", colors.iconBg)}>
          <Icon className={cn("w-4 h-4", colors.icon)} />
        </div>
      </div>
      <div className={cn("text-4xl font-display font-bold tracking-tight", colors.counter)}>
        {displayValue}
      </div>
    </div>
  );
}