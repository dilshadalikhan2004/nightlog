import { Layout } from "@/components/layout";
import { useListEvents, useGetEventEnergy, useCreateEvent, getListEventsQueryKey } from "@workspace/api-client-react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, MapPin, Users, Search, Plus, X } from "lucide-react";
import { Link } from "wouter";
import { useState, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const EVENT_TYPES = ["Electronic", "Underground", "Rooftop", "Ambient", "Afterparty", "Live Music"];
const COLOR_THEMES = [
  "linear-gradient(135deg,#8b6fff,#ff4d9a)",
  "linear-gradient(135deg,#00d4ff,#8b6fff)",
  "linear-gradient(135deg,#ff4d9a,#f6d67d)",
  "linear-gradient(135deg,#f6d67d,#8b6fff)",
  "linear-gradient(135deg,#00d4ff,#ff4d9a)",
];

export default function Discover() {
  const [filter, setFilter] = useState<'trending'|'tonight'|'friends'|'all'>('trending');
  const [search, setSearch] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const queryClient = useQueryClient();
  const createEvent = useCreateEvent();

  const [form, setForm] = useState({
    title: "", type: "Electronic", venue: "", location: "Bhubaneswar",
    description: "", starts_at: "10:00 PM Tonight", ends_at: "4:00 AM",
  });

  const { data: events, isLoading } = useListEvents({ filter }, { query: { queryKey: ["events", filter] } });

  const filtered = useMemo(() => {
    if (!events) return [];
    if (!search.trim()) return events;
    const q = search.toLowerCase();
    return events.filter(e =>
      e.title.toLowerCase().includes(q) ||
      e.venue.toLowerCase().includes(q) ||
      e.type.toLowerCase().includes(q) ||
      e.location.toLowerCase().includes(q)
    );
  }, [events, search]);

  const handleCreate = () => {
    if (!form.title || !form.venue) return;
    createEvent.mutate({ data: form }, {
      onSuccess: () => {
        setIsCreateOpen(false);
        setForm({ title: "", type: "Electronic", venue: "", location: "Bhubaneswar", description: "", starts_at: "10:00 PM Tonight", ends_at: "4:00 AM" });
        queryClient.invalidateQueries({ queryKey: getListEventsQueryKey({ filter }) });
      }
    });
  };

  return (
    <Layout>
      <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8">
        <header className="space-y-6 pt-8">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-4xl font-display font-bold glow-text">Discover</h1>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <button className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white font-medium hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(139,111,255,0.3)] hover:shadow-[0_0_30px_rgba(139,111,255,0.5)] text-sm">
                  <Plus className="w-4 h-4" /> Create Event
                </button>
              </DialogTrigger>
              <DialogContent className="border-white/10 bg-[#08081a] max-w-lg">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-display glow-text">Launch a Night</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 space-y-1.5">
                      <label className="text-xs font-bold text-white/50 uppercase tracking-wider">Event Name</label>
                      <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                        placeholder="Neon Afterlife..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50 transition-colors" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-white/50 uppercase tracking-wider">Type</label>
                      <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50 appearance-none">
                        {EVENT_TYPES.map(t => <option key={t} value={t} className="bg-[#08081a]">{t}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-white/50 uppercase tracking-wider">Venue</label>
                      <input value={form.venue} onChange={e => setForm(f => ({ ...f, venue: e.target.value }))}
                        placeholder="Skyline Rooftop..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50 transition-colors" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-white/50 uppercase tracking-wider">Starts</label>
                      <input value={form.starts_at} onChange={e => setForm(f => ({ ...f, starts_at: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50 transition-colors" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-white/50 uppercase tracking-wider">Ends</label>
                      <input value={form.ends_at} onChange={e => setForm(f => ({ ...f, ends_at: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50 transition-colors" />
                    </div>
                    <div className="col-span-2 space-y-1.5">
                      <label className="text-xs font-bold text-white/50 uppercase tracking-wider">Description</label>
                      <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                        rows={3} placeholder="Describe the vibe..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50 transition-colors resize-none" />
                    </div>
                  </div>
                  <button onClick={handleCreate} disabled={!form.title || !form.venue || createEvent.isPending}
                    className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(139,111,255,0.3)]">
                    {createEvent.isPending ? "Launching..." : "Launch Event"}
                  </button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search events, venues, vibes..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-11 pr-10 py-3.5 focus:outline-none focus:border-primary/40 transition-colors text-sm placeholder:text-white/30"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {['trending', 'tonight', 'friends', 'all'].map((f) => (
              <button key={f} onClick={() => setFilter(f as any)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all capitalize whitespace-nowrap ${
                  filter === f
                    ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                    : "glass-card hover:bg-white/10 text-muted-foreground hover:text-white border border-white/5"
                }`}>
                {f}
              </button>
            ))}
          </div>
        </header>

        {search && (
          <p className="text-sm text-white/40">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""} for <span className="text-primary">"{search}"</span>
          </p>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {isLoading ? (
              [1,2,3,4,5,6].map(i => <div key={i} className="h-80 rounded-[2rem] glass-card animate-pulse" />)
            ) : filtered.length === 0 ? (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-3 text-center py-24 text-white/30">
                <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p className="text-lg">No events match "{search}"</p>
              </motion.div>
            ) : (
              filtered.map((event, i) => (
                <EventCard key={event.id} event={event} index={i} />
              ))
            )}
          </AnimatePresence>
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
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
    >
      <Link href={`/event/${event.id}`}>
        <div className="group relative h-80 rounded-[2rem] overflow-hidden border border-white/5 hover:border-white/20 transition-all duration-500 hover:shadow-[0_0_40px_rgba(139,111,255,0.15)] cursor-pointer">
          {/* Full gradient background from event theme */}
          <div className="absolute inset-0" style={{ background: event.color_theme }} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />

          {/* Shimmer on hover */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

          {/* Energy badge */}
          <div className="absolute top-4 right-4 z-10 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-white/10">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${currentEnergy > 90 ? 'bg-green-400' : currentEnergy > 75 ? 'bg-secondary' : 'bg-primary'}`} />
              <span className={`relative inline-flex rounded-full h-2 w-2 ${currentEnergy > 90 ? 'bg-green-400' : currentEnergy > 75 ? 'bg-secondary' : 'bg-primary'}`} />
            </span>
            <span className="text-xs font-bold font-mono text-white">{currentEnergy}%</span>
          </div>

          {/* Joined badge */}
          {event.joined && (
            <div className="absolute top-4 left-4 z-10 bg-primary/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-white border border-primary/30">
              Joined
            </div>
          )}

          <div className="absolute inset-0 p-6 flex flex-col justify-end">
            <div className="space-y-3 transform group-hover:-translate-y-2 transition-transform duration-500">
              <p className="text-xs font-bold tracking-widest uppercase text-white/70">{event.type}</p>
              <h3 className="text-2xl font-display font-bold leading-tight text-white group-hover:text-white transition-all"
                style={{ textShadow: "0 0 30px rgba(255,255,255,0.3)" }}>
                {event.title}
              </h3>
              <div className="flex items-center gap-4 text-sm text-white/70">
                <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /><span>{event.venue}</span></div>
                <div className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /><span>{event.attendee_count}</span></div>
              </div>
              <div className="h-0.5 w-full bg-white/20 rounded-full overflow-hidden">
                <motion.div className="h-full bg-white/80"
                  initial={{ width: 0 }}
                  animate={{ width: `${currentEnergy}%` }}
                  transition={{ duration: 1.2, ease: "easeOut", delay: index * 0.05 }} />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
