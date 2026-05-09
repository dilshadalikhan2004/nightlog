import { Layout } from "@/components/layout";
import { useGetMemory } from "@workspace/api-client-react";
import { useRoute } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, FastForward, RotateCcw, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "wouter";

const WAVEFORM = [28,55,40,72,33,68,45,88,60,42,76,30,84,55,44,70,38,82,52,36,78,48,65,34,90,58,42,74,50,38,80,62,46,86,54,40,76,32,68,48];

export default function MemoryDetail() {
  const [, params] = useRoute("/memories/:id");
  const memoryId = params?.id ? parseInt(params.id) : 0;

  const { data: memory, isLoading } = useGetMemory(memoryId, { query: { enabled: !!memoryId, queryKey: ["memory", memoryId] } });
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(p => {
          if (p >= 100) { setIsPlaying(false); return 100; }
          return p + 0.4;
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const playedIndex = Math.floor((progress / 100) * WAVEFORM.length);

  if (isLoading || !memory) return (
    <Layout><div className="h-screen flex items-center justify-center"><div className="w-6 h-6 rounded-full border-t-2 border-primary animate-spin" /></div></Layout>
  );

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-6 lg:px-10 py-10 lg:py-14 space-y-10 pb-16">

        {/* Back */}
        <Link href="/memories">
          <button className="flex items-center gap-2 text-[13px] text-white/35 hover:text-white/65 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Archive
          </button>
        </Link>

        {/* Title */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <h1 className="display text-[clamp(56px,9vw,100px)] text-white leading-none tracking-wide">{memory.title}</h1>
          <div className="flex items-center gap-4">
            <span className="text-[14px] text-white/35 font-light">{memory.night_date}</span>
            <span className="font-mono text-[13px] text-[#00d4ff]">{memory.energy_score}% energy</span>
            <span className="text-[13px] text-white/25">{memory.moments_count} moments</span>
          </div>
        </motion.div>

        {/* Waveform player */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="p-6 rounded-2xl space-y-6" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>

          {/* Waveform */}
          <div className="relative h-24 flex items-end gap-[3px] cursor-pointer group"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const pct = ((e.clientX - rect.left) / rect.width) * 100;
              setProgress(Math.max(0, Math.min(100, pct)));
            }}>
            {WAVEFORM.map((h, i) => {
              const played = i < playedIndex;
              return (
                <div key={i} className="flex-1 rounded-t-[1px] transition-all duration-150"
                  style={{
                    height: `${h}%`,
                    background: played
                      ? "linear-gradient(to top, #7c5cfc, #00d4ff)"
                      : "rgba(255,255,255,0.12)",
                    transform: isPlaying && Math.abs(i - playedIndex) <= 2 ? `scaleY(${1 + Math.random() * 0.25})` : "scaleY(1)",
                    transformOrigin: "bottom",
                  }} />
              );
            })}

            {/* Playhead */}
            <div className="absolute bottom-0 top-0 w-0.5 bg-white/70 rounded-full transition-all duration-75"
              style={{ left: `${progress}%`, boxShadow: "0 0 8px rgba(255,255,255,0.4)" }} />
          </div>

          {/* Progress bar */}
          <div className="energy-bar">
            <motion.div className="energy-bar-fill" style={{ width: `${progress}%` }} />
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-5">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => setProgress(0)}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white/40 hover:text-white transition-colors"
              style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
              <RotateCcw className="w-4 h-4" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => { if (progress >= 100) setProgress(0); setIsPlaying(!isPlaying); }}
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-white"
              style={{ background: "#7c5cfc", boxShadow: "0 0 0 1px rgba(124,92,252,0.3), 0 8px 24px rgba(124,92,252,0.3)" }}>
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
            </motion.button>

            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => setProgress(p => Math.min(100, p + 10))}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white/40 hover:text-white transition-colors"
              style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
              <FastForward className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>

        {/* Timeline moments */}
        {memory.timeline && memory.timeline.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-[13px] font-semibold tracking-[0.18em] uppercase text-white/30 mb-5">Moments</h2>
            {memory.timeline.map((item, i) => {
              const itemProgress = (i / memory.timeline!.length) * 100;
              const isPast = progress >= itemProgress;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 + 0.2 }}
                  className="flex items-start gap-5 py-4 transition-all duration-300"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", opacity: isPast ? 1 : 0.4 }}
                >
                  <div className="font-mono text-[13px] shrink-0 mt-0.5 w-14"
                    style={{ color: isPast ? "#7c5cfc" : "rgba(255,255,255,0.3)" }}>
                    {item.time}
                  </div>
                  <div className="space-y-0.5 flex-1">
                    <h4 className="text-[15px] font-semibold text-white leading-tight">{item.label}</h4>
                    <p className="text-[13px] text-white/40 leading-relaxed">{item.description}</p>
                  </div>
                  {isPast && (
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                  )}
                </motion.div>
              );
            })}
          </section>
        )}
      </div>
    </Layout>
  );
}
