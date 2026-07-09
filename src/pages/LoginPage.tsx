import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Hexagon, Lock, User, AlertCircle, ArrowLeft, Shield, Wrench, Mail, UserPlus } from "lucide-react";

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const targetRole = searchParams.get("role") || "Student";
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();

  const RoleIcon = targetRole === "Admin" ? Shield : targetRole === "Technician" ? Wrench : User;
  const roleLabel = targetRole === "Admin" ? "Admin" : targetRole === "Technician" ? "Technician" : "Student";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (isSignUp) {
      const { error } = await signUp(email, password, fullName, targetRole as "Student" | "Admin" | "Technician");
      setLoading(false);
      if (error) {
        console.error("Supabase Signup Error:", error);
        if (error.toLowerCase().includes("already registered") || error.toLowerCase().includes("already exists") || error.toLowerCase().includes("taken")) {
          setError(`This email address is already registered. (Raw details: ${error})`);
        } else {
          setError(`Signup failed: ${error}`);
        }
      } else {
        // Redirect directly to the appropriate dashboard
        const dest = targetRole === "Admin" ? "/admin" : targetRole === "Technician" ? "/technician" : "/student";
        navigate(dest, { replace: true });
      }
    } else {
      const { error } = await signIn(email, password);
      setLoading(false);
      if (error) {
        setError(error);
      } else {
        const dest = targetRole === "Admin" ? "/admin" : targetRole === "Technician" ? "/technician" : "/student";
        navigate(dest, { replace: true });
      }
    }
  };

  return (
    <div className="min-h-screen gradient-bg relative overflow-hidden flex items-center justify-center px-4">
      <div className="floating-orb w-[500px] h-[500px] bg-primary/15 top-[-150px] right-[-100px]" style={{ animationDelay: "0s" }} />
      <div className="floating-orb w-[400px] h-[400px] bg-accent/10 bottom-[-100px] left-[-150px]" style={{ animationDelay: "3s" }} />
      <div className="floating-orb w-[300px] h-[300px] bg-[hsl(263_70%_58%/0.08)] top-[40%] left-[60%]" style={{ animationDelay: "5s" }} />
      <div className="absolute inset-0 particle-grid opacity-20 pointer-events-none" />

      <div className="w-full max-w-md relative">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 mb-8 group opacity-0 animate-fade-in"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
          Back to Home
        </Link>

        <div className="glass-panel-strong p-8 sm:p-10 rounded-2xl hover-glow relative overflow-hidden opacity-0 animate-fade-in-up">
          <div className="absolute top-0 left-0 right-0 h-[2px] gradient-accent opacity-60" />

          <div className="flex flex-col items-center mb-8">
            <div className="p-3 rounded-xl btn-glow mb-4">
              <Hexagon className="w-6 h-6 text-foreground relative z-10" />
            </div>
            <h1 className="font-display font-bold text-2xl gradient-text">SCSMS</h1>
            <div className="flex items-center gap-2 mt-3">
              <RoleIcon className="w-4 h-4 text-muted-foreground" />
              <p className="text-muted-foreground text-sm">{roleLabel} {isSignUp ? "Registration" : "Access Portal"}</p>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 mb-6 rounded-lg bg-destructive/10 border border-destructive/25 text-destructive text-sm animate-fade-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 p-3 mb-6 rounded-lg bg-success/10 border border-success/25 text-success text-sm animate-fade-in">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Full Name</Label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors duration-300" />
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="pl-10 bg-muted/20 border-border/40 rounded-xl h-11 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Email</Label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors duration-300" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email"
                  className="pl-10 bg-muted/20 border-border/40 rounded-xl h-11 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Password</Label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors duration-300" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="pl-10 bg-muted/20 border-border/40 rounded-xl h-11 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full btn-glow border-0 text-foreground font-semibold rounded-xl h-11 mt-2"
            >
              <span className="relative z-10">
                {loading ? "Please wait..." : isSignUp ? `Create ${roleLabel} Account` : `Sign In as ${roleLabel}`}
              </span>
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => { setIsSignUp(!isSignUp); setError(""); setSuccess(""); }}
              className="text-xs text-muted-foreground hover:text-primary transition-colors duration-300"
            >
              {isSignUp ? "Already have an account? Sign In" : "Need an account? Sign Up"} →
            </button>
          </div>

          <div className="mt-4 flex flex-col items-center gap-1">
            {targetRole !== "Student" && (
              <Link to="/login?role=Student" className="text-xs text-muted-foreground hover:text-primary transition-colors duration-300">
                Sign in as Student instead →
              </Link>
            )}
            {targetRole !== "Admin" && (
              <Link to="/login?role=Admin" className="text-xs text-muted-foreground hover:text-primary transition-colors duration-300">
                Sign in as Admin instead →
              </Link>
            )}
            {targetRole !== "Technician" && (
              <Link to="/login?role=Technician" className="text-xs text-muted-foreground hover:text-primary transition-colors duration-300">
                Sign in as Technician instead →
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
