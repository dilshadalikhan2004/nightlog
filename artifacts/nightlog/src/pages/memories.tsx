import { Layout } from "@/components/layout";
import { useListMemories } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Play } from "lucide-react";

export default function Memories() {
  const { data: memories, isLoading } = useListMemories();

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-10 lg:py-14 space-y-8">

        <div className="space-y-1">
          <h1 className="display text-[72px] text-white leading-none tracking-wide">Archive</h1>
          <p className="text-[14px] text-white/30 font-light">Cinematic replays of your greatest nights</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading
            ? [1, 2, 3, 4].map(i => <div key={i} className="h-56 rounded-2xl animate-pulse" style={{ background: "rgba(255,255,255,0.04)" }} />)
            : memories?.map((memory, i) => (
              <motion.div
                key={memory.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link href={`/memories/${memory.id}`}>
                  <div className="group relative rounded-2xl overflow-hidden cursor-pointer" style={{ height: 220 }}>

                    {/* Waveform bg */}
                    <div className="absolute inset-0 flex items-end gap-[2px] px-3 pb-3 opacity-20">
                      {[...Array(40)].map((_, j) => {
                        const heights = [30, 60, 45, 80, 55, 70, 40, 90, 65, 50, 75, 35, 85, 60, 45];
                        const h = heights[j % heights.length];
                        return <div key={j} className="flex-1 rounded-t-[1px]"
                          style={{ height: `${h}%`, background: "linear-gradient(to top, #7c5cfc, #00d4ff)" }} />;
                      })}
                    </div>

                    {/* Bg overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />

                    {/* Hover overlay */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                      style={{ background: "rgba(124,92,252,0.08)" }} />

                    {/* Top */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"
                        style={{ background: "rgba(124,92,252,0.2)", border: "1px solid rgba(124,92,252,0.3)" }}>
                        <Play className="w-3.5 h-3.5 text-primary ml-0.5" />
                      </div>
                      <span className="text-[10px] font-medium text-white/35 tracking-widest uppercase px-2.5 py-1 rounded-lg"
                        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.06)" }}>
                        {memory.night_date}
                      </span>
                    </div>

                    {/* Bottom */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-[18px] font-semibold text-white tracking-tight leading-tight mb-2">{memory.title}</h3>
                      <div className="flex items-center gap-4 text-[12px]">
                        <span className="text-[#00d4ff] font-mono">{memory.energy_score}%</span>
                        <span className="text-white/35">{memory.moments_count} moments</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          }
        </div>
      </div>
    </Layout>
  );
}
