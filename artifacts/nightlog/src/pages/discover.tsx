import { Layout } from "@/components/layout";
import { useListEvents, useGetEventEnergy, useCreateEvent, getListEventsQueryKey, useGetFeedStats } from "@workspace/api-client-react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, MapPin, Users, Search, Plus, X, LayoutGrid, List, ArrowRight, Sparkles, TrendingUp, Clock } from "lucide-react";
import { Link } from "wouter";
import { useState, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const EVENT_TYPES = ["Electronic", "Underground", "Rooftop", "Ambient", "Afterparty", "Live Music"];
const FILTERS = ["trending", "tonight", "friends", "all"] as const;
type Filter = typeof FILTERS[number];
type ViewMode = "grid" | "list";

/* Derive consistent fake-but-realistic metadata from event ID */
function getVibeMeta(id: number) {
  const h = id;
  return {
    price: (["Free", "$15", "$20", "$25–35", "$40+"] as const)[h % 5],
    queue: ([null, null, "~10 min wait", "~20 min wait", "~35 min wait"] as const)[h % 5],
    reason: ([
      "Matches your taste profile",
      "3 friends in your circle are going",
      "Peak energy window 1–3 AM",
      "Top venue trending tonight",
      "Similar to your last replay",
    ] as const)[h % 5],
    tags: ([
      ["#electronic", "#rooftop"],
      ["#underground", "#bass"],
      ["#ambient", "#dark"],
      ["#live-sets", "#techno"],
      ["#afterhours", "#deep-house"],
    ] as const)[h % 5],
    friendsGoing: h % 4,
    trending: h % 3 === 0,
    peakHour: (["11PM–2AM", "12AM–3AM", "1AM–4AM", "10PM–1AM"] as const)[h % 4],
  };
}

export default function Discover() {
  const [filter, setFilter] = useState<Filter>("trending");
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const queryClient = useQueryClient();
  const createEvent = useCreateEvent();
  const { data: stats } = useGetFeedStats();

  const [form, setForm] = useState({
    title: "", type: "Electronic", venue: "", location: "Bhubaneswar",
    description: "", starts_at: "10:00 PM Tonight", ends_at: "4:00 AM",
  });

  const { data: events, isLoading } = useListEvents({ filter }, { query: { queryKey: ["events", filter] } });

  const filtered = useMemo(() => {
    if (!events) return [];
    let result = events;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(e =>
        e.title.toLowerCase().includes(q) ||
        e.venue.toLowerCase().includes(q) ||
        e.type.toLowerCase().includes(q)
      );
    }
    if (typeFilter) {
      result = result.filter(e => e.type.toLowerCase() === typeFilter.toLowerCase());
    }
    return result;
  }, [events, search, typeFilter]);

  const aiPicks = useMemo(() => filtered.slice(0, 2), [filtered]);
  const restEvents = useMemo(() => filtered.slice(2), [filtered]);

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
      <div className="flex flex-col overflow-hidden" style={{ minHeight: "100vh" }}>

        {/* ── Toolbar ── */}
        <div className="px-6 lg:px-8 pt-6 pb-4 shrink-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-[22px] font-semibold tracking-tight text-white leading-none">Discover</h1>
              <p className="text-[12px] text-white/30 mt-1 font-light">
                {stats ? `${stats.live_events} venues active · ${stats.people_out} out tonight` : "Loading city data…"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {/* View toggle */}
              <div className="flex items-center rounded-lg p-0.5" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }}>
                {(["grid", "list"] as const).map(mode => (
                  <button key={mode} onClick={() => setViewMode(mode)}
                    className={`p-2 rounded-md transition-colors ${viewMode === mode ? "bg-white/10 text-white" : "text-white/30 hover:text-white/60"}`}>
                    {mode === "grid" ? <LayoutGrid className="w-3.5 h-3.5" /> : <List className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>

              {/* Create */}
              <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogTrigger asChild>
                  <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[12px] font-semibold text-white"
                    style={{ background: "#7c5cfc", boxShadow: "0 0 0 1px rgba(124,92,252,0.3)" }}>
                    <Plus className="w-3.5 h-3.5" /> Create
                  </button>
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
                        <input value={form[key as keyof typeof form]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                          placeholder={placeholder}
                          className="w-full rounded-xl px-4 py-2.5 text-[14px] text-white placeholder:text-white/20 focus:outline-none"
                          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }} />
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
                      className="w-full py-3 rounded-xl text-[14px] font-semibold text-white disabled:opacity-40"
                      style={{ background: "#7c5cfc" }}>
                      {createEvent.isPending ? "Launching..." : "Launch Event"}
                    </button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Search + filter row */}
          <div className="flex flex-col sm:flex-row gap-2.5 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25" />
              <input type="search" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search events, venues, vibes..."
                className="w-full rounded-xl pl-10 pr-9 py-2.5 text-[13px] text-white placeholder:text-white/22 focus:outline-none"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }} />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <div className="flex items-center gap-1 p-0.5 rounded-xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
              {FILTERS.map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-3.5 py-2 rounded-lg text-[12px] font-medium capitalize transition-all ${
                    filter === f ? "bg-white/10 text-white" : "text-white/30 hover:text-white/60"
                  }`}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Type filter chips */}
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <button onClick={() => setTypeFilter(null)}
              className={`text-[11px] font-medium px-3 py-1 rounded-full transition-all ${
                !typeFilter ? "text-white bg-white/10" : "text-white/30 hover:text-white/55"
              }`} style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
              All types
            </button>
            {EVENT_TYPES.map(t => (
              <button key={t} onClick={() => setTypeFilter(typeFilter === t ? null : t)}
                className={`text-[11px] font-medium px-3 py-1 rounded-full transition-all ${
                  typeFilter === t ? "text-white" : "text-white/30 hover:text-white/55"
                }`} style={{
                  border: `1px solid ${typeFilter === t ? "rgba(124,92,252,0.4)" : "rgba(255,255,255,0.08)"}`,
                  background: typeFilter === t ? "rgba(124,92,252,0.12)" : "transparent",
                }}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* ── Content ── */}
        <div className="flex-1 overflow-y-auto px-6 lg:px-8 py-6 space-y-8">

          {/* AI Picks */}
          {!search && !typeFilter && filter === "trending" && aiPicks.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#7c5cfc]" />
                <span className="text-[11px] font-semibold text-white/40 tracking-widest uppercase">AI Pick for you</span>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {aiPicks.map((event, i) => (
                  <AiPickCard key={event.id} event={event} index={i} />
                ))}
              </div>
            </section>
          )}

          {/* Main grid/list */}
          <section className="space-y-3">
            {(search || typeFilter || filter !== "trending") ? null : (
              <div className="flex items-center gap-2">
                <TrendingUp className="w-3.5 h-3.5 text-white/25" />
                <span className="text-[11px] font-semibold text-white/35 tracking-widest uppercase">
                  {filter === "trending" ? "All Tonight" : filter === "tonight" ? "Happening Now" : filter === "friends" ? "Friend Activity" : "All Events"}
                </span>
                {search && <span className="text-[11px] text-white/25">&mdash; {filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>}
              </div>
            )}
            {search && (
              <span className="text-[12px] text-white/30">{filtered.length} result{filtered.length !== 1 ? "s" : ""} for &ldquo;{search}&rdquo;</span>
            )}

            <AnimatePresence mode="popLayout">
              {isLoading ? (
                <div className={viewMode === "grid" ? "grid md:grid-cols-2 lg:grid-cols-3 gap-3" : "space-y-1"}>
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="animate-pulse rounded-2xl"
                      style={{ height: viewMode === "grid" ? 220 : 72, background: "rgba(255,255,255,0.04)" }} />
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="py-24 text-center text-white/22 text-[14px]">
                  No events found
                </motion.div>
              ) : viewMode === "grid" ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {(search || typeFilter || filter !== "trending" ? filtered : restEvents).map((event, i) => (
                    <EventCard key={event.id} event={event} index={i} />
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
                  {(search || typeFilter || filter !== "trending" ? filtered : restEvents).map((event, i) => (
                    <EventListItem key={event.id} event={event} index={i} last={i === filtered.length - 3} />
                  ))}
                </div>
              )}
            </AnimatePresence>
          </section>
        </div>
      </div>
    </Layout>
  );
}

/* ── AI Pick Card (larger featured card) ── */
function AiPickCard({ event, index }: { event: any; index: number }) {
  const { data: energy } = useGetEventEnergy(event.id);
  const score = energy?.score ?? event.energy_score;
  const meta = getVibeMeta(event.id);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.07 }}>
      <Link href={`/event/${event.id}`}>
        <div className="group rounded-2xl overflow-hidden cursor-pointer transition-all hover:border-white/12"
          style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
          {/* Gradient area */}
          <div className="relative" style={{ height: 140 }}>
            <div className="absolute inset-0" style={{ background: event.color_theme }} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
              style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.08), transparent 55%)" }} />
            {/* AI badge */}
            <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold"
              style={{ background: "rgba(124,92,252,0.55)", backdropFilter: "blur(8px)", color: "#fff" }}>
              <Sparkles className="w-3 h-3" /> AI Pick
            </div>
            {meta.trending && (
              <div className="absolute top-3 right-14 flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold text-amber-300"
                style={{ background: "rgba(251,146,60,0.18)", border: "1px solid rgba(251,146,60,0.25)" }}>
                ↑ Trending
              </div>
            )}
            <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-mono text-white"
              style={{ background: "rgba(0,0,0,0.48)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.1)" }}>
              <span className={`live-dot ${score >= 90 ? "bg-[#00d4ff]" : "bg-primary"}`} />{score}%
            </div>
            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 flex-wrap">
              {meta.tags.map(tag => (
                <span key={tag} className="text-[9px] text-white/45">{tag}</span>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="px-4 pt-3.5 pb-4 space-y-2" style={{ background: "rgba(255,255,255,0.03)" }}>
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-[17px] font-semibold text-white leading-tight">{event.title}</h3>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="tag text-[9px]" style={{ padding: "2px 7px" }}>{event.type}</span>
                <span className="text-[12px] text-white/35 font-medium">{meta.price}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-[12px] text-white/38">
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{event.venue}</span>
              {event.distance_km && <span>{event.distance_km.toFixed(1)}km</span>}
              <span className="flex items-center gap-1"><Users className="w-3 h-3" />{event.attendee_count}</span>
              {meta.friendsGoing > 0 && <span className="text-primary font-medium">{meta.friendsGoing} friends</span>}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-white/32">
              <span style={{ color: "#7c5cfc" }}>✦</span> {meta.reason}
            </div>
            <div className="flex items-center gap-3 pt-0.5">
              <div className="energy-bar flex-1">
                <motion.div className="energy-bar-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${score}%` }}
                  transition={{ duration: 1.2, ease: "easeOut" }} />
              </div>
              <Clock className="w-3 h-3 text-white/25 shrink-0" />
              <span className="text-[10px] text-white/25 shrink-0">{meta.peakHour}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ── Dense Grid Card ── */
