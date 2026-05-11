import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/auth";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (isLoading) return;
    if (!user) navigate("/");
    else if (!user.onboardingComplete && !user.isGuest) navigate("/onboarding");
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center" style={{ background: "#0a0a0a" }}>
        <div className="space-y-3 text-center">
          <div className="w-7 h-7 rounded-full border-t-2 border-primary animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  if (!user || (!user.onboardingComplete && !user.isGuest)) return null;

  return <>{children}</>;
}
