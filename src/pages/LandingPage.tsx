import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { ArrowRight, Shield, Zap, BarChart3, Users, Clock, CheckCircle2, Sparkles } from "lucide-react";

const features = [
  { icon: Zap, title: "Instant Submissions", desc: "Submit service requests in seconds with our streamlined form." },
  { icon: Shield, title: "Real-Time Tracking", desc: "Track every request from submission to resolution." },
  { icon: BarChart3, title: "Smart Dashboard", desc: "Visual analytics for administrators and technicians." },
  { icon: Users, title: "Team Coordination", desc: "Seamlessly assign and manage technician workflows." },
];

const steps = [
  { num: "01", title: "Submit Request", desc: "Students raise a service request with details and priority.", icon: CheckCircle2 },
  { num: "02", title: "Admin Reviews", desc: "Administrators review and assign technicians.", icon: Users },
  { num: "03", title: "Work In Progress", desc: "Technicians update status as work progresses.", icon: Clock },
  { num: "04", title: "Issue Resolved", desc: "Request is marked resolved and student is notified.", icon: CheckCircle2 },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen gradient-bg relative overflow-hidden">
      {/* Floating background orbs */}
      <div className="floating-orb w-[600px] h-[600px] bg-primary/20 top-[-200px] left-[-100px]" style={{ animationDelay: '0s' }} />
      <div className="floating-orb w-[400px] h-[400px] bg-accent/15 bottom-[200px] right-[-100px]" style={{ animationDelay: '3s' }} />
      <div className="floating-orb w-[300px] h-[300px] bg-[hsl(263_70%_58%/0.1)] top-[50%] left-[30%]" style={{ animationDelay: '5s' }} />

      {/* Particle grid overlay */}
      <div className="absolute inset-0 particle-grid opacity-30 pointer-events-none" />

      <Navbar />

      {/* Hero */}
      <section className="pt-36 pb-24 px-4 relative">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass-panel text-xs font-semibold mb-10 opacity-0 animate-fade-in-up" style={{ animationDelay: "0ms" }}>
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="gradient-text">Smart Campus Service Management</span>
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-8xl font-display font-bold tracking-tight leading-[1.05] mb-8 opacity-0 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            Campus Services,{" "}
            <span className="gradient-text">
              Reimagined
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed opacity-0 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            A world-class platform for managing campus service requests. From submission to resolution — fast, transparent, and elegant.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 animate-fade-in-up" style={{ animationDelay: "300ms" }}>
            <Link to="/student">
              <Button size="lg" className="btn-glow border-0 text-foreground font-semibold px-8 text-base rounded-full h-12">
                <span className="relative z-10 flex items-center gap-2">
                  Student Portal <ArrowRight className="w-4 h-4" />
                </span>
              </Button>
            </Link>
            <Link to="/admin">
              <Button variant="outline" size="lg" className="px-8 text-base border-border/50 hover:bg-muted/30 hover:border-primary/30 rounded-full h-12 transition-all duration-300">
                Admin Portal
              </Button>
            </Link>
          </div>
        </div>

        {/* Floating preview */}
        <div className="max-w-4xl mx-auto mt-20 opacity-0 animate-fade-in-up" style={{ animationDelay: "500ms" }}>
          <div className="glass-panel-strong p-1.5 rounded-2xl hover-glow">
            <div className="rounded-xl bg-background/50 p-6">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-3 h-3 rounded-full bg-destructive/60" />
                <div className="w-3 h-3 rounded-full bg-warning/60" />
                <div className="w-3 h-3 rounded-full bg-success/60" />
                <span className="text-[10px] text-muted-foreground ml-2 font-mono tracking-wider">scsms-dashboard</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: "Total", value: "128", color: "text-primary" },
                  { label: "Pending", value: "24", color: "text-warning" },
                  { label: "Active", value: "18", color: "text-accent" },
                  { label: "Resolved", value: "86", color: "text-success" },
                ].map((item) => (
                  <div key={item.label} className="glass-panel p-4 text-center hover-lift">
                    <div className={`text-3xl font-display font-bold ${item.color}`}>{item.value}</div>
                    <div className="text-[10px] text-muted-foreground mt-1.5 uppercase tracking-wider font-medium">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-4 relative">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3 block">Process</span>
            <h2 className="text-4xl font-display font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">A streamlined 4-step workflow from complaint to resolution.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <div key={step.num} className="glass-panel p-6 text-center hover-lift opacity-0 animate-fade-in-up group" style={{ animationDelay: `${i * 120 + 200}ms` }}>
                <div className="text-4xl font-display font-bold gradient-text mb-4">{step.num}</div>
                <h3 className="font-display font-semibold mb-2 group-hover:text-primary transition-colors duration-300">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4 relative">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-3 block">Features</span>
            <h2 className="text-4xl font-display font-bold mb-4">Key Features</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">Built for modern campuses that demand efficiency and transparency.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div key={f.title} className="glass-panel p-6 hover-lift opacity-0 animate-fade-in-up group" style={{ animationDelay: `${i * 120 + 200}ms` }}>
                <div className="p-3 rounded-xl bg-primary/8 w-fit mb-5 group-hover:bg-primary/15 transition-colors duration-300">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display font-semibold mb-2 group-hover:text-primary transition-colors duration-300">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 relative">
        <div className="max-w-3xl mx-auto text-center glass-panel-strong p-14 rounded-2xl hover-glow relative overflow-hidden">
          <div className="absolute inset-0 gradient-accent opacity-[0.03]" />
          <div className="relative">
            <h2 className="text-4xl font-display font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-muted-foreground mb-10 text-lg">Join the smart campus movement. Submit your first service request today.</p>
            <Link to="/submit-request">
              <Button size="lg" className="btn-glow border-0 text-foreground font-semibold px-10 text-base rounded-full h-12">
                <span className="relative z-10 flex items-center gap-2">
                  Submit a Request <ArrowRight className="w-4 h-4" />
                </span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 py-10 px-4 relative">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <span className="font-display font-medium">© 2026 SCSMS. Smart Campus Service Management.</span>
          <div className="flex gap-8">
            <span className="nav-link-underline hover:text-foreground cursor-pointer transition-colors duration-300 py-1">Privacy</span>
            <span className="nav-link-underline hover:text-foreground cursor-pointer transition-colors duration-300 py-1">Terms</span>
            <span className="nav-link-underline hover:text-foreground cursor-pointer transition-colors duration-300 py-1">Contact</span>
          </div>
        </div>
      </footer>
    </div>
  );
}