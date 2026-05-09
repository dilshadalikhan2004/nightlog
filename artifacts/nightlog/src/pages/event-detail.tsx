import { Layout } from "@/components/layout";
import { useGetEvent, useGetEventEnergy, useJoinEvent, useListMessages, useSendMessage } from "@workspace/api-client-react";
import { useRoute } from "wouter";
import { motion } from "framer-motion";
import { Flame, MapPin, Users, Send, Check, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";

const WAVEFORM_HEIGHTS = [40, 65, 30, 80, 55, 70, 45, 90, 60, 50, 75, 38, 85, 62, 48, 72, 35, 88, 58, 44];

export default function EventDetail() {
  const [, params] = useRoute("/event/:id");
  const eventId = params?.id ? parseInt(params.id) : 0;

  const queryClient = useQueryClient();
  const { data: event, isLoading } = useGetEvent(eventId, { query: { enabled: !!eventId, queryKey: ["event", eventId] } });
  const { data: energy } = useGetEventEnergy(eventId, { query: { enabled: !!eventId, queryKey: ["event-energy", eventId] } });
  const { data: messages } = useListMessages({ event_id: eventId }, { query: { enabled: !!eventId, queryKey: ["messages", eventId] } });

  const joinEvent = useJoinEvent();
  const sendMessage = useSendMessage();
  const [message, setMessage] = useState("");

  const currentEnergy = energy?.score ?? event?.energy_score ?? 0;

  if (isLoading || !event) return (
    <Layout><div className="h-screen flex items-center justify-center"><div className="w-6 h-6 rounded-full border-t-2 border-primary animate-spin" /></div></Layout>
  );

  return (
    <Layout>
      <div className="min-h-screen">

        {/* ── Cinematic header ── */}
        <div className="relative overflow-hidden" style={{ height: "52vh", minHeight: 340 }}>
          <div className="absolute inset-0" style={{ background: event.color_theme }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #0a0a0a 0%, rgba(10,10,10,0.6) 50%, rgba(10,10,10,0.1) 100%)" }} />

          {/* Noise grain */}
          <div className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none"
            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")", backgroundSize: "180px" }} />

          {/* Back */}
          <div className="absolute top-6 left-6">
            <Link href="/discover">
              <button className="flex items-center gap-2 text-[13px] text-white/50 hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            </Link>
          </div>

          {/* Energy live badge */}
          <div className="absolute top-6 right-6 flex items-center gap-2 px-3 py-1.5 rounded-xl text-[12px] font-mono text-white"
            style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.1)" }}>
            <span className="live-dot bg-[#00d4ff]" />
            {currentEnergy}% Live
          </div>

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 px-6 lg:px-10 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-5">
            <div className="space-y-3">
              <span className="tag tag-primary">{event.type}</span>
              <h1 className="display text-[clamp(48px,7vw,96px)] text-white leading-none tracking-wide">{event.title}</h1>
              <div className="flex flex-wrap items-center gap-5 text-[13px] text-white/50">
                <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{event.venue}</span>
                <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" />{event.attendee_count} attending</span>
                <span className="flex items-center gap-1.5 text-[#00d4ff]"><Flame className="w-3.5 h-3.5" />{currentEnergy}% energy</span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: event.joined ? 1 : 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                if (!event.joined) {
                  joinEvent.mutate({ id: event.id }, {
                    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["event", eventId] })
                  });
                }
              }}
              disabled={event.joined || joinEvent.isPending}
              className="flex items-center gap-2.5 px-7 py-3.5 rounded-xl text-[14px] font-semibold text-white shrink-0 self-start md:self-auto transition-all disabled:opacity-60"
              style={event.joined
                ? { background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }
                : { background: "#7c5cfc", boxShadow: "0 0 0 1px rgba(124,92,252,0.3), 0 8px 24px rgba(124,92,252,0.25)" }
              }
            >
              {event.joined ? <><Check className="w-4 h-4" /> Joined</> : "Join Event"}
            </motion.button>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="max-w-6xl mx-auto px-6 lg:px-10 py-8 grid lg:grid-cols-[1fr_320px] gap-8">

          {/* Main column */}
          <div className="space-y-6">

            {/* About */}
            <div className="p-6 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <h2 className="text-[13px] font-semibold tracking-[0.18em] uppercase text-white/35 mb-3">About</h2>
              <p className="text-[15px] text-white/65 leading-relaxed">{event.description}</p>
            </div>

            {/* Vibe feed */}
            <div className="p-6 rounded-2xl space-y-5" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex items-center justify-between">
                <h2 className="text-[13px] font-semibold tracking-[0.18em] uppercase text-white/35">Vibe Feed</h2>
                <span className="tag tag-live flex items-center gap-1.5">
                  <span className="live-dot bg-[#00d4ff]" /> Live
                </span>
              </div>

              <div className="h-80 overflow-y-auto space-y-3 flex flex-col-reverse pr-1">
                {messages?.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.is_own ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[78%] px-4 py-2.5 rounded-xl text-[13px] leading-relaxed ${
                      msg.is_own ? "text-white rounded-br-sm" : "text-white/80 rounded-bl-sm"
                    }`} style={msg.is_own
                      ? { background: "#7c5cfc" }
                      : { background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.07)" }
                    }>
                      {!msg.is_own && <div className="text-[10px] text-white/35 mb-1 font-medium">{msg.sender_name}</div>}
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (message.trim()) {
                    sendMessage.mutate({ data: { content: message, event_id: eventId } }, {
                      onSuccess: () => {
                        setMessage("");
                        queryClient.invalidateQueries({ queryKey: ["messages", eventId] });
                      }
                    });
                  }
                }}
                className="flex gap-2.5"
              >
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Drop a message..."
                  className="flex-1 px-4 py-3 rounded-xl text-[14px] text-white placeholder:text-white/25 focus:outline-none"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
                />
                <button type="submit" disabled={!message.trim() || sendMessage.isPending}
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-white disabled:opacity-30 shrink-0"
                  style={{ background: "#7c5cfc" }}>
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">

            {/* Energy pulse */}
            <div className="p-5 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[12px] font-semibold tracking-[0.18em] uppercase text-white/35">Energy Pulse</h3>
                <span className="font-mono text-[14px] text-[#00d4ff]">{currentEnergy}%</span>
              </div>
              <div className="flex items-end gap-[3px] h-20">
                {WAVEFORM_HEIGHTS.map((h, i) => (
                  <motion.div
                    key={i}
                    className="flex-1 rounded-t-[2px]"
                    style={{ background: `linear-gradient(to top, #7c5cfc, #00d4ff)`, opacity: 0.7 }}
                    initial={{ height: "8%" }}
                    animate={{ height: `${h + Math.random() * 15}%` }}
                    transition={{ duration: 0.6, repeat: Infinity, repeatType: "mirror", delay: i * 0.06, ease: "easeInOut" }}
                  />
                ))}
              </div>
              <div className="energy-bar mt-4">
                <div className="energy-bar-fill" style={{ width: `${currentEnergy}%` }} />
              </div>
            </div>

            {/* Details */}
            <div className="p-5 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <h3 className="text-[12px] font-semibold tracking-[0.18em] uppercase text-white/35 mb-4">Details</h3>
              <div className="space-y-3 text-[14px]">
                {(([
                  ["Starts", event.starts_at],
                  event.ends_at ? ["Ends", event.ends_at] : null,
                  ["Distance", `${event.distance_km?.toFixed(1) ?? "?"} km`],
                ].filter(Boolean)) as string[][]).map(([label, value]) => (
                  <div key={label as string} className="flex justify-between items-center py-2.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <span className="text-white/35 text-[13px]">{label as string}</span>
                    <span className="text-white/80 font-medium text-[13px]">{value as string}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
