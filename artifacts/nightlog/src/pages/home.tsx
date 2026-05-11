import { Layout } from "@/components/layout";
import { useGetFeedStats, useGetTrendingEvents } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { ArrowRight, Flame, TrendingUp, MapPin, Users, Camera, Waves, Send } from "lucide-react";
import { Link } from "wouter";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/contexts/auth";

/* ── Animated counter ── */
function useCountUp(target: number | undefined, duration = 1400) {
  const [val, setVal] = useState(0);
  const raf = useRef<number>(0);
  useEffect(() => {
    if (target === undefined) return;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 4);
      setVal(Math.round(target * ease));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration]);
  return val;
}

function StatItem({ label, value, suffix }: { label: string; value: number | undefined; suffix: string }) {
  const animated = useCountUp(value);
  return (
    <div className="flex flex-col gap-1.5 px-7 py-5 border-r border-white/6 last:border-r-0 first:pl-0 last:pr-0 min-w-[130px]">
      <span className="text-[10px] font-semibold tracking-[0.22em] text-white/28 uppercase">{label}</span>
      <span className="text-[28px] font-semibold tracking-tight tabular-nums text-white leading-none">
        {value !== undefined ? `${animated}${suffix}` : <span className="text-white/18 animate-pulse text-xl">—</span>}
      </span>
    </div>
  );
}

/* ── Marquee ticker ── */
const TICKER_ITEMS = [
  "Neon Afterlife · 97%",
  "Vault 09 · Underground",
  "Skyline Pulse · 94%",
  "Midnight Echo",
  "Crystal Basement · Live",
  "Neon Ritual · 88%",
  "The Bunker · 203 in",
  "Afterhours · 5AM",
];

