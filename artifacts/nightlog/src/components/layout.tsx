import { Link, useLocation } from "wouter";
import { Compass, Home, Mail, User, Sparkles, Flame, Radio } from "lucide-react";
import { CursorGlow } from "./cursor-glow";
import { useGetFeedStats } from "@workspace/api-client-react";
import { motion } from "framer-motion";

const NAV = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/discover", icon: Compass, label: "Discover" },
  { href: "/memories", icon: Sparkles, label: "Memories" },
  { href: "/invites", icon: Flame, label: "Invites", badge: 1 },
  { href: "/messages", icon: Mail, label: "Pulse" },
  { href: "/profile", icon: User, label: "Profile" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { data: stats } = useGetFeedStats();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <CursorGlow />

      {/* Desktop sidebar */}
      <nav className="hidden lg:flex fixed top-0 left-0 bottom-0 w-56 flex-col z-50"
        style={{ borderRight: "1px solid rgba(255,255,255,0.06)", background: "rgba(8,8,8,0.95)", backdropFilter: "blur(24px)" }}>

        {/* Wordmark */}
        <div className="px-5 pt-6 pb-4 flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
            style={{ background: "linear-gradient(135deg,#7c5cfc,#00d4ff)" }}>
            <span className="text-white font-bold text-[10px]" style={{ fontFamily: "'DM Sans',sans-serif" }}>NL</span>
          </div>
          <span className="text-[14px] font-semibold tracking-tight text-white/85">Nightlog</span>
        </div>

        <div className="divider mx-4 mb-3" />

        {/* Nav items */}
        <ul className="flex-1 px-2.5 space-y-0.5">
          {NAV.map(({ href, icon: Icon, label, badge }) => {
            const active = location === href;
            return (
              <li key={href}>
                <Link href={href}
                  className={`group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150 ${
                    active
                      ? "bg-white/8 text-white"
                      : "text-white/38 hover:text-white/75 hover:bg-white/4"
                  }`}>
                  <Icon className={`w-4 h-4 shrink-0 transition-colors ${active ? "text-white" : "text-white/28 group-hover:text-white/55"}`} />
                  <span className="flex-1">{label}</span>
                  {active && <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />}
                  {!active && badge ? (
                    <span className="w-4 h-4 rounded-full text-[9px] font-bold text-white flex items-center justify-center shrink-0"
                      style={{ background: "#f0365a" }}>{badge}</span>
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* City Pulse strip */}
        <div className="mx-3 mb-3 rounded-xl p-3 space-y-2.5" style={{ background: "rgba(124,92,252,0.07)", border: "1px solid rgba(124,92,252,0.14)" }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Radio className="w-3 h-3 text-primary" />
              <span className="text-[10px] font-semibold text-primary tracking-widest uppercase">City Pulse</span>
            </div>
            <span className="live-dot bg-[#00d4ff]" />
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { label: "Venues", value: stats?.live_events ?? "—" },
              { label: "Energy", value: stats?.avg_energy ? `${stats.avg_energy}%` : "—" },
              { label: "Out Now", value: stats?.people_out ?? "—" },
              { label: "Memories", value: stats?.memories_tonight ?? "—" },
            ].map(({ label, value }) => (
              <div key={label} className="space-y-0.5">
                <div className="text-[9px] text-white/25 uppercase tracking-widest">{label}</div>
                <div className="text-[13px] font-semibold tabular-nums text-white/80">{String(value)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* User footer */}
        <div className="px-3 pb-5 pt-1">
          <div className="divider mb-3" />
          <div className="px-2 flex items-center gap-3">
            <div className="relative shrink-0">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold text-white"
                style={{ background: "linear-gradient(135deg,#7c5cfc,#f0365a)" }}>
                D
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-[#0a0a0a] bg-emerald-400" />
            </div>
            <div className="min-w-0">
              <div className="text-[12px] font-medium text-white/75 truncate">dilshad</div>
              <div className="text-[10px] text-emerald-400/60 truncate">online</div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main */}
      <main className="pb-20 lg:pb-0 lg:pl-56 min-h-screen">
        <motion.div
          key={location}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          style={{ minHeight: "100%" }}
        >
          {children}
        </motion.div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(8,8,8,0.97)", backdropFilter: "blur(20px)" }}>
        <ul className="flex items-center justify-around h-14 px-2">
          {NAV.map(({ href, icon: Icon, label, badge }) => {
            const active = location === href;
            return (
              <li key={href}>
                <Link href={href}
                  className={`relative flex flex-col items-center justify-center gap-1 w-12 h-12 rounded-xl transition-all ${
                    active ? "text-white" : "text-white/28"
                  }`}>
                  <Icon className="w-4.5 h-4.5" />
                  <span className="text-[9px] font-medium tracking-wide">{label}</span>
                  {!active && badge ? (
                    <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full text-[8px] font-bold text-white flex items-center justify-center"
                      style={{ background: "#f0365a" }}>{badge}</span>
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
