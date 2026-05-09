import { Layout } from "@/components/layout";
import { useListMemories } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Sparkles, Play, Clock, Flame } from "lucide-react";

export default function Memories() {
  const { data: memories, isLoading } = useListMemories();

  return (
    <Layout>
      <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8">
        <header className="space-y-4 pt-8">
          <h1 className="text-4xl font-display font-bold glow-text">Memory Archive</h1>
          <p className="text-muted-foreground text-lg">Cinematic replays of your greatest nights.</p>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            [1, 2, 3].map(i => <div key={i} className="h-64 rounded-[2rem] glass-card animate-pulse" />)
          ) : (
            memories?.map((memory, i) => (
              <motion.div
                key={memory.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <Link href={`/memories/${memory.id}`}>
                  <div className="group relative h-64 rounded-[2rem] glass-card overflow-hidden border border-white/5 hover:border-primary/40 transition-all duration-500 hover:shadow-[0_0_30px_rgba(139,111,255,0.15)] flex flex-col justify-between p-6">
                    <div className="flex justify-between items-start">
                      <div className="w-12 h-12 rounded-full glass-card border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform bg-white/5">
                        <Play className="w-5 h-5 text-primary ml-1" />
                      </div>
                      <div className="text-xs text-white/50 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                        {memory.night_date}
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-2xl font-display font-bold group-hover:glow-text transition-all">{memory.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-white/60">
                        <div className="flex items-center gap-1.5 text-secondary">
                          <Flame className="w-4 h-4" />
                          <span>{memory.energy_score}% Vibe</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4" />
                          <span>{memory.moments_count} Moments</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}