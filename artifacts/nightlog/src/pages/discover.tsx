import { Layout } from "@/components/layout";
import { useListEvents, useGetEventEnergy } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Flame, MapPin, Users } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Discover() {
  const [filter, setFilter] = useState<'trending'|'tonight'|'friends'|'all'>('trending');
  const { data: events, isLoading } = useListEvents({ filter }, { query: { queryKey: ["events", filter] } });

  return (
    <Layout>
      <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8">
        <header className="space-y-4 pt-8">
          <h1 className="text-4xl font-display font-bold glow-text">Discover</h1>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {['trending', 'tonight', 'friends', 'all'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all capitalize whitespace-nowrap ${
                  filter === f 
                    ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)]" 
                    : "glass-card hover:bg-white/10 text-muted-foreground hover:text-white"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            [1,2,3,4,5,6].map(i => <div key={i} className="h-80 rounded-[2rem] glass-card animate-pulse" />)
          ) : (
            events?.map((event, i) => (
              <EventCard key={event.id} event={event} index={i} />
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}

function EventCard({ event, index }: { event: any, index: number }) {
  const { data: energy } = useGetEventEnergy(event.id);
  const currentEnergy = energy?.score ?? event.energy_score;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <Link href={`/event/${event.id}`}>
        <div className="group relative h-80 rounded-[2rem] glass-card overflow-hidden border border-white/5 hover:border-primary/40 transition-all duration-500">
          <div 
            className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-all duration-700" 
            style={{ background: event.color_theme }}
          />
          <div className="absolute top-4 right-4 z-10 glass-card px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-white/10">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${currentEnergy > 80 ? 'bg-secondary' : 'bg-primary'}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${currentEnergy > 80 ? 'bg-secondary' : 'bg-primary'}`}></span>
            </span>
            <span className="text-xs font-bold font-mono">{currentEnergy}%</span>
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6 flex flex-col justify-end">
            <div className="space-y-3 transform group-hover:-translate-y-2 transition-transform duration-500">
              <div className="space-y-1">
                <p className="text-xs font-medium tracking-widest text-primary uppercase">{event.type}</p>
                <h3 className="text-2xl font-display font-bold group-hover:glow-text transition-all leading-tight">{event.title}</h3>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-white/60">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  <span>{event.venue}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  <span>{event.attendee_count}</span>
                </div>
              </div>

              {/* Energy Bar */}
              <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden mt-4">
                <motion.div 
                  className="h-full bg-gradient-to-r from-primary to-secondary"
                  initial={{ width: 0 }}
                  animate={{ width: `${currentEnergy}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}