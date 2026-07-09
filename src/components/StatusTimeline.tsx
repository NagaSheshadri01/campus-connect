import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface StatusTimelineProps {
  currentStatus: "Submitted" | "Assigned" | "In Progress" | "Resolved";
}

const steps = [
  { key: "Submitted", label: "Submitted" },
  { key: "Assigned", label: "Assigned" },
  { key: "In Progress", label: "In Progress" },
  { key: "Resolved", label: "Resolved" },
];

const statusOrder = ["Submitted", "Assigned", "In Progress", "Resolved"];

export function StatusTimeline({ currentStatus }: StatusTimelineProps) {
  const currentIndex = statusOrder.indexOf(currentStatus);

  return (
    <div className="flex items-center gap-0 w-full">
      {steps.map((step, index) => {
        const isComplete = index < currentIndex;
        const isCurrent = index === currentIndex;
        return (
          <div key={step.key} className="flex items-center flex-1">
            <div className="flex flex-col items-center gap-2">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500",
                  isComplete && "gradient-accent text-foreground shadow-lg",
                  isCurrent && "bg-primary/15 text-primary border-2 border-primary animate-pulse-glow",
                  !isComplete && !isCurrent && "bg-muted/50 text-muted-foreground border border-border/50"
                )}
              >
                {isComplete ? <Check className="w-4 h-4" /> : index + 1}
              </div>
              <span className={cn(
                "text-[10px] font-medium whitespace-nowrap tracking-wide",
                isCurrent ? "text-primary" : isComplete ? "text-foreground" : "text-muted-foreground"
              )}>
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={cn(
                "flex-1 h-0.5 mx-1.5 rounded-full transition-all duration-700",
                index < currentIndex ? "gradient-accent" : "bg-muted/50"
              )} />
            )}
          </div>
        );
      })}
    </div>
  );
}
