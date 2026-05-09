import { Layout } from "@/components/layout";
import { useListEvents, useGetEventEnergy, useCreateEvent, getListEventsQueryKey } from "@workspace/api-client-react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, MapPin, Users, Search, Plus, X } from "lucide-react";
import { Link } from "wouter";
import { useState, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const EVENT_TYPES = ["Electronic", "Underground", "Rooftop", "Ambient", "Afterparty", "Live Music"];

const FILTERS = ["trending", "tonight", "friends", "all"] as const;
type Filter = typeof FILTERS[number];

export default function Discover() {
  const [filter, setFilter] = useState<Filter>("trending");
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
      e.type.toLowerCase().includes(q)
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
      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-10 lg:py-14 space-y-8">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h1 className="display text-[72px] text-white leading-none tracking-wide">Discover</h1>
            <p className="text-[14px] text-white/30 font-light">Find your night</p>
          </div>

          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold text-white mt-4"
                style={{ background: "#7c5cfc", boxShadow: "0 0 0 1px rgba(124,92,252,0.3)" }}>
                <Plus className="w-4 h-4" /> Create
              </motion.button>
            </DialogTrigger>
            <DialogContent className="border-white/8 max-w-md" style={{ background: "#111111" }}>
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold tracking-tight">Launch an Event</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-1">
                {[
                  { label: "Name", key: "title", placeholder: "Neon Afterlife..." },
                  { label: "Venue", key: "venue", placeholder: "Skyline Rooftop..." },
                  { label: "Starts", key: "starts_at", placeholder: "10:00 PM Tonight" },
                  { label: "Ends", key: "ends_at", placeholder: "4:00 AM" },
                ].map(({ label, key, placeholder }) => (
                  <div key={key} className="space-y-1.5">
                    <label className="text-[11px] font-medium tracking-widest uppercase text-white/30">{label}</label>
                    <input
                      value={form[key as keyof typeof form]}
                      onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                      placeholder={placeholder}
                      className="w-full rounded-xl px-4 py-2.5 text-[14px] text-white placeholder:text-white/20 focus:outline-none transition-colors"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                    />
                  </div>
                ))}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-medium tracking-widest uppercase text-white/30">Type</label>
                  <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                    className="w-full rounded-xl px-4 py-2.5 text-[14px] text-white focus:outline-none appearance-none"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    {EVENT_TYPES.map(t => <option key={t} value={t} style={{ background: "#111" }}>{t}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-medium tracking-widest uppercase text-white/30">Description</label>
                  <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    rows={3} placeholder="Describe the vibe..."
                    className="w-full rounded-xl px-4 py-2.5 text-[14px] text-white placeholder:text-white/20 focus:outline-none resize-none"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }} />
                </div>
                <button onClick={handleCreate} disabled={!form.title || !form.venue || createEvent.isPending}
                  className="w-full py-3 rounded-xl text-[14px] font-semibold text-white disabled:opacity-40 transition-opacity"
                  style={{ background: "#7c5cfc" }}>
                  {createEvent.isPending ? "Launching..." : "Launch Event"}
                </button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search + filter row */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
            <input type="search" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search events, venues..."
              className="w-full rounded-xl pl-11 pr-10 py-3 text-[14px] text-white placeholder:text-white/25 focus:outline-none"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }} />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
            {FILTERS.map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-[13px] font-medium capitalize transition-all ${
                  filter === f ? "bg-white/10 text-white" : "text-white/35 hover:text-white/60"
                }`}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        {search && (
          <p className="text-[13px] text-white/30">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""} for &ldquo;{search}&rdquo;
          </p>
        )}

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {isLoading
              ? [1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-72 rounded-2xl animate-pulse" style={{ background: "rgba(255,255,255,0.04)" }} />)
              : filtered.length === 0
              ? (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-3 py-32 text-center text-white/25 text-[15px]">
                  No events found
                </motion.div>
              )
              : filtered.map((event, i) => <EventCard key={event.id} event={event} index={i} />)
            }
          </AnimatePresence>
        </div>
      </div>
    </Layout>
  );
}

function EventCard({ event, index }: { event: any; index: number }) {
  const { data: energy } = useGetEventEnergy(event.id);
  const score = energy?.score ?? event.energy_score;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ delay: index * 0.04, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link href={`/event/${event.id}`}>
        <div className="group relative rounded-2xl overflow-hidden cursor-pointer" style={{ height: 280 }}>
          {/* Gradient bg */}
          <div className="absolute inset-0" style={{ background: event.color_theme }} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Hover overlay */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.07), transparent 50%)" }} />

          {/* Index */}
          <div className="absolute top-4 left-4 font-mono text-[11px] text-white/30">
            {String(index + 1).padStart(2, "0")}
          </div>

          {/* Joined badge */}
          {event.joined && (
            <div className="absolute top-4 left-10 px-2.5 py-0.5 rounded-full text-[10px] font-semibold text-white tracking-widest uppercase"
              style={{ background: "rgba(124,92,252,0.5)", backdropFilter: "blur(8px)" }}>
              Joined
            </div>
          )}

          {/* Energy */}
          <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono text-white"
            style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.1)" }}>
            <span className={`live-dot ${score >= 90 ? "bg-[#00d4ff]" : score >= 75 ? "bg-[#7c5cfc]" : "bg-white/40"}`} />
            {score}%
          </div>

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-5 transform group-hover:-translate-y-1 transition-transform duration-400">
            <p className="text-[10px] font-medium tracking-widest uppercase text-white/45 mb-2">{event.type}</p>
            <h3 className="text-[22px] font-semibold text-white leading-tight tracking-tight mb-3">{event.title}</h3>
            <div className="flex items-center gap-4 text-[12px] text-white/50 mb-3">
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{event.venue}</span>
              <span className="flex items-center gap-1"><Users className="w-3 h-3" />{event.attendee_count}</span>
            </div>
            <div className="energy-bar">
              <motion.div className="energy-bar-fill"
                initial={{ width: 0 }}
                animate={{ width: `${score}%` }}
                transition={{ duration: 1, delay: index * 0.05, ease: "easeOut" }} />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
