import { Layout } from "@/components/layout";
import { useGetFeedStats, useGetTrendingEvents, useGetRecentActivity } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Activity, Flame, Users, Sparkles, ArrowRight, Clock } from "lucide-react";
import { Link } from "wouter";
import { useEffect, useState, useRef } from "react";

function useAnimatedNumber(target: number | undefined, duration = 1200) {
  const [value, setValue] = useState(0);
  const raf = useRef<number | null>(null);
  useEffect(() => {
    if (target === undefined) return;
    const start = performance.now();
    const from = 0;
    const animate = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(from + (target - from) * ease));
      if (t < 1) raf.current = requestAnimationFrame(animate);
    };
    raf.current = requestAnimationFrame(animate);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [target, duration]);
  return value;
}

function StatCard({ icon: Icon, label, value, suffix = "", color, delay }: {
  icon: any; label: string; value: number | undefined; suffix?: string; color: string; delay: number;
}) {
  const animated = useAnimatedNumber(value);
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="glass-card p-6 rounded-3xl border border-white/5 hover:border-white/10 transition-all group relative overflow-hidden"
    >
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity ${color} bg-current`} />
      <Icon className={`w-5 h-5 ${color} mb-5 opacity-80`} />
      <div className="text-3xl font-display font-bold tabular-nums">
        {value !== undefined ? `${animated}${suffix}` : <span className="animate-pulse text-white/20">···</span>}
      </div>
      <div className="text-sm text-white/40 mt-1.5 font-medium">{label}</div>
    </motion.div>
  );
}

export default function Home() {
  const { data: stats } = useGetFeedStats();
  const { data: trending } = useGetTrendingEvents();
  const { data: activity } = useGetRecentActivity();

  return (
    <Layout>
      <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-14">

        {/* Hero */}
        <section className="relative pt-12 pb-24 overflow-hidden rounded-[2.5rem] border border-white/5"
          style={{ background: "rgba(255,255,255,0.03)", backdropFilter: "blur(20px)" }}>
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none"
            style={{ background: "radial-gradient(circle,rgba(139,111,255,0.25),transparent 70%)" }} />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[120px] pointer-events-none"
            style={{ background: "radial-gradient(circle,rgba(0,212,255,0.15),transparent 70%)" }} />

          <div className="relative z-10 px-8 lg:px-16 grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary" />
                </span>
                <span className="text-white/70">
                  {stats ? `${stats.people_out} people out tonight` : "Tonight is alive"}
                </span>
              </div>

              <h1 className="text-6xl lg:text-7xl xl:text-8xl font-display font-bold leading-[0.9] tracking-tight">
                <span className="text-white">Nights</span><br />
                <span className="text-white">turned into</span><br />
                <span style={{ background: "linear-gradient(135deg,#8b6fff,#00d4ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  cinema.
                </span>
              </h1>

              <p className="text-lg text-white/50 max-w-md leading-relaxed">
                Step into the pulse. Discover underground rooms, share cinematic memories, and feel the energy of the city.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link href="/discover">
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-primary text-white font-semibold cursor-pointer"
                    style={{ boxShadow: "0 0 30px rgba(139,111,255,0.4)" }}>
                    Enter the Night <Flame className="w-4 h-4" />
                  </motion.div>
                </Link>
                <Link href="/memories">
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full border border-white/10 bg-white/5 text-white/80 font-semibold cursor-pointer hover:bg-white/8 transition-colors">
                    Replay Memories
                  </motion.div>
                </Link>
              </div>
            </motion.div>

            {/* Hero visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.15 }}
              className="hidden lg:block relative h-[480px]"
            >
              <div className="absolute inset-0 rounded-[2.5rem] blur-2xl opacity-40"
                style={{ background: "linear-gradient(135deg,rgba(139,111,255,0.4),rgba(0,212,255,0.3))" }} />
              <div className="relative h-full rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl p-4 flex flex-col gap-3"
                style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(30px)" }}>

                {/* Mock event card */}
                <div className="flex-1 rounded-2xl relative overflow-hidden border border-white/5"
                  style={{ background: "linear-gradient(135deg,#8b6fff,#ff4d9a)" }}>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1.5 text-xs font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> LIVE · {stats?.avg_energy ?? 94}%
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <h3 className="font-display font-bold text-xl" style={{ textShadow: "0 0 20px rgba(255,255,255,0.4)" }}>Neon Afterlife</h3>
                    <p className="text-sm text-white/60 mt-1">Skyline Rooftop · {stats?.people_out ?? 247} attending</p>
                  </div>
                </div>

                {/* Activity items */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Vault 09", sub: "Underground", color: "linear-gradient(135deg,#8b6fff,#00d4ff)" },
                    { label: "Midnight Echo", sub: "AI Replay", color: "linear-gradient(135deg,#ff4d9a,#f6d67d)" },
                  ].map((item) => (
                    <div key={item.label} className="rounded-xl border border-white/5 p-3 flex items-center gap-3"
                      style={{ background: "rgba(255,255,255,0.04)" }}>
                      <div className="w-8 h-8 rounded-xl shrink-0" style={{ background: item.color }} />
                      <div>
                        <div className="text-sm font-bold">{item.label}</div>
                        <div className="text-xs text-white/40">{item.sub}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Live Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Activity} label="Live Events" value={stats?.live_events} color="text-secondary" delay={0.1} />
          <StatCard icon={Users} label="People Out" value={stats?.people_out} color="text-primary" delay={0.15} />
          <StatCard icon={Flame} label="City Energy" value={stats?.avg_energy} suffix="%" color="text-[#ff4d9a]" delay={0.2} />
          <StatCard icon={Sparkles} label="Memories Tonight" value={stats?.memories_tonight} color="text-yellow-400" delay={0.25} />
        </div>

        {/* Trending Tonight */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-display font-bold">Trending Tonight</h2>
            <Link href="/discover" className="flex items-center gap-1.5 text-sm text-primary/70 hover:text-primary transition-colors font-medium">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {trending?.map((event, i) => (
              <Link key={event.id} href={`/event/${event.id}`}>
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 + 0.3 }}
                  whileHover={{ y: -4 }}
                  className="group relative h-64 rounded-[2rem] overflow-hidden border border-white/5 cursor-pointer"
                  style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.4)" }}
                >
                  <div className="absolute inset-0" style={{ background: event.color_theme }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1.5 text-xs font-bold">
                    <Flame className="w-3 h-3 text-secondary" /> {event.energy_score}%
                  </div>

                  <div className="absolute inset-0 p-5 flex flex-col justify-end">
                    <p className="text-xs font-bold tracking-widest text-white/50 uppercase mb-1">{event.type}</p>
                    <h3 className="text-xl font-display font-bold" style={{ textShadow: "0 0 20px rgba(255,255,255,0.3)" }}>
                      {event.title}
                    </h3>
                    <p className="text-sm text-white/50 mt-1">{event.venue} · {event.attendee_count} going</p>
                  </div>
                </motion.div>
              </Link>
            ))}
            {!trending && [1, 2, 3].map(i => (
              <div key={i} className="h-64 rounded-[2rem] animate-pulse" style={{ background: "rgba(255,255,255,0.04)" }} />
            ))}
          </div>
        </section>

        {/* Recent Activity */}
        {activity && activity.length > 0 && (
          <section className="space-y-5">
            <h2 className="text-2xl font-display font-bold">Recent Activity</h2>
            <div className="space-y-3">
              {activity.map((item, i) => (
                <motion.div key={item.id}
                  initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 + 0.4 }}
                  className="glass-card rounded-2xl p-5 border border-white/5 flex items-center gap-5 hover:border-white/10 transition-all"
                >
                  <div className={`w-10 h-10 rounded-2xl shrink-0 flex items-center justify-center ${
                    item.type === "event" ? "bg-primary/15" : "bg-secondary/15"
                  }`}>
                    {item.type === "event"
                      ? <Flame className="w-5 h-5 text-primary" />
                      : <Sparkles className="w-5 h-5 text-secondary" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm truncate">{item.label}</div>
                    <div className="text-xs text-white/40 truncate">{item.description}</div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-white/25 shrink-0">
                    <Clock className="w-3 h-3" /> {item.timestamp}
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
}
