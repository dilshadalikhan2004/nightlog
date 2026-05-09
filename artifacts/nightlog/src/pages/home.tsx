import { Layout } from "@/components/layout";
import { useGetFeedStats, useGetTrendingEvents, useGetRecentActivity } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { ArrowRight, Flame, TrendingUp } from "lucide-react";
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
  }, [target]);
  return val;
}

const STAT_ITEMS = [
  { key: "live_events" as const, label: "Live Events", suffix: "" },
  { key: "people_out" as const, label: "Out Tonight", suffix: "" },
  { key: "avg_energy" as const, label: "City Energy", suffix: "%" },
  { key: "memories_tonight" as const, label: "Memories", suffix: "" },
];

function StatItem({ label, value, suffix }: { label: string; value: number | undefined; suffix: string }) {
  const animated = useCountUp(value);
  return (
    <div className="flex flex-col gap-1 px-8 py-5 border-r border-white/6 last:border-r-0 first:pl-0 last:pr-0">
      <span className="text-[11px] font-medium tracking-widest text-white/30 uppercase">{label}</span>
      <span className="text-3xl font-semibold tracking-tight tabular-nums text-white">
        {value !== undefined ? `${animated}${suffix}` : <span className="text-white/20 animate-pulse text-xl">—</span>}
      </span>
    </div>
  );
}

export default function Home() {
  const { data: stats } = useGetFeedStats();
  const { data: trending } = useGetTrendingEvents();
  const { data: activity } = useGetRecentActivity();

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-6 lg:px-10">

        {/* ── Hero ── */}
        <section className="pt-16 pb-20 lg:pt-24">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8 max-w-4xl"
          >
            <div className="flex items-center gap-2.5">
              <span className="live-dot bg-[#00d4ff]" />
              <span className="text-[13px] text-white/40 tracking-wide">
                {stats ? `${stats.people_out} people in the city tonight` : "Live now"}
              </span>
            </div>

            <h1 className="display text-[clamp(80px,14vw,160px)] text-white leading-none tracking-wide">
              Nights<br />
              <span style={{ WebkitTextStroke: "1px rgba(255,255,255,0.2)", color: "transparent" }}>Turned</span><br />
              Cinema
            </h1>

            <p className="text-[17px] text-white/40 max-w-md leading-relaxed font-light">
              Step into the pulse. Discover events, replay memories, feel the energy of the city around you.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link href="/discover">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2.5 px-7 py-3.5 rounded-xl text-[14px] font-semibold text-white transition-all"
                  style={{ background: "#7c5cfc", boxShadow: "0 0 0 1px rgba(124,92,252,0.3), 0 8px 24px rgba(124,92,252,0.25)" }}
                >
                  Discover Tonight <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
              <Link href="/memories">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2.5 px-7 py-3.5 rounded-xl text-[14px] font-medium text-white/60 hover:text-white/80 transition-colors"
                  style={{ border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  Replay Memories
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </section>

        {/* ── Stat strip ── */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap"
          >
            {STAT_ITEMS.map(({ key, label, suffix }) => (
              <StatItem key={key} label={label} value={stats?.[key]} suffix={suffix} />
            ))}
          </motion.div>
        </div>

        {/* ── Trending Tonight ── */}
        <section className="py-16 space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-4 h-4 text-white/30" />
              <h2 className="text-[15px] font-semibold text-white/70 tracking-tight">Trending Tonight</h2>
            </div>
            <Link href="/discover">
              <span className="text-[13px] text-white/30 hover:text-white/60 transition-colors flex items-center gap-1">
                See all <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {trending?.map((event, i) => (
              <Link key={event.id} href={`/event/${event.id}`}>
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 + 0.2, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -3, transition: { duration: 0.2 } }}
                  className="relative rounded-2xl overflow-hidden cursor-pointer group"
                  style={{ height: i === 0 ? 320 : 240 }}
                >
                  {/* Full-bleed gradient */}
                  <div className="absolute inset-0" style={{ background: event.color_theme }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                  {/* Hover shimmer */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 60%)" }} />

                  {/* Energy */}
                  <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono font-medium text-white"
                    style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.1)" }}>
                    <Flame className="w-3 h-3" /> {event.energy_score}%
                  </div>

                  {/* Text */}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <p className="text-[10px] font-medium tracking-widest text-white/50 uppercase mb-1">{event.type}</p>
                    <h3 className="text-xl font-semibold text-white tracking-tight leading-tight">{event.title}</h3>
                    <p className="text-[13px] text-white/50 mt-1">{event.venue}</p>
                  </div>
                </motion.div>
              </Link>
            ))}
            {!trending && [1, 2, 3].map(i => (
              <div key={i} className="rounded-2xl animate-pulse h-60" style={{ background: "rgba(255,255,255,0.04)" }} />
            ))}
          </div>
        </section>

        {/* ── Recent Activity ── */}
        {activity && activity.length > 0 && (
          <section className="pb-16 space-y-6">
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }} className="pt-10">
              <h2 className="text-[15px] font-semibold text-white/50 tracking-tight">Recent Activity</h2>
            </div>
            <div className="space-y-0">
              {activity.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 + 0.3 }}
                  className="flex items-center gap-5 py-4 border-b border-white/5 group hover:bg-white/2 -mx-2 px-2 rounded-lg transition-colors"
                >
                  <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center text-xs ${
                    item.type === "event" ? "bg-primary/15 text-primary" : "bg-secondary/10 text-secondary"
                  }`}>
                    {item.type === "event" ? <Flame className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[14px] text-white/70 font-medium">{item.label}</span>
                    <span className="text-[13px] text-white/30 ml-2">{item.description}</span>
                  </div>
                  <span className="text-[12px] text-white/25 shrink-0 font-mono">{item.timestamp}</span>
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
}

function Sparkles({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5z"/>
    </svg>
  );
}
