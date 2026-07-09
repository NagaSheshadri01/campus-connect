import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { createServiceRequest, fetchCategories, type Category } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useNavigate, Link } from "react-router-dom";
import { CheckCircle2, Upload, Sparkles, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const priorities = ["low", "medium", "high", "urgent"] as const;

const priorityGlow: Record<string, string> = {
  low: "hover:border-muted-foreground/50",
  medium: "hover:border-primary/50 hover:shadow-[0_0_15px_-5px_hsl(217_100%_65%/0.3)]",
  high: "hover:border-warning/50 hover:shadow-[0_0_15px_-5px_hsl(38_92%_50%/0.3)]",
  urgent: "hover:border-destructive/50 hover:shadow-[0_0_15px_-5px_hsl(0_84%_60%/0.3)]",
};

export default function SubmitRequest() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({ title: "", category_id: "", description: "", priority: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => {});
  }, []);

  if (!user || !profile) {
    return (
      <div className="min-h-screen gradient-bg relative overflow-hidden">
        <Navbar />
        <div className="pt-32 flex items-center justify-center px-4">
          <div className="glass-panel-strong p-14 text-center max-w-md">
            <LogIn className="w-10 h-10 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-display font-bold mb-3">Sign In Required</h2>
            <p className="text-muted-foreground mb-6 text-sm">Please sign in to submit a service request.</p>
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

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.category_id) e.category_id = "Select a category";
    if (!form.description.trim()) e.description = "Description is required";
    if (!form.priority) e.priority = "Select priority";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await createServiceRequest({
        title: form.title,
        description: form.description,
        priority: form.priority,
        student_id: profile.id,
        category_id: form.category_id,
      });
      setSubmitted(true);
    } catch (err: any) {
      toast.error(err?.message || "Failed to submit request");
    }
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen gradient-bg relative overflow-hidden">
        <div className="floating-orb w-[400px] h-[400px] bg-success/10 top-[30%] left-[20%]" style={{ animationDelay: '0s' }} />
        <Navbar />
        <div className="pt-32 flex items-center justify-center px-4">
          <div className="glass-panel-strong p-14 text-center max-w-md animate-scale-in hover-glow">
            <div className="w-20 h-20 rounded-full btn-glow flex items-center justify-center mx-auto mb-8">
              <CheckCircle2 className="w-10 h-10 text-foreground relative z-10" />
            </div>
            <h2 className="text-3xl font-display font-bold mb-3">Request Submitted!</h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">Your service request has been submitted successfully. You can track it from your dashboard.</p>
            <Button onClick={() => navigate("/student")} className="btn-glow border-0 text-foreground font-semibold rounded-full px-8">
              <span className="relative z-10">Go to Dashboard</span>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg relative overflow-hidden">
      <div className="floating-orb w-[500px] h-[500px] bg-primary/8 top-[100px] right-[-200px]" style={{ animationDelay: '2s' }} />
      <div className="floating-orb w-[300px] h-[300px] bg-accent/8 bottom-[50px] left-[-100px]" style={{ animationDelay: '0s' }} />

      <Navbar />
      <div className="pt-24 pb-12 px-4 max-w-2xl mx-auto relative">
        <div className="opacity-0 animate-fade-in-up mb-10">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">New Request</span>
          </div>
          <h1 className="text-3xl font-display font-bold mb-1.5">Submit Service Request</h1>
          <p className="text-muted-foreground text-sm">Describe the issue and we'll get it resolved.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2.5 opacity-0 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            <label className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">Request Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Brief description of the issue"
              className={cn(
                "w-full px-4 py-3.5 rounded-xl bg-muted/30 border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 focus:bg-muted/50 transition-all duration-300",
                errors.title ? "border-destructive/50" : "border-border/40"
              )}
            />
            {errors.title && <p className="text-xs text-destructive animate-fade-in">{errors.title}</p>}
          </div>

          <div className="space-y-2.5 opacity-0 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            <label className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">Category</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setForm({ ...form, category_id: cat.id })}
                  className={cn(
                    "px-3 py-3 rounded-xl text-xs font-medium capitalize transition-all duration-300 border",
                    form.category_id === cat.id
                      ? "btn-glow text-foreground border-transparent"
                      : "bg-muted/20 text-muted-foreground border-border/40 hover:border-primary/30 hover:text-foreground hover:bg-muted/40"
                  )}
                >
                  {form.category_id === cat.id ? <span className="relative z-10">{cat.name}</span> : cat.name}
                </button>
              ))}
            </div>
            {errors.category_id && <p className="text-xs text-destructive animate-fade-in">{errors.category_id}</p>}
          </div>

          <div className="space-y-2.5 opacity-0 animate-fade-in-up" style={{ animationDelay: "300ms" }}>
            <label className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={4}
              placeholder="Provide detailed information about the issue..."
              className={cn(
                "w-full px-4 py-3.5 rounded-xl bg-muted/30 border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 focus:bg-muted/50 transition-all duration-300 resize-none",
                errors.description ? "border-destructive/50" : "border-border/40"
              )}
            />
            {errors.description && <p className="text-xs text-destructive animate-fade-in">{errors.description}</p>}
          </div>

          <div className="space-y-2.5 opacity-0 animate-fade-in-up" style={{ animationDelay: "400ms" }}>
            <label className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">Priority Level</label>
            <div className="grid grid-cols-4 gap-2.5">
              {priorities.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setForm({ ...form, priority: p })}
                  className={cn(
                    "px-3 py-3 rounded-xl text-xs font-medium capitalize transition-all duration-300 border",
                    form.priority === p
                      ? "btn-glow text-foreground border-transparent"
                      : cn("bg-muted/20 text-muted-foreground border-border/40", priorityGlow[p])
                  )}
                >
                  {form.priority === p ? <span className="relative z-10">{p}</span> : p}
                </button>
              ))}
            </div>
            {errors.priority && <p className="text-xs text-destructive animate-fade-in">{errors.priority}</p>}
          </div>

          <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: "500ms" }}>
            <Button type="submit" disabled={loading} className="w-full btn-glow border-0 text-foreground font-semibold py-7 text-base rounded-xl">
              <span className="relative z-10">{loading ? "Submitting..." : "Submit Request"}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
