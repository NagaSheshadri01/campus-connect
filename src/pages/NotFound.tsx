import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center px-4 relative overflow-hidden">
      <div className="floating-orb w-[400px] h-[400px] bg-primary/10 top-[20%] left-[10%]" />
      <div className="floating-orb w-[300px] h-[300px] bg-accent/10 bottom-[20%] right-[10%]" style={{ animationDelay: '3s' }} />

      <div className="text-center relative animate-scale-in">
        <h1 className="text-9xl font-display font-bold gradient-text mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-8">This page doesn't exist.</p>
        <Link to="/">
          <Button className="btn-glow border-0 text-foreground font-semibold rounded-full px-8">
            <Home className="w-4 h-4 mr-2 relative z-10" />
            <span className="relative z-10">Back to Home</span>
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;