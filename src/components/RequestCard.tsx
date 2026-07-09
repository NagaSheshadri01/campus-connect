import { ServiceRequest } from "@/lib/api";
import { StatusBadge } from "./StatusBadge";
import { cn } from "@/lib/utils";
import { Calendar, User, Tag, ChevronRight } from "lucide-react";

interface RequestCardProps {
  request: ServiceRequest;
  onClick?: () => void;
  delay?: number;
}

const priorityColors: Record<string, string> = {
  low: "text-muted-foreground",
  medium: "text-primary",
  high: "text-warning",
  urgent: "text-destructive",
};

const priorityDot: Record<string, string> = {
  low: "bg-muted-foreground",
  medium: "bg-primary",
  high: "bg-warning",
  urgent: "bg-destructive",
};

export function RequestCard({ request, onClick, delay = 0 }: RequestCardProps) {
  return (
    <div
      className="glass-panel p-5 hover-lift cursor-pointer opacity-0 animate-fade-in-up group relative overflow-hidden"
      style={{ animationDelay: `${delay}ms` }}
      onClick={onClick}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-primary/[0.03] to-accent/[0.03] pointer-events-none" />

      <div className="relative">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] text-muted-foreground font-mono tracking-wider">{request.id.slice(0, 8)}</span>
              <span className={cn("flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider", priorityColors[request.priority] || "text-muted-foreground")}>
                <span className={cn("w-1.5 h-1.5 rounded-full", priorityDot[request.priority] || "bg-muted-foreground")} />
                {request.priority}
              </span>
            </div>
            <h3 className="font-display font-semibold truncate group-hover:text-primary transition-colors duration-300">{request.title}</h3>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={request.status} />
            <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300" />
          </div>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{request.description}</p>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5"><Tag className="w-3 h-3" /><span className="capitalize">{request.categories?.name || "—"}</span></span>
          <span className="flex items-center gap-1.5"><User className="w-3 h-3" />{request.student_profile?.full_name || "—"}</span>
          <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" />{new Date(request.created_at).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}
