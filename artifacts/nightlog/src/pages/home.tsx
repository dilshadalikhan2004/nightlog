import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight, Flame, Camera, MapPin, Users, Waves, Send,
  Radio, Sparkles, ChevronRight, Menu, X,
} from "lucide-react";
import { Link } from "wouter";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/contexts/auth";
import { CursorGlow } from "@/components/cursor-glow";
import { NightlogLogo } from "@/components/nightlog-logo";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";

/* ─── Animated counter ─── */
function useCountUp(target: number, duration = 1600) {
  const [val, setVal] = useState(0);
  const raf = useRef<number>(0);
  useEffect(() => {
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / duration, 1);
      setVal(Math.round(target * (1 - Math.pow(1 - p, 4))));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration]);
  return val;
}

/* ─── Floating orb ─── */
function Orb({ x, y, size, color, delay = 0 }: { x: string; y: string; size: number; color: string; delay?: number }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{ left: x, top: y, width: size, height: size, background: color, filter: "blur(80px)", opacity: 0.18 }}
      animate={{ scale: [1, 1.15, 1], opacity: [0.14, 0.22, 0.14] }}
      transition={{ duration: 7 + delay, repeat: Infinity, ease: "easeInOut", delay }}
    />
  );
}

/* ─── Ticker ─── */
const TICKERS = ["Neon Afterlife · 97%", "Vault 09 · Underground", "Skyline Pulse · 94%", "Midnight Echo", "Crystal Basement · Live", "Neon Ritual · 88%", "The Bunker · 203 in", "Afterhours · 5AM"];

