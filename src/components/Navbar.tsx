import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Hexagon, Menu, X, Sparkles, LogOut } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { useAuth } from "@/lib/auth";

const navLinks = [
  { path: "/", label: "Home" },
  { path: "/student", label: "Student Portal" },
];

export function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { profile, user, signOut } = useAuth();

  function getNavHref(link: typeof navLinks[number]) {
    // Student portal needs login if not authenticated
    if (link.path === "/student" && !user) {
      return "/login?role=Student";
    }
    if (link.requiresRole && profile?.role !== link.requiresRole) {
      return `/login?role=${link.requiresRole}`;
    }
    return link.path;
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-panel-strong border-b border-border/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="p-1.5 rounded-lg btn-glow">
              <Hexagon className="w-5 h-5 text-foreground relative z-10" />
            </div>
            <span className="font-display font-bold text-lg tracking-tight gradient-text">SCSMS</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const href = getNavHref(link);
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={href}
                  className={cn(
                    "nav-link-underline px-1 py-2 text-sm font-medium transition-all duration-300",
                    isActive ? "text-foreground active" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link to="/submit-request">
              <Button size="sm" className="btn-glow border-0 text-foreground font-semibold rounded-full px-5">
                <Sparkles className="w-3.5 h-3.5 mr-1.5 relative z-10" />
                <span className="relative z-10">New Request</span>
              </Button>
            </Link>
            {user ? (
              <Button size="sm" variant="ghost" onClick={signOut} className="text-muted-foreground hover:text-foreground rounded-full px-4">
                <LogOut className="w-3.5 h-3.5 mr-1.5" />
                Sign Out
              </Button>
            ) : (
              <Link to="/login">
                <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-foreground rounded-full px-4">
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          <button className="md:hidden p-2 rounded-lg hover:bg-muted/50 transition-colors" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden glass-panel-strong border-t border-border/30 animate-fade-in">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => {
              const href = getNavHref(link);
              return (
                <Link
                  key={link.path}
                  to={href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "block px-4 py-2.5 rounded-lg text-sm font-medium transition-all",
                    location.pathname === link.path
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link to="/submit-request" onClick={() => setMobileOpen(false)}>
              <Button size="sm" className="w-full mt-2 btn-glow border-0 text-foreground font-semibold rounded-full">
                <Sparkles className="w-3.5 h-3.5 mr-1.5 relative z-10" />
                <span className="relative z-10">New Request</span>
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
