import { Layout } from "@/components/layout";
import { useGetFeedStats, useGetTrendingEvents, useGetRecentActivity } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Activity, Flame, Users, Sparkles } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { data: stats } = useGetFeedStats();
  const { data: trending } = useGetTrendingEvents();
  const { data: activity } = useGetRecentActivity();

  return (
    <Layout>
      <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-12">
        {/* Hero Section */}
        <section className="relative pt-12 pb-24 overflow-hidden rounded-[2.5rem] glass-card border-white/5">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/20 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />
          
          <div className="relative z-10 px-8 lg:px-16 grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm font-medium border-white/10">
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                <span className="text-secondary/90">Tonight is alive</span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-display font-bold leading-tight glow-text text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/40">
                Nights turned into cinema.
              </h1>
              <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
                Step into the pulse. Discover underground rooms, share cinematic memories, and feel the energy of the city.
              </p>
              <Link href="/discover" className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-primary text-white font-medium hover:bg-primary/90 transition-all shadow-[0_0_30px_rgba(139,111,255,0.4)] hover:shadow-[0_0_40px_rgba(139,111,255,0.6)]">
                Enter the Night <Flame className="w-5 h-5" />
              </Link>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative hidden lg:block h-[500px]"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-secondary/30 rounded-[3rem] blur-3xl opacity-50 animate-pulse" />
              <div className="relative h-full w-full rounded-[3rem] glass-card border-white/10 overflow-hidden shadow-2xl p-4 flex flex-col gap-4">
                 <div className="h-1/2 rounded-2xl bg-gradient-to-br from-purple-900/40 to-black relative overflow-hidden border border-white/5">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=1000')] bg-cover bg-center opacity-30 mix-blend-luminosity"></div>
                    <div className="absolute bottom-4 left-4">
                       <h3 className="font-display font-bold text-xl glow-text">Neon Room</h3>
                       <p className="text-sm text-white/60">Live now • 94% Energy</p>
                    </div>
                 </div>
                 <div className="flex-1 rounded-2xl glass-card p-4 border-white/5">
                    <div className="flex items-center gap-3 mb-4">
                       <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center"><Sparkles className="w-4 h-4 text-secondary" /></div>
                       <span className="font-medium text-sm">Aesthetic Memory</span>
                    </div>
                    <div className="space-y-2">
                       <div className="h-2 w-3/4 bg-white/10 rounded-full" />
                       <div className="h-2 w-1/2 bg-white/10 rounded-full" />
                    </div>
                 </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-card p-6 rounded-3xl border-white/5 space-y-2">
            <Activity className="w-6 h-6 text-secondary mb-4" />
            <div className="text-3xl font-display font-bold">{stats?.live_events || "..."}</div>
            <div className="text-sm text-muted-foreground">Live Events</div>
          </div>
          <div className="glass-card p-6 rounded-3xl border-white/5 space-y-2">
            <Users className="w-6 h-6 text-primary mb-4" />
            <div className="text-3xl font-display font-bold">{stats?.people_out || "..."}</div>
            <div className="text-sm text-muted-foreground">People Out</div>
          </div>
          <div className="glass-card p-6 rounded-3xl border-white/5 space-y-2">
            <Flame className="w-6 h-6 text-accent mb-4" />
            <div className="text-3xl font-display font-bold">{stats?.avg_energy ? `${stats.avg_energy}%` : "..."}</div>
            <div className="text-sm text-muted-foreground">City Energy</div>
          </div>
          <div className="glass-card p-6 rounded-3xl border-white/5 space-y-2">
            <Sparkles className="w-6 h-6 text-yellow-500 mb-4" />
            <div className="text-3xl font-display font-bold">{stats?.memories_tonight || "..."}</div>
            <div className="text-sm text-muted-foreground">Memories Captured</div>
          </div>
        </div>

        {/* Trending Events */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-display font-bold">Trending Tonight</h2>
            <Link href="/discover" className="text-sm text-primary hover:text-primary/80 transition-colors">View all</Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trending?.map((event) => (
              <Link key={event.id} href={`/event/${event.id}`} className="block group">
                <div className="glass-card rounded-[2rem] overflow-hidden border-white/5 transition-all duration-500 hover:border-primary/30 hover:shadow-[0_0_30px_rgba(139,111,255,0.1)] relative h-72">
                  <div className="absolute inset-0 opacity-20 transition-opacity duration-500 group-hover:opacity-40" style={{ background: event.color_theme }} />
                  <div className="absolute inset-0 p-6 flex flex-col justify-end bg-gradient-to-t from-black via-black/50 to-transparent">
                    <div className="space-y-2">
                      <div className="flex justify-between items-end">
                         <h3 className="text-xl font-bold font-display group-hover:glow-text transition-all">{event.title}</h3>
                         <div className="flex items-center gap-1 text-sm text-secondary bg-secondary/10 px-2 py-1 rounded-full border border-secondary/20">
                           <Flame className="w-3 h-3" /> {event.energy_score}
                         </div>
                      </div>
                      <p className="text-sm text-white/60">{event.venue}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
            {!trending && (
               [1,2,3].map(i => <div key={i} className="glass-card h-72 rounded-[2rem] border-white/5 animate-pulse bg-white/5" />)
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
}