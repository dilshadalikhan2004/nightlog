import { Link, useLocation } from "wouter";
import { Compass, Home, Mail, User, Sparkles, Flame } from "lucide-react";
import { CursorGlow } from "./cursor-glow";

const NAV = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/discover", icon: Compass, label: "Discover" },
  { href: "/memories", icon: Sparkles, label: "Memories" },
  { href: "/invites", icon: Flame, label: "Invites" },
  { href: "/messages", icon: Mail, label: "Messages" },
  { href: "/profile", icon: User, label: "Profile" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <CursorGlow />

      {/* Desktop sidebar */}
      <nav className="hidden lg:flex fixed top-0 left-0 bottom-0 w-60 flex-col z-50"
        style={{ borderRight: "1px solid rgba(255,255,255,0.06)", background: "rgba(10,10,10,0.92)", backdropFilter: "blur(24px)" }}>

        {/* Wordmark */}
        <div className="px-7 pt-8 pb-6 flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: "linear-gradient(135deg,#7c5cfc,#00d4ff)" }}>
            <span className="text-white font-bold text-xs" style={{ fontFamily: "'DM Sans',sans-serif" }}>NL</span>
          </div>
          <span className="text-[15px] font-semibold tracking-tight text-white/90">Nightlog</span>
        </div>

        <div className="divider mx-4 mb-4" />

        {/* Nav items */}
        <ul className="flex-1 px-3 space-y-0.5">
          {NAV.map(({ href, icon: Icon, label }) => {
            const active = location === href;
            return (
              <li key={href}>
                <Link href={href}
                  className={`group flex items-center gap-3 px-4 py-2.5 rounded-xl text-[14px] font-medium transition-all duration-150 ${
                    active
                      ? "bg-white/8 text-white"
                      : "text-white/40 hover:text-white/80 hover:bg-white/4"
                  }`}>
                  <Icon className={`w-[18px] h-[18px] shrink-0 transition-colors ${active ? "text-white" : "text-white/30 group-hover:text-white/60"}`} />
                  {label}
                  {active && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Footer */}
        <div className="px-4 pb-7 pt-4">
          <div className="divider mb-4" />
          <div className="px-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold text-white"
              style={{ background: "linear-gradient(135deg,#7c5cfc,#f0365a)" }}>
              D
            </div>
            <div className="min-w-0">
              <div className="text-[13px] font-medium text-white/80 truncate">dilshad</div>
              <div className="text-[11px] text-white/30 truncate">online</div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main */}
      <main className="pb-24 lg:pb-0 lg:pl-60 min-h-screen">
        {children}
      </main>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(10,10,10,0.95)", backdropFilter: "blur(20px)" }}>
        <ul className="flex items-center justify-around h-16 px-2">
          {NAV.map(({ href, icon: Icon, label }) => {
            const active = location === href;
            return (
              <li key={href}>
                <Link href={href}
                  className={`flex flex-col items-center justify-center gap-1 w-12 h-12 rounded-xl transition-all ${
                    active ? "text-white" : "text-white/30"
                  }`}>
                  <Icon className="w-5 h-5" />
                  <span className="text-[9px] font-medium tracking-wide">{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
