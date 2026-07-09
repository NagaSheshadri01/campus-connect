import { useState, useMemo, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { DashboardWidget } from "@/components/DashboardWidget";
import { RequestCard } from "@/components/RequestCard";
import { CategoryFilter } from "@/components/CategoryFilter";
import { SearchBar } from "@/components/SearchBar";
import { StatusTimeline } from "@/components/StatusTimeline";
import { fetchMyRequests, getDashboardStats, subscribeToRequests, type ServiceRequest } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { FileText, Clock, CheckCircle2, AlertTriangle, Plus, X, ExternalLink, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function StudentDashboard() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!profile) return;
    fetchMyRequests(profile.id).then((data) => {
      setRequests(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [profile]);

  // Realtime subscription
  useEffect(() => {
    if (!profile) return;
    const channel = subscribeToRequests(() => {
      fetchMyRequests(profile.id).then(setRequests).catch(() => {});
    });
    return () => { channel.unsubscribe(); };
  }, [profile]);

  const stats = getDashboardStats(requests);

  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase()) || r.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "all" || r.categories?.name?.toLowerCase() === category.toLowerCase();
      return matchesSearch && matchesCategory;
    });
  }, [search, category, requests]);

  const selected = requests.find((r) => r.id === selectedRequest);

  if (!user) {
    return (
      <div className="min-h-screen gradient-bg relative overflow-hidden">
        <Navbar />
        <div className="pt-32 flex items-center justify-center px-4">
          <div className="glass-panel-strong p-14 text-center max-w-md">
            <LogIn className="w-10 h-10 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-display font-bold mb-3">Sign In Required</h2>
            <p className="text-muted-foreground mb-6 text-sm">Please sign in as a Student to view your dashboard.</p>
            <Link to="/login?role=Student">
              <Button className="btn-glow border-0 text-foreground font-semibold rounded-full px-8">
                <span className="relative z-10">Sign In</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg relative overflow-hidden">
      <div className="floating-orb w-[500px] h-[500px] bg-primary/10 top-[100px] right-[-200px]" style={{ animationDelay: '1s' }} />
      <div className="floating-orb w-[300px] h-[300px] bg-accent/10 bottom-[100px] left-[-100px]" style={{ animationDelay: '4s' }} />

      <Navbar />
      <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto relative">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
          <div className="opacity-0 animate-fade-in-up">
            <h1 className="text-3xl font-display font-bold">Student Dashboard</h1>
            <p className="text-muted-foreground text-sm mt-1.5">Track and manage your service requests</p>
          </div>
          <Link to="/submit-request" className="opacity-0 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            <Button className="btn-glow border-0 text-foreground font-semibold rounded-full px-6">
              <Plus className="w-4 h-4 mr-1.5 relative z-10" />
              <span className="relative z-10">New Request</span>
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <DashboardWidget title="Total Requests" value={stats.total} icon={FileText} color="primary" delay={0} />
          <DashboardWidget title="Pending" value={stats.pending} icon={Clock} color="warning" delay={100} />
          <DashboardWidget title="Active" value={stats.active} icon={AlertTriangle} color="accent" delay={200} />
          <DashboardWidget title="Resolved" value={stats.resolved} icon={CheckCircle2} color="success" delay={300} />
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8 opacity-0 animate-fade-in-up" style={{ animationDelay: "400ms" }}>
          <div className="flex-1 w-full sm:max-w-sm">
            <SearchBar value={search} onChange={setSearch} />
          </div>
          <CategoryFilter selected={category} onSelect={setCategory} />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {loading && (
              <div className="glass-panel p-16 text-center text-muted-foreground">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-sm">Loading requests...</p>
              </div>
            )}
            {!loading && filteredRequests.length === 0 && (
              <div className="glass-panel p-16 text-center text-muted-foreground">
                <p className="text-sm">No requests found.</p>
              </div>
            )}
            {filteredRequests.map((r, i) => (
              <RequestCard key={r.id} request={r} delay={i * 80 + 500} onClick={() => setSelectedRequest(r.id)} />
            ))}
          </div>

          <div className="hidden lg:block">
            {selected ? (
              <div className="glass-panel-strong p-6 sticky top-24 animate-scale-in hover-glow">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="font-display font-semibold text-lg">{selected.title}</h3>
                  <button onClick={() => setSelectedRequest(null)} className="text-muted-foreground hover:text-foreground transition-colors p-1">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-[10px] text-muted-foreground font-mono tracking-wider">{selected.id.slice(0, 8)}</span>
                <div className="mt-6 mb-6">
                  <StatusTimeline currentStatus={selected.status} />
                </div>
                <div className="space-y-4 text-sm">
                  <div className="glass-panel p-3 rounded-lg">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Category</span>
                    <p className="font-medium capitalize mt-0.5">{selected.categories?.name || "—"}</p>
                  </div>
                  <div className="glass-panel p-3 rounded-lg">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Priority</span>
                    <p className="font-medium capitalize mt-0.5">{selected.priority}</p>
                  </div>
                  <div className="glass-panel p-3 rounded-lg">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Description</span>
                    <p className="mt-0.5 text-muted-foreground">{selected.description}</p>
                  </div>
                  {selected.technician_profile?.full_name && (
                    <div className="glass-panel p-3 rounded-lg">
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Technician</span>
                      <p className="font-medium mt-0.5">{selected.technician_profile.full_name}</p>
                    </div>
                  )}
                  <div className="glass-panel p-3 rounded-lg">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Submitted</span>
                    <p className="mt-0.5">{new Date(selected.created_at).toLocaleString()}</p>
                  </div>
                  <Link to={`/track/${selected.id}`}>
                    <Button variant="outline" size="sm" className="w-full mt-4 border-primary/30 text-primary hover:bg-primary/10 rounded-xl transition-all duration-300">
                      <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                      View Full Tracking
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="glass-panel p-16 text-center text-muted-foreground sticky top-24">
                <div className="w-12 h-12 rounded-full bg-muted/30 flex items-center justify-center mx-auto mb-3">
                  <FileText className="w-5 h-5 text-muted-foreground/50" />
                </div>
                <p className="text-sm">Select a request to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
