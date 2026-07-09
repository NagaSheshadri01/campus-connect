import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { subscribeToRequests, type ServiceRequest } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Check, FileText, Send, UserCheck, Loader2, CheckCircle2, ArrowLeft, Tag, User, Calendar, Wrench } from "lucide-react";

const stages = [
  { key: "Submitted", label: "Submitted", icon: Send, color: "primary" },
  { key: "Assigned", label: "Assigned", icon: UserCheck, color: "accent" },
  { key: "In Progress", label: "In Progress", icon: Loader2, color: "warning" },
  { key: "Resolved", label: "Resolved", icon: CheckCircle2, color: "success" },
] as const;

const statusOrder = ["Submitted", "Assigned", "In Progress", "Resolved"];

const REQUEST_SELECT = `
  *,
  categories(name),
  student_profile:profiles!service_requests_student_id_fkey(full_name),
  technician_profile:profiles!service_requests_technician_id_fkey(full_name)
`;

export default function RequestTracking() {
  const { id } = useParams<{ id: string }>();
  const [request, setRequest] = useState<ServiceRequest | null>(null);
  const [loading, setLoading] = useState(true);

  const loadRequest = async () => {
    if (!id) return;
    const { data } = await supabase
      .from("service_requests")
      .select(REQUEST_SELECT)
      .eq("id", id)
      .single();
    setRequest(data as ServiceRequest | null);
    setLoading(false);
  };

  useEffect(() => {
    loadRequest();
  }, [id]);

  // Realtime updates
  useEffect(() => {
    const channel = subscribeToRequests(() => loadRequest());
    return () => { channel.unsubscribe(); };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen gradient-bg relative overflow-hidden">
        <Navbar />
        <div className="pt-24 pb-12 px-4 max-w-3xl mx-auto text-center">
          <div className="glass-panel-strong p-16 rounded-2xl">
            <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <h2 className="font-display font-bold text-xl mb-2">Request Not Found</h2>
            <p className="text-muted-foreground text-sm mb-6">The request does not exist or you don't have access.</p>
            <Link to="/student" className="text-primary text-sm hover:underline">← Back to Dashboard</Link>
          </div>
        </div>
      </div>
    );
  }

  const currentIndex = statusOrder.indexOf(request.status);

  return (
    <div className="min-h-screen gradient-bg relative overflow-hidden">
      <div className="floating-orb w-[400px] h-[400px] bg-primary/10 top-[100px] right-[-150px]" style={{ animationDelay: "1s" }} />
      <div className="floating-orb w-[350px] h-[350px] bg-accent/10 bottom-[50px] left-[-100px]" style={{ animationDelay: "3s" }} />

      <Navbar />
      <div className="pt-24 pb-12 px-4 max-w-4xl mx-auto relative">
        <Link
          to="/student"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 mb-8 group opacity-0 animate-fade-in"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
          Back to Dashboard
        </Link>

        <div className="mb-10 opacity-0 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-mono tracking-wider text-muted-foreground glass-panel px-3 py-1 rounded-full">{request.id.slice(0, 8)}</span>
          </div>
          <h1 className="text-3xl font-display font-bold">{request.title}</h1>
          <p className="text-muted-foreground text-sm mt-2 max-w-2xl">{request.description}</p>
        </div>

        {/* Status Timeline */}
        <div className="glass-panel-strong p-8 rounded-2xl mb-8 opacity-0 animate-fade-in-up" style={{ animationDelay: "150ms" }}>
          <h2 className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-semibold mb-8">Request Progress</h2>

          {/* Horizontal timeline for md+ */}
          <div className="hidden md:flex items-start gap-0 relative">
            {stages.map((stage, index) => {
              const isComplete = index < currentIndex;
              const isCurrent = index === currentIndex;
              const isFuture = index > currentIndex;
              const StageIcon = stage.icon;

              return (
                <div key={stage.key} className="flex items-start flex-1">
                  <div className="flex flex-col items-center gap-3 w-full">
                    <div
                      className={cn(
                        "w-14 h-14 rounded-full flex items-center justify-center transition-all duration-700 relative",
                        isComplete && "bg-success/15 text-success border-2 border-success/40",
                        isCurrent && cn(
                          "border-2 animate-pulse-glow",
                          stage.color === "primary" && "bg-primary/15 text-primary border-primary/40",
                          stage.color === "accent" && "bg-accent/15 text-accent border-accent/40",
                          stage.color === "warning" && "bg-warning/15 text-warning border-warning/40",
                          stage.color === "success" && "bg-success/15 text-success border-success/40",
                        ),
                        isFuture && "bg-muted/30 text-muted-foreground/40 border border-border/30"
                      )}
                    >
                      {isComplete ? (
                        <Check className="w-6 h-6 animate-scale-in" />
                      ) : (
                        <StageIcon className={cn("w-6 h-6", isCurrent && stage.key === "In Progress" && "animate-spin")} style={isCurrent && stage.key === "In Progress" ? { animationDuration: "3s" } : undefined} />
                      )}
                      {isCurrent && (
                        <div className={cn(
                          "absolute inset-0 rounded-full animate-ping opacity-20",
                          stage.color === "primary" && "bg-primary",
                          stage.color === "accent" && "bg-accent",
                          stage.color === "warning" && "bg-warning",
                          stage.color === "success" && "bg-success",
                        )} style={{ animationDuration: "2s" }} />
                      )}
                    </div>
                    <span className={cn(
                      "text-xs font-semibold tracking-wide text-center",
                      isComplete && "text-success",
                      isCurrent && cn(
                        stage.color === "primary" && "text-primary",
                        stage.color === "accent" && "text-accent",
                        stage.color === "warning" && "text-warning",
                        stage.color === "success" && "text-success",
                      ),
                      isFuture && "text-muted-foreground/40"
                    )}>
                      {stage.label}
                    </span>
                    <span className={cn(
                      "text-[10px] font-mono",
                      isFuture ? "text-muted-foreground/20" : "text-muted-foreground"
                    )}>
                      {isFuture ? "—" : new Date(index === 0 ? request.created_at : request.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                  {index < stages.length - 1 && (
                    <div className="flex-1 flex items-center h-14 px-2">
                      <div className="w-full h-1 rounded-full overflow-hidden bg-muted/30 relative">
                        <div
                          className={cn(
                            "absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-out",
                            index < currentIndex && "gradient-accent w-full",
                            index === currentIndex && "w-1/2 gradient-accent opacity-50",
                            index > currentIndex && "w-0"
                          )}
                          style={{ transitionDelay: `${index * 200}ms` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Vertical timeline for mobile */}
          <div className="md:hidden space-y-0">
            {stages.map((stage, index) => {
              const isComplete = index < currentIndex;
              const isCurrent = index === currentIndex;
              const isFuture = index > currentIndex;
              const StageIcon = stage.icon;

              return (
                <div key={stage.key} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500",
                        isComplete && "bg-success/15 text-success border-2 border-success/40",
                        isCurrent && cn(
                          "border-2 animate-pulse-glow",
                          stage.color === "primary" && "bg-primary/15 text-primary border-primary/40",
                          stage.color === "accent" && "bg-accent/15 text-accent border-accent/40",
                          stage.color === "warning" && "bg-warning/15 text-warning border-warning/40",
                          stage.color === "success" && "bg-success/15 text-success border-success/40",
                        ),
                        isFuture && "bg-muted/30 text-muted-foreground/40 border border-border/30"
                      )}
                    >
                      {isComplete ? <Check className="w-4 h-4" /> : <StageIcon className="w-4 h-4" />}
                    </div>
                    {index < stages.length - 1 && (
                      <div className={cn(
                        "w-0.5 flex-1 min-h-[40px] my-1 rounded-full transition-all duration-700",
                        index < currentIndex ? "bg-success/40" : "bg-border/30"
                      )} />
                    )}
                  </div>
                  <div className="pb-6">
                    <span className={cn(
                      "text-sm font-semibold block",
                      isComplete && "text-success",
                      isCurrent && cn(
                        stage.color === "primary" && "text-primary",
                        stage.color === "accent" && "text-accent",
                        stage.color === "warning" && "text-warning",
                        stage.color === "success" && "text-success",
                      ),
                      isFuture && "text-muted-foreground/40"
                    )}>
                      {stage.label}
                    </span>
                    <span className={cn("text-[10px] font-mono", isFuture ? "text-muted-foreground/20" : "text-muted-foreground")}>
                      {isFuture ? "Pending" : new Date(index === 0 ? request.created_at : request.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Request Details */}
        <div className="grid sm:grid-cols-2 gap-4 opacity-0 animate-fade-in-up" style={{ animationDelay: "300ms" }}>
          <div className="glass-panel p-5 rounded-xl hover-lift">
            <div className="flex items-center gap-2 mb-3">
              <Tag className="w-4 h-4 text-primary" />
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Category</span>
            </div>
            <p className="font-display font-semibold capitalize">{request.categories?.name || "—"}</p>
          </div>

          <div className="glass-panel p-5 rounded-xl hover-lift">
            <div className="flex items-center gap-2 mb-3">
              <User className="w-4 h-4 text-accent" />
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Student</span>
            </div>
            <p className="font-display font-semibold">{request.student_profile?.full_name || "—"}</p>
          </div>

          <div className="glass-panel p-5 rounded-xl hover-lift">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-warning" />
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Submitted</span>
            </div>
            <p className="font-display font-semibold">{new Date(request.created_at).toLocaleDateString()}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{new Date(request.created_at).toLocaleTimeString()}</p>
          </div>

          <div className="glass-panel p-5 rounded-xl hover-lift">
            <div className="flex items-center gap-2 mb-3">
              <Wrench className="w-4 h-4 text-success" />
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Assigned Technician</span>
            </div>
            <p className="font-display font-semibold">{request.technician_profile?.full_name || "Not yet assigned"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