function Marquee() {
  return (
    <div className="overflow-hidden py-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <motion.div
        className="flex gap-10 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 22, ease: "linear", repeat: Infinity }}
        style={{ width: "max-content" }}
      >
        {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
          <span key={i} className="text-[12px] font-medium text-white/30 flex items-center gap-3">
            <span className="w-1 h-1 rounded-full bg-primary inline-block" />
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

const FEATURES = [
  { icon: Flame, title: "Live Energy", desc: "Real-time scores across every venue in the city. Know what's hot before you arrive.", color: "#7c5cfc" },
  { icon: Camera, title: "Memory Replay", desc: "AI-assembled cinematic timelines from your night. Every moment, in order.", color: "#00d4ff" },
  { icon: MapPin, title: "Discover", desc: "Rooftops, basements, afterhours and underground rooms — all in one pulse.", color: "#f0365a" },
  { icon: Users, title: "Invite Circles", desc: "Build your crew for the night. Send invites, track who's in, move together.", color: "#f6c90e" },
  { icon: Waves, title: "Ambient Messaging", desc: "City-wide chatter and event-specific feeds. Hear the vibe before you step in.", color: "#7c5cfc" },
  { icon: Send, title: "Drop a Memory", desc: "Capture moments directly from the floor. Add them to your timeline instantly.", color: "#00d4ff" },
];

const TESTIMONIALS = [
  { name: "Arav S.", handle: "@arav", text: "The energy score saved me from a dead event at 1am. Jumped to Vault 09 instead. Insane night.", role: "Regular" },
  { name: "Nyla K.", handle: "@nyla_k", text: "Replaying my night as a cinematic timeline is genuinely wild. Looks like a short film.", role: "Creator" },
  { name: "Zara M.", handle: "@zara", text: "The invite circle feature changed how my friend group goes out. We actually stay together now.", role: "Social" },
];

export default function Home() {
  const { data: stats } = useGetFeedStats();
  const { data: trending } = useGetTrendingEvents();
  const { user } = useAuth();

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        {/* ── Hero ── */}
        <section className="relative py-14 lg:py-20 overflow-hidden rounded-[24px] border border-white/7 my-6"
          style={{ background: "rgba(255,255,255,0.025)" }}>
          <div className="absolute inset-0 pointer-events-none rounded-[24px]"
            style={{ background: "radial-gradient(ellipse at 20% 30%, rgba(124,92,252,0.14), transparent 35%), radial-gradient(ellipse at 75% 20%, rgba(0,212,255,0.09), transparent 28%), radial-gradient(ellipse at 50% 95%, rgba(240,54,90,0.06), transparent 30%)" }} />

          <div className="relative grid lg:grid-cols-[1.15fr_0.85fr] gap-10 items-center px-8 lg:px-14">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }} className="space-y-8">
              <div className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-full border border-white/8 bg-white/3">
                <span className="live-dot bg-[#00d4ff]" />
                <span className="text-[13px] text-white/45 tracking-wide">
                  {stats ? `${stats.people_out} people out tonight` : "Live city data"}
                </span>
              </div>

              <div>
                <h1 className="display text-[clamp(72px,11vw,140px)] text-white leading-[0.88] tracking-wide">
                  NIGHTS<br />
                  <span style={{ WebkitTextStroke: "1px rgba(255,255,255,0.18)", color: "transparent" }}>TURNED</span><br />
                  CINEMA
                </h1>
              </div>

              <p className="text-[17px] text-white/40 max-w-[420px] leading-relaxed font-light">
                A cinematic nightlife platform for discovering events, replaying memories, and moving through the city with live energy.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <Link href={user ? "/discover" : "/signup"}>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-[14px] font-semibold text-white"
                    style={{ background: "#7c5cfc", boxShadow: "0 0 0 1px rgba(124,92,252,0.3), 0 8px 24px rgba(124,92,252,0.22)" }}>
                    {user ? "Open the App" : "Enter Nightlog"} <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </Link>
                {user ? (
                  <Link href="/memories">
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                      className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-[14px] font-medium text-white/55 hover:text-white/80 transition-colors"
                      style={{ border: "1px solid rgba(255,255,255,0.09)" }}>
                      Replay memories
                    </motion.button>
                  </Link>
                ) : (
                  <Link href="/login">
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                      className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-[14px] font-medium text-white/55 hover:text-white/80 transition-colors"
                      style={{ border: "1px solid rgba(255,255,255,0.09)" }}>
                      Sign in
                    </motion.button>
                  </Link>
                )}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, delay: 0.12, ease: [0.16, 1, 0.3, 1] }} className="relative hidden lg:block">
              <div className="absolute inset-0 rounded-[24px] blur-3xl opacity-50"
                style={{ background: "linear-gradient(135deg, rgba(124,92,252,0.28), rgba(0,212,255,0.14))" }} />
              <div className="relative rounded-[24px] p-5 border border-white/8" style={{ background: "rgba(255,255,255,0.04)" }}>
                <div className="rounded-[20px] overflow-hidden relative border border-white/6"
                  style={{ aspectRatio: "4/5", background: "linear-gradient(135deg,#7c5cfc,#f0365a 52%,#00d4ff)" }}>
                  <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 30% 28%,rgba(255,255,255,0.22),transparent 26%),radial-gradient(circle at 70%22%,rgba(255,255,255,0.14),transparent 18%)" }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-black/10 to-transparent" />
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-white"
                    style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(10px)" }}>
                    <span className="live-dot bg-[#00d4ff]" /> LIVE · {stats?.avg_energy ?? 91}%
                  </div>
                  <div className="absolute bottom-5 left-5 right-5 space-y-4">
                    <div>
                      <p className="text-[10px] tracking-[0.22em] text-white/50 uppercase">Tonight's peak</p>
                      <h2 className="text-[22px] font-semibold text-white mt-1 leading-tight">Neon Afterlife</h2>
                      <p className="text-[13px] text-white/50 mt-1">Skyline Rooftop · {stats?.people_out ?? 247} attending</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2.5">
                      {[{ icon: Waves, label: "Energy" }, { icon: Camera, label: "Moments" }].map(({ icon: Icon, label }) => (
                        <div key={label} className="rounded-xl p-3 border border-white/10" style={{ background: "rgba(0,0,0,0.28)", backdropFilter: "blur(10px)" }}>
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center mb-2.5" style={{ background: "rgba(255,255,255,0.08)" }}>
                            <Icon className="w-3.5 h-3.5 text-white" />
                          </div>
                          <div className="text-[13px] font-semibold text-white">{label}</div>
                          <div className="text-[11px] text-white/45 mt-0.5">Live tonight</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Live stats strip ── */}
        <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex flex-wrap">
            <StatItem label="Live Events" value={stats?.live_events} suffix="" />
            <StatItem label="Out Tonight" value={stats?.people_out} suffix="" />
            <StatItem label="City Energy" value={stats?.avg_energy} suffix="%" />
            <StatItem label="Memories" value={stats?.memories_tonight} suffix="" />
          </div>
        </motion.section>

        {/* ── Marquee ── */}
        <Marquee />

        {/* ── Trending Tonight ── */}
        <section className="py-12 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <TrendingUp className="w-4 h-4 text-white/25" />
              <h2 className="text-[13px] font-semibold text-white/45 tracking-[0.18em] uppercase">Trending Tonight</h2>
            </div>
            <Link href="/discover">
              <span className="text-[13px] text-white/25 hover:text-white/55 transition-colors flex items-center gap-1">
                View all <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {trending?.map((event, i) => (
              <Link key={event.id} href={`/event/${event.id}`}>
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 + 0.2, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="relative rounded-[22px] overflow-hidden cursor-pointer group"
                  style={{ height: i === 0 ? 320 : 240 }}
                >
                  <div className="absolute inset-0" style={{ background: event.color_theme }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/82 via-black/20 to-transparent" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: "linear-gradient(135deg,rgba(255,255,255,0.07),transparent 55%)" }} />
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono text-white"
                    style={{ background: "rgba(0,0,0,0.42)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <Flame className="w-3 h-3" /> {event.energy_score}%
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-white/48 mb-1.5">{event.type}</p>
                    <h3 className="text-[22px] font-semibold text-white leading-tight">{event.title}</h3>
                    <p className="text-[13px] text-white/50 mt-1">{event.venue} · {event.attendee_count} going</p>
                  </div>
                </motion.div>
              </Link>
            ))}
            {!trending && [1, 2, 3].map(i => (
              <div key={i} className="rounded-[22px] animate-pulse" style={{ height: i === 0 ? 320 : 240, background: "rgba(255,255,255,0.04)" }} />
            ))}
          </div>
        </section>

        {/* ── Features ── */}
        <section className="py-4 pb-14 space-y-8" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="pt-10">
            <h2 className="text-[13px] font-semibold text-white/40 tracking-[0.18em] uppercase">What Nightlog does</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map(({ icon: Icon, title, desc, color }, i) => (
              <motion.div key={title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 + 0.1 }}
                className="p-5 rounded-2xl group cursor-default transition-all hover:border-white/10"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-4 transition-colors"
                  style={{ background: `${color}18` }}>
                  <Icon className="w-4 h-4" style={{ color }} />
                </div>
                <h3 className="text-[15px] font-semibold text-white mb-1.5 leading-tight">{title}</h3>
                <p className="text-[13px] text-white/38 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Testimonials ── */}
        <section className="pb-14 space-y-8" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="pt-10">
            <h2 className="text-[13px] font-semibold text-white/40 tracking-[0.18em] uppercase">From the city</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {TESTIMONIALS.map((t, i) => (
              <motion.div key={t.handle}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 + 0.1 }}
                className="p-5 rounded-2xl flex flex-col gap-5"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <p className="text-[14px] text-white/60 leading-relaxed flex-1">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold text-white shrink-0"
                    style={{ background: "linear-gradient(135deg,#7c5cfc,#f0365a)" }}>
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-white/80">{t.name}</div>
                    <div className="text-[11px] text-white/28">{t.handle}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── CTA + Footer ── */}
        <section className="pb-14 space-y-0" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="py-16 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="space-y-3">
              <h2 className="display text-[clamp(48px,7vw,80px)] text-white leading-none tracking-wide">
                YOUR NIGHT<br />
                <span style={{ WebkitTextStroke: "1px rgba(255,255,255,0.18)", color: "transparent" }}>STARTS HERE</span>
              </h2>
              <p className="text-[15px] text-white/35 max-w-sm font-light">Join the city. Every night has a story.</p>
            </div>
            <div className="flex flex-col gap-3">
              <Link href={user ? "/discover" : "/signup"}>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2.5 px-8 py-4 rounded-xl text-[15px] font-semibold text-white"
                  style={{ background: "#7c5cfc", boxShadow: "0 0 0 1px rgba(124,92,252,0.3), 0 8px 32px rgba(124,92,252,0.25)" }}>
                  {user ? "Open the App" : "Enter the Night"} <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
              {!user && (
                <p className="text-[12px] text-white/22 text-center">Free forever · No credit card</p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between py-6" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-lg flex items-center justify-center text-white font-bold text-[10px]"
                style={{ background: "linear-gradient(135deg,#7c5cfc,#00d4ff)" }}>NL</div>
              <span className="text-[13px] text-white/35 font-medium">Nightlog</span>
            </div>
            <div className="flex items-center gap-6 text-[12px] text-white/22">
              <Link href="/discover"><span className="hover:text-white/45 transition-colors cursor-pointer">Discover</span></Link>
              <Link href="/memories"><span className="hover:text-white/45 transition-colors cursor-pointer">Archive</span></Link>
              <Link href="/profile"><span className="hover:text-white/45 transition-colors cursor-pointer">Profile</span></Link>
            </div>
            <span className="text-[11px] text-white/18">© 2025 Nightlog</span>
          </div>
        </section>
      </div>
    </Layout>
  );
}
