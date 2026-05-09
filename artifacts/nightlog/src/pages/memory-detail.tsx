import { Layout } from "@/components/layout";
import { useGetMemory } from "@workspace/api-client-react";
import { useRoute } from "wouter";
import { motion } from "framer-motion";
import { Play, Pause, FastForward, Clock } from "lucide-react";
import { useState, useEffect } from "react";

export default function MemoryDetail() {
  const [match, params] = useRoute("/memories/:id");
  const memoryId = params?.id ? parseInt(params.id) : 0;
  
  const { data: memory, isLoading } = useGetMemory(memoryId, { query: { enabled: !!memoryId, queryKey: ["memory", memoryId] } });
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            setIsPlaying(false);
            return 100;
          }
          return p + 0.5;
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  if (isLoading || !memory) return <Layout><div className="h-screen flex items-center justify-center"><div className="w-8 h-8 rounded-full border-t-2 border-primary animate-spin" /></div></Layout>;

  return (
    <Layout>
      <div className="min-h-screen flex flex-col relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "1s" }} />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-4 max-w-4xl mx-auto w-full relative z-10 space-y-12 py-12">
          
          <div className="text-center space-y-4">
            <h1 className="text-5xl md:text-7xl font-display font-bold glow-text bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70">{memory.title}</h1>
            <p className="text-xl text-white/50">{memory.night_date}</p>
          </div>

          {/* Timeline Visualizer */}
          <div className="w-full space-y-8">
             <div className="relative">
                <div className="h-4 w-full glass-card rounded-full overflow-hidden border border-white/10 relative">
                  {/* Waveform fake */}
                  <div className="absolute inset-0 flex items-end gap-1 px-1 opacity-20">
                     {[...Array(50)].map((_, i) => (
                       <div key={i} className="flex-1 bg-white rounded-t-sm" style={{ height: `${Math.random() * 80 + 20}%` }} />
                     ))}
                  </div>
                  <motion.div 
                    className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-primary to-secondary shadow-[0_0_20px_rgba(139,111,255,0.8)]"
                    style={{ width: `${progress}%` }}
                  />
                </div>
             </div>
             
             {/* Playback Controls */}
             <div className="flex items-center justify-center gap-6">
                <button 
                  onClick={() => setProgress(0)}
                  className="w-12 h-12 rounded-full glass-card flex items-center justify-center text-white/70 hover:text-white transition-colors"
                >
                  <Clock className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => {
                     if (progress >= 100) setProgress(0);
                     setIsPlaying(!isPlaying);
                  }}
                  className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-white shadow-[0_0_30px_rgba(139,111,255,0.4)] hover:scale-105 transition-all"
                >
                  {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-2" />}
                </button>
                <button 
                  onClick={() => setProgress(p => Math.min(100, p + 10))}
                  className="w-12 h-12 rounded-full glass-card flex items-center justify-center text-white/70 hover:text-white transition-colors"
                >
                  <FastForward className="w-5 h-5" />
                </button>
             </div>
          </div>

          <div className="w-full space-y-6">
             <h3 className="text-xl font-display font-bold text-center text-white/80">Moments</h3>
             <div className="space-y-4">
                {memory.timeline?.map((item, i) => (
                  <motion.div 
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 + 0.5 }}
                    className="glass-card p-6 rounded-2xl border-white/5 flex gap-6 items-center"
                  >
                     <div className="font-mono text-primary font-bold">{item.time}</div>
                     <div>
                        <h4 className="font-bold text-lg">{item.label}</h4>
                        <p className="text-white/60">{item.description}</p>
                     </div>
                  </motion.div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}