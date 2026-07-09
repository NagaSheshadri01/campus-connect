import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { DashboardWidget } from "@/components/DashboardWidget";
import { StatusBadge } from "@/components/StatusBadge";
import { CategoryFilter } from "@/components/CategoryFilter";
import { SearchBar } from "@/components/SearchBar";
import { fetchServiceRequests, fetchTechnicians, getDashboardStats, updateServiceStatus, subscribeToRequests, type ServiceRequest } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { FileText, Clock, CheckCircle2, AlertTriangle, LogOut } from "lucide-react";
import { toast } from "sonner";

const statusOptions = ["Submitted", "Assigned", "In Progress", "Resolved"] as const;

export default function AdminDashboard() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [technicians, setTechnicians] = useState<{ id: string; full_name: string | null }[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { profile, signOut } = useAuth();

  useEffect(() => {
    Promise.all([fetchServiceRequests(), fetchTechnicians()])
      .then(([reqs, techs]) => {
        setRequests(reqs);
        setTechnicians(techs);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Realtime
  useEffect(() => {
    const channel = subscribeToRequests(() => {
      fetchServiceRequests().then(setRequests).catch(() => {});
    });
    return () => { channel.unsubscribe(); };
  }, []);

  const stats = getDashboardStats(requests);

  const filtered = useMemo(() => {
    return requests.filter((r) => {
      const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) || r.id.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === "all" || r.categories?.name?.toLowerCase() === category.toLowerCase();
      return matchSearch && matchCat;
    });
  }, [requests, search, category]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const updated = await updateServiceStatus(id, newStatus);
      setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, ...updated } : r)));
      toast.success("Status updated");
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleAssign = async (id: string, techId: string) => {
    try {
      const updated = await updateServiceStatus(id, "Assigned", techId);
      setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, ...updated } : r)));
      toast.success("Technician assigned");
    } catch {
      toast.error("Failed to assign technician");
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen gradient-bg relative overflow-hidden">
      <div className="floating-orb w-[500px] h-[500px] bg-primary/10 top-[50px] left-[-200px]" style={{ animationDelay: '2s' }} />
      <div className="floating-orb w-[400px] h-[400px] bg-[hsl(263_70%_58%/0.08)] bottom-[-100px] right-[-100px]" style={{ animationDelay: '0s' }} />

      <Navbar />
      <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto relative">
        <div className="flex items-start justify-between mb-10 opacity-0 animate-fade-in-up">
          <div>
            <h1 className="text-3xl font-display font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground text-sm mt-1.5">Manage and assign all service requests · Logged in as <span className="text-foreground font-medium">{profile?.full_name}</span></p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="border-border/40 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 rounded-xl transition-all duration-300"
          >
            <LogOut className="w-4 h-4 mr-1.5" />
            Logout
          </Button>
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

        <div className="glass-panel-strong overflow-hidden opacity-0 animate-fade-in-up" style={{ animationDelay: "500ms" }}>
          {loading ? (
            <div className="p-16 text-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/40">
                    <th className="text-left p-4 font-medium text-[10px] uppercase tracking-[0.15em] text-muted-foreground">Title</th>
                    <th className="text-left p-4 font-medium text-[10px] uppercase tracking-[0.15em] text-muted-foreground hidden md:table-cell">Category</th>
                    <th className="text-left p-4 font-medium text-[10px] uppercase tracking-[0.15em] text-muted-foreground hidden lg:table-cell">Student</th>
                    <th className="text-left p-4 font-medium text-[10px] uppercase tracking-[0.15em] text-muted-foreground">Status</th>
                    <th className="text-left p-4 font-medium text-[10px] uppercase tracking-[0.15em] text-muted-foreground hidden md:table-cell">Technician</th>
                    <th className="text-left p-4 font-medium text-[10px] uppercase tracking-[0.15em] text-muted-foreground">Badge</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r) => (
                    <tr key={r.id} className="border-b border-border/20 hover:bg-primary/[0.03] transition-all duration-300 group">
                      <td className="p-4 font-medium max-w-[200px] truncate group-hover:text-primary transition-colors duration-300">{r.title}</td>
                      <td className="p-4 capitalize text-muted-foreground hidden md:table-cell text-xs">{r.categories?.name || "—"}</td>
                      <td className="p-4 text-muted-foreground hidden lg:table-cell text-xs">{r.student_profile?.full_name || "—"}</td>
                      <td className="p-4">
                        <select
                          value={r.status}
                          onChange={(e) => handleStatusChange(r.id, e.target.value)}
                          className="bg-muted/30 border border-border/40 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-300 cursor-pointer"
                        >
                          {statusOptions.map((s) => (
                            <option key={s} value={s} className="bg-card">{s}</option>
                          ))}
                        </select>
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        <select
                          value={r.technician_id || ""}
                          onChange={(e) => handleAssign(r.id, e.target.value)}
                          className="bg-muted/30 border border-border/40 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-300 cursor-pointer"
                        >
                          <option value="" className="bg-card">Unassigned</option>
                          {technicians.map((t) => (
                            <option key={t.id} value={t.id} className="bg-card">{t.full_name || "Unnamed"}</option>
                          ))}
                        </select>
                      </td>
                      <td className="p-4">
                        <StatusBadge status={r.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {!loading && filtered.length === 0 && (
            <div className="p-16 text-center text-muted-foreground">No requests found.</div>
          )}
        </div>
      </div>
    </div>
  );
}