function EventCard({ event, index }: { event: any; index: number }) {
  const { data: energy } = useGetEventEnergy(event.id);
  const score = energy?.score ?? event.energy_score;
  const meta = getVibeMeta(event.id);

  return (
    <motion.div layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ delay: index * 0.04, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>
      <Link href={`/event/${event.id}`}>
        <div className="group rounded-2xl overflow-hidden cursor-pointer transition-all hover:border-white/12"
          style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
          {/* Gradient thumbnail */}
          <div className="relative" style={{ height: 110 }}>
            <div className="absolute inset-0" style={{ background: event.color_theme }} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
              style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.07), transparent 55%)" }} />

            <div className="absolute top-2.5 left-2.5 font-mono text-[10px] text-white/35">
              {String(index + 1).padStart(2, "0")}
            </div>

            <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-mono text-white"
              style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.09)" }}>
              <span className={`live-dot ${score >= 90 ? "bg-[#00d4ff]" : score >= 75 ? "bg-primary" : "bg-white/30"}`} />
              {score}%
            </div>

            {event.joined && (
              <div className="absolute bottom-2.5 left-2.5 px-1.5 py-0.5 rounded-full text-[8px] font-bold text-white uppercase"
                style={{ background: "rgba(124,92,252,0.6)", backdropFilter: "blur(8px)" }}>Joined</div>
            )}
            {meta.trending && !event.joined && (
              <div className="absolute bottom-2.5 left-2.5 text-[9px] font-bold text-amber-300">↑ Hot</div>
            )}

            <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5">
              {meta.tags.map(tag => (
                <span key={tag} className="text-[9px] text-white/35">{tag}</span>
              ))}
            </div>
          </div>

          {/* Info panel */}
          <div className="px-3.5 pt-3 pb-3.5 space-y-2" style={{ background: "rgba(255,255,255,0.025)" }}>
            <div className="flex items-start justify-between gap-1.5">
              <h3 className="text-[15px] font-semibold text-white leading-tight group-hover:text-white transition-colors">{event.title}</h3>
              <span className="text-[12px] text-white/32 shrink-0 font-medium">{meta.price}</span>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-white/35 flex-wrap">
              <span className="flex items-center gap-0.5"><MapPin className="w-2.5 h-2.5" />{event.venue}</span>
              {event.distance_km && <span>·</span>}
              {event.distance_km && <span>{event.distance_km.toFixed(1)}km</span>}
              <span>·</span>
              <span>{event.attendee_count} going</span>
              {meta.friendsGoing > 0 && <><span>·</span><span style={{ color: "#9d7fff" }}>{meta.friendsGoing} friends</span></>}
            </div>

            {meta.queue && (
              <div className="text-[10px] font-medium" style={{ color: "#fbbf24" }}>{meta.queue}</div>
            )}

            <div className="text-[10px] text-white/28 flex items-center gap-1 leading-tight">
              <span style={{ color: "#7c5cfc" }}>✦</span>
              {meta.reason}
            </div>

            <div className="flex items-center gap-2 pt-0.5">
              <div className="energy-bar flex-1">
                <motion.div className="energy-bar-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${score}%` }}
                  transition={{ duration: 1, delay: index * 0.04, ease: "easeOut" }} />
              </div>
              <span className="text-[9px] text-white/20 shrink-0 font-mono">{score}%</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ── List Item ── */
