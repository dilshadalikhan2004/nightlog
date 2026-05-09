import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Compass, Flame, Home, Mail, User, Sparkles } from "lucide-react";
import { CursorGlow } from "./cursor-glow";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/discover", icon: Compass, label: "Discover" },
    { href: "/memories", icon: Sparkles, label: "Memories" },
    { href: "/invites", icon: Flame, label: "Invites" },
    { href: "/messages", icon: Mail, label: "Messages" },
    { href: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 relative">
      <CursorGlow />
      <div className="fixed inset-0 z-[-1] pointer-events-none opacity-[0.15] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
      
      <main className="pb-24 lg:pb-0 lg:pl-64 min-h-screen">
        {children}
      </main>

      {/* Mobile Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 glass-card border-t border-white/5 pb-safe">
        <ul className="flex items-center justify-around h-16 px-4">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className={`flex flex-col items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${location === item.href ? "text-primary glow-text" : "text-muted-foreground hover:text-white"}`}>
                <item.icon className={`w-5 h-5 ${location === item.href ? "drop-shadow-[0_0_8px_rgba(139,111,255,0.8)]" : ""}`} />
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Desktop Nav */}
      <nav className="hidden lg:flex fixed top-0 left-0 bottom-0 w-64 flex-col glass-card border-r border-white/5 z-50">
        <div className="p-8">
          <Link href="/" className="text-2xl font-display font-bold tracking-tight glow-text flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-secondary animate-pulse shadow-[0_0_15px_rgba(139,111,255,0.5)]" />
            Nightlog
          </Link>
        </div>
        
        <ul className="flex-1 px-4 space-y-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-500 ${location === item.href ? "bg-white/10 text-white glow-text shadow-[inset_0_0_20px_rgba(255,255,255,0.05)] border border-white/10" : "text-muted-foreground hover:text-white hover:bg-white/5"}`}>
                <item.icon className={`w-5 h-5 ${location === item.href ? "drop-shadow-[0_0_8px_rgba(139,111,255,0.8)]" : ""}`} />
                <span className="font-medium tracking-wide">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}