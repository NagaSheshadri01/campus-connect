import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { StatusTimeline } from "@/components/StatusTimeline";
import { StatusBadge } from "@/components/StatusBadge";
import { fetchServiceRequests, updateServiceStatus, subscribeToRequests, type ServiceRequest } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Wrench, Play, CheckCircle2, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function TechnicianDashboard() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { profile, signOut } = useAuth();

  const loadRequests = async () => {
    try {
      const all = await fetchServiceRequests();
      // RLS ensures only assigned requests are returned for technicians
      setRequests(all);
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => {
    if (profile) loadRequests();
  }, [profile]);

  useEffect(() => {
    const channel = subscribeToRequests(() => loadRequests());
    return () => { channel.unsubscribe(); };
  }, [profile]);

  const handleLogout = async () => {
    await signOut();
    navigate("/", { replace: true });
  };

  const handleAction = async (id: string, newStatus: "In Progress" | "Resolved") => {
    try {
      await updateServiceStatus(id, newStatus);
      setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: newStatus, updated_at: new Date().toISOString() } : r)));
      toast.success(`Request marked as ${newStatus}`);
    } catch {
      toast.error("Failed to update");
    }
  };

  return (
    <div className="min-h-screen gradient-bg relative overflow-hidden">
      <div className="floating-orb w-[400px] h-[400px] bg-accent/10 top-[200px] left-[-150px]" style={{ animationDelay: '1s' }} />
      <div className="floating-orb w-[350px] h-[350px] bg-primary/10 bottom-[100px] right-[-100px]" style={{ animationDelay: '3s' }} />

      <Navbar />
      <div className="pt-24 pb-12 px-4 max-w-5xl mx-auto relative">
        <div className="flex items-start justify-between gap-4 mb-10 opacity-0 animate-fade-in-up">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl glass-panel">
              <Wrench className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold">Technician Dashboard</h1>
              <p className="text-muted-foreground text-sm mt-0.5">Your assigned service requests · Logged in as <span className="text-foreground font-medium">{profile?.full_name}</span></p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="border-border/40 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 rounded-xl transition-all duration-300 flex-shrink-0"
          >
            <LogOut className="w-4 h-4 mr-1.5" />
            Logout
          </Button>
        </div>

        {loading ? (
          <div className="glass-panel p-20 text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : (
          <div className="space-y-5">
            {requests.map((r, i) => (
              <div
                key={r.id}
                className="glass-panel-strong p-6 opacity-0 animate-fade-in-up hover-lift group"
                style={{ animationDelay: `${i * 120 + 100}ms` }}
              >
                <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <span className="text-[10px] font-mono tracking-wider text-muted-foreground">{r.id.slice(0, 8)}</span>
                        <h3 className="font-display font-semibold text-lg group-hover:text-primary transition-colors duration-300">{r.title}</h3>
                      </div>
                      <StatusBadge status={r.status} />
                    </div>
                    <p className="text-sm text-muted-foreground mb-5 leading-relaxed">{r.description}</p>
                    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mb-5">
                      <span className="glass-panel px-3 py-1.5 rounded-full">Category: <span className="text-foreground capitalize font-medium">{r.categories?.name || "—"}</span></span>
                      <span className="glass-panel px-3 py-1.5 rounded-full">Priority: <span className={cn("capitalize font-semibold", r.priority === "urgent" && "text-destructive", r.priority === "high" && "text-warning")}>{r.priority}</span></span>
                      <span className="glass-panel px-3 py-1.5 rounded-full">Student: <span className="text-foreground font-medium">{r.student_profile?.full_name || "—"}</span></span>
                    </div>
                    <div className="max-w-md">
                      <StatusTimeline currentStatus={r.status} />
                    </div>
                  </div>

                  <div className="flex lg:flex-col gap-3 lg:min-w-[160px]">
                    {r.status === "Assigned" && (
                      <Button
                        onClick={() => handleAction(r.id, "In Progress")}
                        className="flex-1 bg-warning/10 text-warning border border-warning/25 hover:bg-warning/20 hover:border-warning/40 hover:shadow-[0_0_20px_-5px_hsl(38_92%_50%/0.3)] transition-all duration-300 rounded-xl"
                      >
                        <Play className="w-4 h-4 mr-1.5" /> Start Work
                      </Button>
                    )}
                    {(r.status === "Assigned" || r.status === "In Progress") && (
                      <Button
                        onClick={() => handleAction(r.id, "Resolved")}
                        className="flex-1 bg-success/10 text-success border border-success/25 hover:bg-success/20 hover:border-success/40 hover:shadow-[0_0_20px_-5px_hsl(160_84%_39%/0.3)] transition-all duration-300 rounded-xl"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-1.5" /> Resolve
                      </Button>
                    )}
                    {r.status === "Resolved" && (
                      <div className="text-center text-sm text-success font-medium p-3 glass-panel rounded-xl">
                        <CheckCircle2 className="w-4 h-4 inline mr-1.5" />
                        Completed
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {requests.length === 0 && (
              <div className="glass-panel p-20 text-center text-muted-foreground">
                <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center mx-auto mb-4">
                  <Wrench className="w-8 h-8 opacity-30" />
                </div>
                <p className="font-medium">No assigned requests at the moment.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
