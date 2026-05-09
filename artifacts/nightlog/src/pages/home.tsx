import { Layout } from "@/components/layout";
import { useGetFeedStats, useGetTrendingEvents } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { ArrowRight, Flame, Sparkles, TrendingUp, MapPin, Users, Camera, Waves, Send } from "lucide-react";
import { Link } from "wouter";
import { useEffect, useRef, useState } from "react";

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
    <div className="flex flex-col gap-1 px-7 py-5 border-r border-white/6 last:border-r-0 first:pl-0 last:pr-0 min-w-[160px]">
      <span className="text-[11px] font-medium tracking-[0.22em] text-white/30 uppercase">{label}</span>
      <span className="text-3xl font-semibold tracking-tight tabular-nums text-white">
        {value !== undefined ? `${animated}${suffix}` : <span className="text-white/20 animate-pulse text-xl">—</span>}
      </span>
    </div>
  );
}

export default function Home() {
  const { data: stats } = useGetFeedStats();
  const { data: trending } = useGetTrendingEvents();

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10 lg:py-14 space-y-10">
        <section className="relative overflow-hidden rounded-[28px] border border-white/8 p-6 lg:p-10" style={{ background: "rgba(255,255,255,0.03)" }}>
          <div className="absolute inset-0 opacity-60 pointer-events-none" style={{ background: "radial-gradient(circle at 20% 20%, rgba(124,92,252,0.18), transparent 30%), radial-gradient(circle at 80% 20%, rgba(0,212,255,0.12), transparent 24%), radial-gradient(circle at 50% 90%, rgba(240,54,90,0.08), transparent 30%)" }} />
          <div className="relative grid lg:grid-cols-[1.1fr_.9fr] gap-10 items-center">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75 }} className="space-y-7">
              <div className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-full border border-white/8 bg-white/4">
                <span className="live-dot bg-[#00d4ff]" />
                <span className="text-[13px] text-white/50">{stats ? `${stats.people_out} people out tonight` : "Live now"}</span>
              </div>

              <div className="space-y-2">
                <h1 className="display text-[clamp(64px,10vw,132px)] text-white leading-[0.88] tracking-wide">
                  NIGHTS<br />
                  <span style={{ WebkitTextStroke: "1px rgba(255,255,255,0.20)", color: "transparent" }}>TURNED</span><br />
                  CINEMA
                </h1>
                <p className="max-w-xl text-[17px] text-white/45 leading-relaxed font-light">
                  A cinematic nightlife platform for discovering events, replaying memories, and moving through the city with live energy.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Link href="/discover">
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-[14px] font-semibold text-white" style={{ background: "#7c5cfc", boxShadow: "0 0 0 1px rgba(124,92,252,0.3), 0 8px 24px rgba(124,92,252,0.25)" }}>
                    Explore the city <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </Link>
                <Link href="/memories">
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-[14px] font-medium text-white/65 hover:text-white transition-colors" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
                    Replay memories
                  </motion.button>
                </Link>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.15 }} className="relative">
              <div className="absolute inset-0 rounded-[28px] blur-3xl opacity-60" style={{ background: "linear-gradient(135deg, rgba(124,92,252,0.30), rgba(0,212,255,0.16))" }} />
              <div className="relative rounded-[28px] p-5 border border-white/8" style={{ background: "rgba(255,255,255,0.04)" }}>
                <div className="aspect-[4/5] rounded-[24px] overflow-hidden relative border border-white/6" style={{ background: "linear-gradient(135deg,#7c5cfc,#f0365a 50%,#00d4ff)" }}>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.24),transparent_28%),radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.16),transparent_18%),radial-gradient(circle_at_50%_80%,rgba(0,0,0,0.24),transparent_35%)]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full text-[11px] font-semibold text-white flex items-center gap-1.5" style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(10px)" }}>
                    <span className="live-dot bg-[#00d4ff]" /> LIVE · {stats?.avg_energy ?? 91}%
                  </div>
                  <div className="absolute bottom-5 left-5 right-5 space-y-4">
                    <div>
                      <p className="text-[10px] tracking-[0.22em] text-white/55 uppercase">Tonight’s peak</p>
                      <h2 className="text-2xl font-semibold text-white mt-1">Neon Afterlife</h2>
                      <p className="text-[13px] text-white/55 mt-1">Skyline Rooftop · {stats?.people_out ?? 247} attending</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <MiniCard icon={Waves} title="Energy" subtitle="Heat across the city" />
                      <MiniCard icon={Camera} title="Moments" subtitle="Live replays tonight" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section style={{ borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex flex-wrap">
            <StatItem label="Live Events" value={stats?.live_events} suffix="" />
            <StatItem label="Out Tonight" value={stats?.people_out} suffix="" />
            <StatItem label="City Energy" value={stats?.avg_energy} suffix="%" />
            <StatItem label="Memories" value={stats?.memories_tonight} suffix="" />
          </div>
        </section>

        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <TrendingUp className="w-4 h-4 text-white/30" />
              <h2 className="text-[14px] font-semibold text-white/60 tracking-[0.14em] uppercase">Trending Tonight</h2>
            </div>
            <Link href="/discover"><span className="text-[13px] text-white/30 hover:text-white/55 transition-colors flex items-center gap-1">View all <ArrowRight className="w-3.5 h-3.5" /></span></Link>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {trending?.map((event, i) => (
              <Link key={event.id} href={`/event/${event.id}`}>
                <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} whileHover={{ y: -3 }} className="relative rounded-[24px] overflow-hidden" style={{ height: i === 0 ? 330 : 250 }}>
                  <div className="absolute inset-0" style={{ background: event.color_theme }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.08), transparent 55%)" }} />
                  <div className="absolute top-4 right-4 px-2.5 py-1 rounded-lg text-[11px] font-mono text-white flex items-center gap-1.5" style={{ background: "rgba(0,0,0,0.42)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <Flame className="w-3 h-3" /> {event.energy_score}%
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <p className="text-[10px] font-medium tracking-[0.22em] uppercase text-white/50 mb-1">{event.type}</p>
                    <h3 className="text-[22px] font-semibold text-white leading-tight">{event.title}</h3>
                    <p className="text-[13px] text-white/55 mt-1">{event.venue} · {event.attendee_count} going</p>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </section>

        <section className="grid lg:grid-cols-[1fr_.8fr] gap-5 pb-8">
          <div className="rounded-[24px] p-6 border border-white/8" style={{ background: "rgba(255,255,255,0.035)" }}>
            <div className="flex items-center gap-2.5 mb-5">
              <Send className="w-4 h-4 text-white/30" />
              <h2 className="text-[14px] font-semibold text-white/60 tracking-[0.14em] uppercase">What Nightlog does</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                [Flame, "Live energy", "See what’s hot right now across the city."],
                [Sparkles, "Memory replay", "Turn nights into cinematic timelines."],
                [MapPin, "Discover places", "Find venues, rooms, rooftops and afterhours."],
                [Users, "Invite circles", "Build your crew and move together."],
              ].map(([Icon, title, desc]) => (
                <div key={title as string} className="rounded-2xl p-4 border border-white/6" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: "rgba(124,92,252,0.12)" }}>
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-[16px] font-semibold text-white mb-1">{title as string}</h3>
                  <p className="text-[13px] text-white/40 leading-relaxed">{desc as string}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[24px] p-6 border border-white/8" style={{ background: "rgba(255,255,255,0.035)" }}>
            <h2 className="text-[14px] font-semibold text-white/60 tracking-[0.14em] uppercase mb-5">Why it feels premium</h2>
            <div className="space-y-4">
              {[
                "Editorial typography and restrained layout rhythm.",
                "Full-bleed gradients, glass, and live energy cues.",
                "Minimal chrome with clear hierarchy and action.",
                "Motion that feels like a trailer, not a template.",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                  <p className="text-[14px] text-white/50 leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}

function MiniCard({ icon: Icon, title, subtitle }: { icon: any; title: string; subtitle: string }) {
  return (
    <div className="rounded-2xl p-3 border border-white/10" style={{ background: "rgba(0,0,0,0.24)", backdropFilter: "blur(10px)" }}>
      <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-3" style={{ background: "rgba(255,255,255,0.08)" }}>
        <Icon className="w-4 h-4 text-white" />
      </div>
      <div className="text-[13px] font-semibold text-white">{title}</div>
      <div className="text-[11px] text-white/55 mt-0.5 leading-tight">{subtitle}</div>
    </div>
  );
}