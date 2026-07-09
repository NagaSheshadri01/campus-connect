import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "Submitted" | "Assigned" | "In Progress" | "Resolved";
  className?: string;
  animated?: boolean;
}

const statusConfig = {
  Submitted: { label: "Submitted", className: "status-submitted" },
  Assigned: { label: "Assigned", className: "status-assigned" },
  "In Progress": { label: "In Progress", className: "status-in-progress" },
  Resolved: { label: "Resolved", className: "status-resolved" },
};

export function StatusBadge({ status, className, animated = true }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase transition-all duration-300",
        config.className,
        animated && "hover:scale-105",
        className
      )}
    >
      <span className={cn(
        "w-1.5 h-1.5 rounded-full",
        status === "Submitted" && "bg-primary",
        status === "Assigned" && "bg-accent",
        status === "In Progress" && "bg-warning animate-pulse",
        status === "Resolved" && "bg-success",
      )} />
      {config.label}
    </span>
  );
}
