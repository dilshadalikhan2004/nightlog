import { Layout } from "@/components/layout";
import { useGetEvent, useGetEventEnergy, useJoinEvent, useListMessages, useSendMessage } from "@workspace/api-client-react";
import { useRoute } from "wouter";
import { motion } from "framer-motion";
import { Flame, MapPin, Users, Send, Check } from "lucide-react";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

export default function EventDetail() {
  const [match, params] = useRoute("/event/:id");
  const eventId = params?.id ? parseInt(params.id) : 0;
  
  const queryClient = useQueryClient();
  const { data: event, isLoading } = useGetEvent(eventId, { query: { enabled: !!eventId, queryKey: ["event", eventId] } });
  const { data: energy } = useGetEventEnergy(eventId, { query: { enabled: !!eventId, queryKey: ["event-energy", eventId] } });
  const { data: messages } = useListMessages({ event_id: eventId }, { query: { enabled: !!eventId, queryKey: ["messages", eventId] } });
  
  const joinEvent = useJoinEvent();
  const sendMessage = useSendMessage();
  const [message, setMessage] = useState("");

  const currentEnergy = energy?.score ?? event?.energy_score ?? 0;

  if (isLoading || !event) return <Layout><div className="h-screen flex items-center justify-center"><div className="w-8 h-8 rounded-full border-t-2 border-primary animate-spin" /></div></Layout>;

  return (
    <Layout>
      <div className="relative min-h-screen">
        {/* Cinematic Header */}
        <div className="h-[50vh] relative overflow-hidden flex items-end p-8 border-b border-white/5">
          <div className="absolute inset-0 opacity-30" style={{ background: event.color_theme }} />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
          
          <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4 max-w-2xl">
              <span className="inline-block px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-bold tracking-wider uppercase tracking-widest">{event.type}</span>
              <h1 className="text-5xl md:text-7xl font-display font-bold glow-text leading-none">{event.title}</h1>
              <div className="flex flex-wrap items-center gap-6 text-white/70">
                <div className="flex items-center gap-2"><MapPin className="w-5 h-5 text-white/50" /> {event.venue}</div>
                <div className="flex items-center gap-2"><Users className="w-5 h-5 text-white/50" /> {event.attendee_count} attending</div>
                <div className="flex items-center gap-2 text-secondary"><Flame className="w-5 h-5" /> {currentEnergy}% Energy</div>
              </div>
            </div>
            
            <button 
              onClick={() => {
                if (!event.joined) {
                  joinEvent.mutate({ id: event.id }, {
                    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["event", eventId] })
                  });
                }
              }}
              disabled={event.joined || joinEvent.isPending}
              className={`px-8 py-4 rounded-full font-bold transition-all ${event.joined ? "bg-white/10 text-white cursor-default" : "bg-primary text-white hover:bg-primary/90 shadow-[0_0_30px_rgba(139,111,255,0.4)]"}`}
            >
              {event.joined ? <span className="flex items-center gap-2"><Check className="w-5 h-5" /> Joined</span> : "Join Event"}
            </button>
          </div>
        </div>

        <div className="max-w-5xl mx-auto p-4 lg:p-8 grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <section className="glass-card rounded-[2rem] p-8 border-white/5">
              <h2 className="text-2xl font-display font-bold mb-4">About</h2>
              <p className="text-white/70 leading-relaxed text-lg">{event.description}</p>
            </section>

            <section className="glass-card rounded-[2rem] p-8 border-white/5 space-y-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-display font-bold">Vibe Feed</h2>
                <span className="text-xs text-primary animate-pulse flex items-center gap-1"><div className="w-2 h-2 bg-primary rounded-full" /> Live</span>
              </div>
              
              <div className="h-96 overflow-y-auto pr-2 space-y-4 flex flex-col-reverse">
                {messages?.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.is_own ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl px-5 py-3 ${msg.is_own ? 'bg-primary text-white shadow-[0_0_15px_rgba(139,111,255,0.2)]' : 'glass-card border-white/5'}`}>
                      {!msg.is_own && <div className="text-xs text-white/50 mb-1">{msg.sender_name}</div>}
                      <p className="text-sm">{msg.content}</p>
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
                className="flex gap-2"
              >
                <input 
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Drop a message..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-full px-6 py-3 focus:outline-none focus:border-primary/50 transition-colors"
                />
                <button type="submit" disabled={!message.trim() || sendMessage.isPending} className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white disabled:opacity-50">
                  <Send className="w-5 h-5 ml-1" />
                </button>
              </form>
            </section>
          </div>

          <div className="space-y-6">
             <div className="glass-card rounded-[2rem] p-6 border-white/5">
                <h3 className="font-display font-bold mb-4 text-white/80">Energy Pulse</h3>
                <div className="h-32 flex items-end gap-1 mb-4">
                  {[...Array(12)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="flex-1 bg-secondary rounded-t-sm opacity-50"
                      initial={{ height: "10%" }}
                      animate={{ height: `${Math.random() * 80 + 20}%` }}
                      transition={{ duration: 0.5, repeat: Infinity, repeatType: "mirror", delay: i * 0.1 }}
                    />
                  ))}
                </div>
                <div className="text-center font-mono text-2xl text-secondary glow-text">{currentEnergy}%</div>
             </div>
             
             <div className="glass-card rounded-[2rem] p-6 border-white/5">
                <h3 className="font-display font-bold mb-4 text-white/80">Details</h3>
                <div className="space-y-4 text-sm">
                   <div className="flex justify-between border-b border-white/5 pb-2">
                     <span className="text-white/50">Starts</span>
                     <span>{event.starts_at}</span>
                   </div>
                   {event.ends_at && (
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-white/50">Ends</span>
                      <span>{event.ends_at}</span>
                    </div>
                   )}
                   <div className="flex justify-between">
                     <span className="text-white/50">Distance</span>
                     <span>{event.distance_km?.toFixed(1) ?? '?'} km</span>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}