function EventListItem({ event, index, last }: { event: any; index: number; last: boolean }) {
  const { data: energy } = useGetEventEnergy(event.id);
  const score = energy?.score ?? event.energy_score;
  const meta = getVibeMeta(event.id);

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03 }}>
      <Link href={`/event/${event.id}`}>
        <div className={`group flex items-center gap-4 px-4 py-3.5 hover:bg-white/4 transition-colors cursor-pointer ${
          !last ? "border-b" : ""
        }`} style={{ borderColor: "rgba(255,255,255,0.05)" }}>

          {/* Color swatch */}
          <div className="w-10 h-10 rounded-xl shrink-0 relative overflow-hidden" style={{ background: event.color_theme }}>
            <div className="absolute inset-0 bg-black/20" />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[14px] font-semibold text-white truncate">{event.title}</span>
              {meta.trending && <span className="text-[9px] text-amber-400 font-bold shrink-0">HOT</span>}
              {event.joined && <span className="text-[9px] shrink-0" style={{ color: "#9d7fff", fontWeight: 700 }}>JOINED</span>}
            </div>
            <div className="text-[11px] text-white/32 flex items-center gap-1.5 flex-wrap">
              <span>{event.venue}</span>
              {event.distance_km && <><span>·</span><span>{event.distance_km.toFixed(1)}km</span></>}
              <span>·</span><span>{event.attendee_count} going</span>
              {meta.friendsGoing > 0 && <><span>·</span><span style={{ color: "#9d7fff" }}>{meta.friendsGoing} friends</span></>}
              <span>·</span><span className="text-white/20 flex items-center gap-0.5"><Sparkles className="w-2.5 h-2.5 text-primary" />{meta.reason}</span>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2.5 shrink-0">
            <span className="tag text-[9px] hidden sm:block" style={{ padding: "2px 7px" }}>{event.type}</span>
            <span className="text-[11px] text-white/28 hidden sm:block">{meta.price}</span>
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-mono text-white"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <span className={`live-dot ${score >= 90 ? "bg-[#00d4ff]" : "bg-primary"}`} />
              {score}%
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-white/18 group-hover:text-white/45 transition-colors" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