function Ticker() {
  return (
    <div className="overflow-hidden" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <motion.div
        className="flex gap-10 py-3 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 24, ease: "linear", repeat: Infinity }}
        style={{ width: "max-content" }}
      >
        {[...TICKERS, ...TICKERS].map((item, i) => (
          <span key={i} className="text-[11px] font-medium text-white/28 flex items-center gap-3">
            <span className="w-1 h-1 rounded-full bg-[#7c5cfc] inline-block" />
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ─── Feature Carousel Card ─── */
function FeatureCard({ card, index }: { card: typeof FEATURE_CARDS[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -8, scale: 1.015 }}
      className="relative rounded-[28px] overflow-hidden flex"
      style={{
        width: "min(88vw, 860px)",
        height: "min(58vh, 440px)",
        border: "1px solid hsl(var(--border))",
        background: "hsla(var(--card), 0.85)",
        backdropFilter: "blur(20px)",
        boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
        flexShrink: 0,
      }}
    >
      {/* Left Side - Content */}
      <div className="w-1/2 p-10 flex flex-col justify-between z-10">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: card.iconColor }} />
            <p className="text-[11px] font-bold tracking-[0.22em] uppercase" style={{ color: card.iconColor }}>{card.tag}</p>
          </div>
          <h3 className="text-[36px] font-bold text-foreground leading-tight mb-4 tracking-tight">{card.title}</h3>
          <p className="text-[15px] text-foreground/50 leading-relaxed max-w-[340px]">{card.desc}</p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-bold text-foreground/30 uppercase tracking-wider">{card.badge}</span>
            <span className="text-[14px] font-medium text-foreground/70">{card.stat}</span>
          </div>
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="w-11 h-11 rounded-full flex items-center justify-center"
            style={{ background: `${card.iconColor}22`, border: `1px solid ${card.iconColor}50` }}>
            <ArrowRight className="w-5 h-5" style={{ color: card.iconColor }} />
          </motion.div>
        </div>
      </div>

      {/* Right Side - Glowing Visual (Dribbble Reference) */}
      <div className="w-1/2 relative overflow-hidden bg-black/40 border-l border-white/5">
        {/* Grid Dots Overlay */}
        <div className="absolute inset-0 opacity-[0.15]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '16px 16px' }} />

        {/* Abstract Glowing Shapes */}
        {/* Abstract Glowing Shapes (Dynamic based on index and color) */}
        {index === 0 && (
          <div className="absolute inset-0 flex items-center justify-center scale-110">
            {/* Loop 1 - Primary Card Color */}
            <div className="absolute w-[220px] h-[220px] rounded-full border-[16px] border-transparent" 
              style={{ 
                transform: 'translate(-30px, -20px) rotate(45deg)',
                background: `linear-gradient(rgba(10,10,10,0.9), rgba(10,10,10,0.9)) padding-box, linear-gradient(135deg, ${card.iconColor}, #7c5cfc) border-box`,
                boxShadow: `0 0 50px ${card.iconColor}66, inset 0 0 20px ${card.iconColor}33`,
              }} 
            />
            
            {/* Loop 2 - Secondary Color (Cyan or similar) */}
            <div className="absolute w-[180px] h-[180px] rounded-[50px] border-[12px] border-transparent" 
              style={{ 
                transform: 'translate(40px, 30px) rotate(-15deg)',
                background: 'linear-gradient(rgba(10,10,10,0.9), rgba(10,10,10,0.9)) padding-box, linear-gradient(135deg, #00f0ff, #0072ff) border-box',
                boxShadow: '0 0 40px rgba(0, 240, 255, 0.4), inset 0 0 15px rgba(0, 240, 255, 0.2)',
              }} 
            />

            {/* Glowing Connection Path */}
            <div className="absolute w-[160px] h-[12px] bg-gradient-to-r from-[#ff007f] to-[#00f0ff] blur-[1px]"
              style={{
                transform: 'translate(5px, 5px) rotate(35deg)',
                boxShadow: '0 0 30px rgba(255, 0, 127, 0.6)',
                borderRadius: '6px'
              }}
            />

            {/* Glowing Nodes */}
            <div className="absolute w-4 h-4 rounded-full bg-white shadow-[0_0_15px_#fff]" style={{ transform: 'translate(-15px, -35px)' }} />
            <div className="absolute w-4 h-4 rounded-full bg-white shadow-[0_0_15px_#fff]" style={{ transform: 'translate(25px, 45px)' }} />
            
            {/* Japanese Text overlay like in the reference */}
            <div className="absolute top-10 right-10 text-[24px] font-bold text-white/10 select-none">
              次の章
            </div>
          </div>
        )}

        {index === 1 && (
          <div className="absolute inset-0 flex items-center justify-center scale-110">
            {/* Timeline / Frame Vibe for Memory Replay */}
            <div className="absolute w-[240px] h-[140px] rounded-xl border-[10px] border-transparent" 
              style={{ 
                transform: 'rotate(-8deg)',
                background: `linear-gradient(rgba(10,10,10,0.9), rgba(10,10,10,0.9)) padding-box, linear-gradient(135deg, ${card.iconColor}, #0055ff) border-box`,
                boxShadow: `0 0 40px ${card.iconColor}66`,
              }} 
            />
            <div className="absolute w-[200px] h-[100px] rounded-xl border-[8px] border-transparent" 
              style={{ 
                transform: 'rotate(4deg) translate(10px, 10px)',
                background: 'linear-gradient(rgba(10,10,10,0.9), rgba(10,10,10,0.9)) padding-box, linear-gradient(135deg, #7c5cfc, #ff007f) border-box',
                boxShadow: '0 0 30px rgba(124, 92, 252, 0.3)',
              }} 
            />
            {/* Glowing play button shape */}
            <div className="absolute w-0 h-0 border-t-[15px] border-t-transparent border-l-[25px] border-l-[#00d4ff] border-b-[15px] border-b-transparent"
              style={{
                transform: 'translate(0px, 0px)',
                filter: 'drop-shadow(0 0 10px #00d4ff)'
              }}
            />
          </div>
        )}

        {index >= 2 && (
          <div className="absolute inset-0 flex items-center justify-center scale-110">
            {/* Geometric pattern for others */}
            <div className="absolute w-[180px] h-[180px] border-[12px] border-transparent" 
              style={{ 
                transform: 'rotate(45deg)',
                background: `linear-gradient(rgba(10,10,10,0.9), rgba(10,10,10,0.9)) padding-box, linear-gradient(135deg, ${card.iconColor}, #ffaa00) border-box`,
                boxShadow: `0 0 40px ${card.iconColor}66`,
                borderRadius: '30px'
              }} 
            />
            <div className="absolute w-[100px] h-[100px] border-[8px] border-transparent" 
              style={{ 
                transform: 'rotate(-15deg)',
                background: 'linear-gradient(rgba(10,10,10,0.9), rgba(10,10,10,0.9)) padding-box, linear-gradient(135deg, #ffaa00, #7c5cfc) border-box',
                boxShadow: '0 0 30px rgba(255, 170, 0, 0.2)',
                borderRadius: '15px'
              }} 
            />
          </div>
        )}

        {/* Ambient Glows (Dynamic Color) */}
        <div className="absolute top-1/4 right-1/4 w-40 h-40 rounded-full blur-[100px] opacity-25" 
          style={{ background: card.iconColor }} />
        <div className="absolute bottom-1/4 left-1/4 w-40 h-40 rounded-full blur-[100px] opacity-15" 
          style={{ background: index === 0 ? '#00f0ff' : '#7c5cfc' }} />
      </div>
    </motion.div>
  );
}

/* ─── Stat ─── */
function Stat({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const n = useCountUp(value);
  return (
    <div className="flex flex-col items-center gap-1.5">
      <span className="text-[36px] font-bold tracking-tight text-foreground tabular-nums">{n}{suffix}</span>
      <span className="text-[11px] text-foreground/30 tracking-widest uppercase font-medium">{label}</span>
    </div>
  );
}

const FEATURE_CARDS = [
  {
    icon: Flame,
    title: "Live City Energy",
    desc: "Real-time energy scores across every venue. Know what's hot before you arrive.",
    tag: "Realtime",
    badge: "Live",
    stat: "38 venues tracked",
    gradient: "linear-gradient(135deg, #4c1d95 0%, #7c5cfc 50%, #a78bfa 100%)",
    iconColor: "#a78bfa",
    bars: [28, 45, 36, 62, 48, 72, 55, 80, 65, 90, 70, 85],
  },
  {
    icon: Camera,
    title: "Memory Replay",
    desc: "AI-assembled cinematic timelines from your night. Every moment, in sequence.",
    tag: "AI-Powered",
    badge: "AI",
    stat: "12,400+ memories",
    gradient: "linear-gradient(135deg, #0c4a6e 0%, #0284c7 50%, #00d4ff 100%)",
    iconColor: "#00d4ff",
    bars: [60, 40, 75, 55, 85, 65, 90, 70, 80, 50, 68, 78],
  },
  {
    icon: MapPin,
    title: "Discover",
    desc: "Rooftops, basements, afterhours and underground rooms — all in one pulse.",
    tag: "Exploration",
    badge: "Tonight",
    stat: "247 events tonight",
    gradient: "linear-gradient(135deg, #7f1d1d 0%, #dc2626 50%, #f87171 100%)",
    iconColor: "#f87171",
    bars: [50, 70, 40, 85, 60, 90, 45, 75, 55, 80, 65, 70],
  },
  {
    icon: Users,
    title: "Invite Circles",
    desc: "Build your crew for the night. Send invites, track who's in, move together.",
    tag: "Social",
    badge: "Groups",
    stat: "3 friends out now",
    gradient: "linear-gradient(135deg, #78350f 0%, #d97706 50%, #fbbf24 100%)",
    iconColor: "#fbbf24",
    bars: [45, 65, 80, 50, 70, 90, 60, 75, 55, 85, 40, 65],
  },
  {
    icon: Waves,
    title: "Ambient Pulse",
    desc: "City-wide chatter and event-specific feeds. Hear the vibe before you step in.",
    tag: "Social Layer",
    badge: "Ambient",
    stat: "City-wide channel",
    gradient: "linear-gradient(135deg, #1e1b4b 0%, #6d28d9 50%, #8b5cf6 100%)",
    iconColor: "#8b5cf6",
    bars: [35, 55, 70, 45, 80, 60, 90, 50, 75, 65, 85, 55],
  },
  {
    icon: Send,
    title: "Drop Moments",
    desc: "Capture directly from the floor and add them to your timeline instantly.",
    tag: "Capture",
    badge: "Instant",
    stat: "Live from the floor",
    gradient: "linear-gradient(135deg, #052e16 0%, #16a34a 50%, #4ade80 100%)",
    iconColor: "#4ade80",
    bars: [70, 50, 85, 60, 75, 45, 90, 65, 80, 55, 70, 82],
  },
];

/* ─── Dot indicator for sticky carousel ─── */
function Dot({ progress, i, total }: { progress: any; i: number; total: number }) {
  const mid = i / (total - 1);
  const half = 0.6 / (total - 1);
  const opacity = useTransform(progress, [Math.max(0, mid - half), mid, Math.min(1, mid + half)], [0.2, 1, 0.2]);
  const w = useTransform(progress, [Math.max(0, mid - half), mid, Math.min(1, mid + half)], [6, 20, 6]);
  return <motion.div style={{ opacity, width: w, height: 6, borderRadius: 3, background: "hsl(var(--foreground))", flexShrink: 0 }} />;
}

/* ─── Sticky horizontal feature carousel ─── */
function StickyFeatureCarousel() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const n = FEATURE_CARDS.length;
  const x = useTransform(scrollYProgress, [0, 1], ["0vw", `${-(n - 1) * 100}vw`]);

  return (
    <div ref={ref} style={{ height: `${n * 100}vh` }} id="features">
        <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden", background: "hsl(var(--background))", borderTop: "1px solid hsl(var(--border))" }}>

        {/* Header top-left */}
        <div style={{ position: "absolute", top: 48, left: 40, zIndex: 20 }}>
          <p className="text-[11px] font-semibold text-foreground/28 tracking-[0.22em] uppercase mb-3">What Nightlog does</p>
          <h2 className="text-[clamp(26px,3.5vw,44px)] font-bold text-foreground leading-tight tracking-tight">
            The city's nightlife,<br />made intelligent.
          </h2>
        </div>

        {/* Scroll hint top-right */}
        <div style={{ position: "absolute", top: 56, right: 40, zIndex: 20 }}>
            <p className="text-[12px] text-foreground/22 tracking-wide">↓ scroll to explore</p>
        </div>

        {/* Dot progress bottom-center */}
        <div style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", zIndex: 20, display: "flex", gap: 6, alignItems: "center" }}>
          {FEATURE_CARDS.map((_, i) => <Dot key={i} progress={scrollYProgress} i={i} total={n} />)}
        </div>

        {/* Sliding track */}
        <motion.div style={{ x, display: "flex", width: `${n * 100}vw`, height: "100%", alignItems: "center" }}>
          {FEATURE_CARDS.map((card, i) => (
            <div key={card.title} style={{ width: "100vw", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, paddingTop: 140, paddingBottom: 60 }}>
              <FeatureCard card={card} index={i} />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

const TESTIMONIALS = [
  { name: "Arav S.", handle: "@arav", text: "The energy score saved me from a dead event at 1AM. Jumped to Vault 09 instead — insane night.", role: "Regular" },
  { name: "Nyla K.", handle: "@nyla_k", text: "Replaying my night as a cinematic timeline is genuinely wild. Looks like a short film.", role: "Creator" },
  { name: "Zara M.", handle: "@zara", text: "The invite circle feature changed how my friend group goes out. We actually stay together now.", role: "Social" },
];

export default function Home() {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], ["0px", "80px"]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <CursorGlow />

      {/* ── Floating Navbar ── */}
      <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-5xl px-4">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-between px-5 py-3 rounded-2xl"
          style={{ background: "rgba(10,10,10,0.72)", border: "1px solid rgba(255,255,255,0.13)", backdropFilter: "blur(28px)", boxShadow: "0 1px 0 rgba(255,255,255,0.06) inset, 0 4px 24px rgba(0,0,0,0.4)" }}
        >
          {/* Logo */}
          <Link href="/">
            <div className="cursor-pointer">
              <NightlogLogo size="md" mode="full" />
            </div>
          </Link>

          {/* Desktop links */}
          <nav className="hidden md:flex items-center gap-6">
            {[["Features", "#features"], ["About", "#about"], ["Cities", "#cities"]].map(([label, href]) => (
              <a key={label} href={href} className="text-[13px] text-white/40 hover:text-white/80 transition-colors">{label}</a>
            ))}
          </nav>

          {/* CTAs */}
          <div className="hidden md:flex items-center gap-2.5">
            <AnimatedThemeToggler 
              className="w-9 h-9 flex items-center justify-center rounded-xl text-white/55 hover:text-white/85 transition-colors" 
              style={{ border: "1px solid rgba(255,255,255,0.09)" }}
            />
            <Link href="/login">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                className="px-4 py-2 rounded-xl text-[13px] font-medium text-white/55 hover:text-white/85 transition-colors"
                style={{ border: "1px solid rgba(255,255,255,0.09)" }}>
                Sign In
              </motion.button>
            </Link>
            <Link href={user ? "/discover" : "/signup"}>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold text-white"
                style={{ background: "#7c5cfc", boxShadow: "0 0 0 1px rgba(124,92,252,0.35), 0 4px 16px rgba(124,92,252,0.22)" }}>
                Get Started <ArrowRight className="w-3.5 h-3.5" />
              </motion.button>
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button className="md:hidden text-white/55 hover:text-white/90 transition-colors" onClick={() => setMenuOpen(v => !v)}>
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </motion.div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            className="mt-2 rounded-2xl p-4 space-y-3"
            style={{ background: "rgba(10,10,10,0.95)", border: "1px solid rgba(255,255,255,0.09)", backdropFilter: "blur(24px)" }}
          >
            {[["Features", "#features"], ["About", "#about"], ["Cities", "#cities"]].map(([label, href]) => (
              <a key={label} href={href} onClick={() => setMenuOpen(false)} className="block text-[14px] text-white/50 hover:text-white/85 transition-colors py-1">{label}</a>
            ))}
            <div className="flex gap-2 pt-1">
              <Link href="/login"><button className="flex-1 py-2 rounded-xl text-[13px] font-medium text-white/60 border border-white/10">Sign In</button></Link>
              <Link href={user ? "/discover" : "/signup"}>
                <button className="flex-1 py-2 rounded-xl text-[13px] font-semibold text-white" style={{ background: "#7c5cfc" }}>
                  Get Started
                </button>
              </Link>
            </div>
          </motion.div>
        )}
      </header>

      {/* ── Hero ── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center px-6 pt-24 pb-12 overflow-hidden">
        {/* Background orbs */}
        <Orb x="10%" y="15%" size={500} color="#7c5cfc" delay={0} />
        <Orb x="65%" y="5%" size={400} color="#00d4ff" delay={2.5} />
        <Orb x="30%" y="60%" size={360} color="#f0365a" delay={4} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(124,92,252,0.07), transparent 55%)" }} />

        <motion.div style={{ opacity: heroOpacity, y: heroY }} className="relative z-10 max-w-7xl mx-auto grid md:grid-cols-12 gap-12 items-center w-full">
          {/* Left Column - Text */}
          <div className="md:col-span-7 space-y-8 text-left">
            {/* Hero type */}
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
              <h1 className="display text-[clamp(64px,9vw,130px)] text-foreground leading-[0.9] tracking-wide">
                NIGHTS<br />
                <span style={{ WebkitTextStroke: "1.5px var(--stroke-color)", color: "transparent" }}>TURNED</span><br />
                CINEMA
              </h1>
            </motion.div>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
              className="text-[16px] text-foreground/38 max-w-md leading-relaxed font-light">
              A cinematic nightlife platform for discovering events, replaying memories, and moving through the city with live energy.
            </motion.p>
          </div>

          {/* Right Column - Unique Visual */}
          <div className="md:col-span-5 relative h-[600px] flex items-center justify-center">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#7c5cfc]/10 to-[#f0365a]/10 blur-[100px] rounded-full" />

            {/* CSS Animations for butter smooth performance */}
            <style>{`
              @keyframes float-slow {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-10px); }
              }
              @keyframes float-mid {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(10px); }
              }
              @keyframes float-fast {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-15px); }
              }
              .float-slow { animation: float-slow 8s ease-in-out infinite; }
              .float-mid { animation: float-mid 6s ease-in-out infinite; }
              .float-fast { animation: float-fast 4s ease-in-out infinite; }
            `}</style>

            {/* Layer 1: The Back Card (Grid) */}
            <div className="absolute w-[320px] h-[400px]" style={{ transform: "rotate(-6deg) translateZ(-20px)" }}>
              <div className="float-slow w-full h-full">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="w-full h-full bg-black/40 backdrop-blur-xl border border-white/5 rounded-[24px] p-6 shadow-2xl"
                >
                  <div className="text-[11px] uppercase tracking-widest text-white/30 font-semibold mb-4">City Grid</div>
                  <div className="space-y-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="h-14 bg-white/5 rounded-lg flex items-center justify-between px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-md bg-[#7c5cfc]/20 flex items-center justify-center text-[12px] text-[#7c5cfc]">★</div>
                          <div className="space-y-1">
                            <div className="w-20 h-2.5 bg-white/20 rounded" />
                            <div className="w-12 h-2 bg-white/10 rounded" />
                          </div>
                        </div>
                        <div className="w-10 h-2 bg-white/10 rounded" />
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Layer 2: The Middle Card (Energy Graph) */}
            <div className="absolute w-[340px] h-[240px]" style={{ transform: "rotate(4deg) translateZ(0px)" }}>
              <div className="float-mid w-full h-full">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                  className="w-full h-full backdrop-blur-xl rounded-[24px] p-6 shadow-2xl"
                  style={{ 
                    background: "rgba(255, 255, 255, 0.08)",
                    border: "1px solid rgba(255, 255, 255, 0.2)"
                  }}
                >
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-[11px] uppercase tracking-widest text-white/70 font-semibold">Live Pulse</div>
                    <div className="text-[14px] font-bold text-[#00d4ff]">94% Peak</div>
                  </div>
                  <div className="flex items-end gap-1.5 h-[120px]">
                    {[...Array(15)].map((_, i) => (
                      <div 
                        key={i} 
                        className="flex-1 bg-gradient-to-t from-[#7c5cfc] to-[#00d4ff] rounded-full" 
                        style={{ height: `${Math.sin(i * 0.8) * 30 + 50}%` }}
                      />
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Layer 3: The Front Card (Featured Event) */}
            <div className="absolute w-[360px]" style={{ transform: "translateZ(20px)" }}>
              <div className="float-fast w-full h-full">
                <motion.div 
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.9, duration: 0.8 }}
                  className="w-full rounded-[24px] p-8 shadow-2xl overflow-hidden"
                  style={{ 
                    backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.8)), url('https://images.unsplash.com/photo-1761959167085-65a8375d47a4?ixlib=rb-4.1.0&q=85&fm=jpg&crop=entropy&cs=srgb')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundColor: '#7c5cfc'
                  }}
                >
                  <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                      <span className="text-[11px] font-bold text-white uppercase tracking-wider">Tonight</span>
                    </div>
                    <div className="text-[12px] font-semibold text-white/80">02:14 AM</div>
                  </div>
                  
                  <div className="space-y-1 mb-8">
                    <h3 className="text-[26px] font-bold text-white leading-tight">Secret Rave</h3>
                    <p className="text-[14px] text-white/80 font-light">Warehouse 7 · 1.2k here</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="w-8 h-8 rounded-full bg-white/20 border border-white/50 flex items-center justify-center text-[12px] font-bold text-white">
                          U
                        </div>
                      ))}
                      <div className="w-8 h-8 rounded-full bg-black/40 border border-white/50 flex items-center justify-center text-[12px] font-bold text-white">
                        +4
                      </div>
                    </div>
                    <button className="px-5 py-2.5 bg-white text-[#7c5cfc] rounded-xl text-[13px] font-bold shadow-lg hover:scale-105 transition-transform">
                      Join
                    </button>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-5 h-8 rounded-full border border-white/15 flex items-start justify-center pt-1.5">
            <div className="w-1 h-1.5 rounded-full bg-white/35" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── Ticker ── */}
      <Ticker />

      {/* ── Live Stats ── */}
      <section id="about" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 md:divide-x md:divide-white/6">
            <Stat value={247} suffix="" label="Live Tonight" />
            <Stat value={12400} suffix="+" label="Memories Made" />
            <Stat value={94} suffix="%" label="City Energy" />
            <Stat value={38} suffix="" label="Active Venues" />
          </motion.div>
        </div>
      </section>

      {/* ── Features — Sticky Horizontal Scroll ── */}
      <StickyFeatureCarousel />

      {/* ── Testimonials ── */}
      <section className="py-16 px-6" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-5xl mx-auto space-y-10">
          <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-[11px] font-semibold text-foreground/28 tracking-[0.22em] uppercase mb-3">From the city</p>
            <h2 className="text-[clamp(28px,4vw,40px)] font-bold text-foreground tracking-tight">Real people. Real nights.</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-4">
            {TESTIMONIALS.map((t, i) => (
              <motion.div key={t.handle}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="p-6 flex flex-col gap-5 card"
              >
                <p className="text-[14px] text-foreground/55 leading-relaxed flex-1">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold text-white shrink-0"
                    style={{ background: "linear-gradient(135deg,#7c5cfc,#f0365a)" }}>
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-foreground/80">{t.name}</div>
                    <div className="text-[11px] text-foreground/28">{t.handle}</div>
                  </div>
                  <span className="ml-auto text-[10px] text-foreground/20 uppercase tracking-widest">{t.role}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-24 px-6 relative overflow-hidden" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(124,92,252,0.08), transparent 60%)" }} />
        <div className="max-w-3xl mx-auto text-center relative z-10 space-y-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="display text-[clamp(56px,10vw,112px)] text-foreground leading-none tracking-wide">
              YOUR NIGHT<br />
              <span style={{ WebkitTextStroke: "1.5px var(--stroke-color)", color: "transparent" }}>STARTS HERE</span>
            </h2>
            <p className="text-[16px] text-foreground/32 mt-5 font-light">Join the city. Every night has a story.</p>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <Link href={user ? "/discover" : "/signup"}>
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2.5 px-10 py-4 rounded-2xl text-[16px] font-semibold text-white"
                style={{ background: "#7c5cfc", boxShadow: "0 0 0 1px rgba(124,92,252,0.35), 0 16px 48px rgba(124,92,252,0.3)" }}>
                {user ? "Open the App" : "Enter the Night"} <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="px-6 pt-24 pb-12 relative overflow-hidden" style={{ borderTop: "1px solid hsl(var(--border))" }}>
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-10 md:gap-4 relative z-10">
          {/* Brand Column */}
          <div className="col-span-2 space-y-6">
            <div className="flex items-center">
              <NightlogLogo size="md" mode="full" />
            </div>
            <p className="text-[13px] text-foreground/30 leading-relaxed max-w-[240px]">
              © copyright Nightlog 2026. All rights reserved.
            </p>
          </div>

          {/* Pages Column */}
          <div className="space-y-4">
            <h3 className="text-[13px] font-bold text-foreground/70 uppercase tracking-wider">Pages</h3>
            <ul className="space-y-2.5 text-[13px] text-foreground/40">
              <li><Link href="/discover"><span className="hover:text-foreground transition-colors cursor-pointer">All Products</span></Link></li>
              <li><Link href="/"><span className="hover:text-foreground transition-colors cursor-pointer">Studio</span></Link></li>
              <li><Link href="/"><span className="hover:text-foreground transition-colors cursor-pointer">Clients</span></Link></li>
              <li><Link href="/"><span className="hover:text-foreground transition-colors cursor-pointer">Pricing</span></Link></li>
              <li><Link href="/"><span className="hover:text-foreground transition-colors cursor-pointer">Blog</span></Link></li>
            </ul>
          </div>

          {/* Socials Column */}
          <div className="space-y-4">
            <h3 className="text-[13px] font-bold text-foreground/70 uppercase tracking-wider">Socials</h3>
            <ul className="space-y-2.5 text-[13px] text-foreground/40">
              <li><a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Facebook</a></li>
              <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Instagram</a></li>
              <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Twitter</a></li>
              <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">LinkedIn</a></li>
            </ul>
          </div>

          {/* Legal Column */}
          <div className="space-y-4">
            <h3 className="text-[13px] font-bold text-foreground/70 uppercase tracking-wider">Legal</h3>
            <ul className="space-y-2.5 text-[13px] text-foreground/40">
              <li><Link href="/"><span className="hover:text-foreground transition-colors cursor-pointer">Privacy Policy</span></Link></li>
              <li><Link href="/"><span className="hover:text-foreground transition-colors cursor-pointer">Terms of Service</span></Link></li>
              <li><Link href="/"><span className="hover:text-foreground transition-colors cursor-pointer">Cookie Policy</span></Link></li>
            </ul>
          </div>

          {/* Register Column */}
          <div className="space-y-4">
            <h3 className="text-[13px] font-bold text-foreground/70 uppercase tracking-wider">Register</h3>
            <ul className="space-y-2.5 text-[13px] text-foreground/40">
              <li><Link href="/signup"><span className="hover:text-foreground transition-colors cursor-pointer">Sign Up</span></Link></li>
              <li><Link href="/login"><span className="hover:text-foreground transition-colors cursor-pointer">Login</span></Link></li>
              <li><Link href="/forgot-password"><span className="hover:text-foreground transition-colors cursor-pointer">Forgot Password</span></Link></li>
            </ul>
          </div>
        </div>

        {/* Massive Background Text */}
        <div className="absolute bottom-[-10%] left-1/2 transform -translate-x-1/2 select-none pointer-events-none opacity-[0.03] text-[22vw] font-bold text-foreground whitespace-nowrap leading-none">
          Nightlog
        </div>
      </footer>
    </div>
  );
}
