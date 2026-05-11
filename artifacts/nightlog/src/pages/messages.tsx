import { Layout } from "@/components/layout";
import { useListMessages, useSendMessage } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Send, Hash } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ── Channel definitions ── */
interface Channel {
  id: string;
  name: string;
  subtitle: string;
  eventId?: number;
  activeCount: number;
}

const CHANNELS: Channel[] = [
  { id: "global",  name: "City Wide",        subtitle: "All venues",      eventId: undefined, activeCount: 12 },
  { id: "ev1",     name: "Skyline Rooftop",   subtitle: "247 here",       eventId: 1,         activeCount: 8 },
  { id: "ev3",     name: "The Bunker",        subtitle: "124 here",       eventId: 3,         activeCount: 5 },
  { id: "ev2",     name: "Neon Rooftop",      subtitle: "203 here",       eventId: 2,         activeCount: 3 },
  { id: "ev4",     name: "Crystal Basement",  subtitle: "156 here",       eventId: 4,         activeCount: 7 },
  { id: "ev5",     name: "Afterhours",        subtitle: "89 here",        eventId: 5,         activeCount: 2 },
];

const TYPING_NAMES = ["Nyla", "Arjun", "Zara", "Kai", "Dev"];

function TypingIndicator({ name }: { name: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
      className="flex items-center gap-2 px-4 py-2">
      <div className="w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-bold text-white shrink-0"
        style={{ background: "linear-gradient(135deg,#7c5cfc,#f0365a)" }}>{name[0]}</div>
      <div className="flex items-center gap-1">
        <span className="text-[11px] text-white/30">{name} is typing</span>
        <div className="flex gap-0.5 ml-1">
          {[0, 1, 2].map(i => (
            <motion.div key={i} className="w-1 h-1 rounded-full bg-white/30"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ── Per-channel message feed ── */
function ChannelFeed({ channel }: { channel: Channel }) {
  const queryClient = useQueryClient();
  const qKey = channel.eventId ? ["messages", channel.eventId] : ["messages", "global"];
  const params = channel.eventId ? { event_id: channel.eventId } : {};

  const { data: messages, isLoading } = useListMessages(params, {
    query: { queryKey: qKey, enabled: true }
  });
  const sendMessage = useSendMessage();
  const [content, setContent] = useState("");
  const [typingName, setTypingName] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  /* Simulate typing indicators */
  useEffect(() => {
    let timeoutA: ReturnType<typeof setTimeout>;
    let timeoutB: ReturnType<typeof setTimeout>;
    const trigger = () => {
      const delay = 6000 + Math.random() * 10000;
      timeoutA = setTimeout(() => {
        setTypingName(TYPING_NAMES[Math.floor(Math.random() * TYPING_NAMES.length)]);
        timeoutB = setTimeout(() => setTypingName(null), 2500);
      }, delay);
    };
    trigger();
    return () => { clearTimeout(timeoutA); clearTimeout(timeoutB); };
  }, [channel.id]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    const data = channel.eventId
      ? { content, event_id: channel.eventId }
      : { content };
    sendMessage.mutate({ data }, {
      onSuccess: () => {
        setContent("");
        queryClient.invalidateQueries({ queryKey: qKey });
      }
    });
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Channel header */}
      <div className="px-5 py-3.5 shrink-0 flex items-center gap-3"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <Hash className="w-4 h-4 text-white/25 shrink-0" />
        <div>
          <div className="text-[14px] font-semibold text-white/85">{channel.name}</div>
          <div className="text-[11px] text-white/28 flex items-center gap-1.5">
            <span className="live-dot bg-emerald-400" />
            {channel.activeCount} active now · {channel.subtitle}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto flex flex-col-reverse px-4 py-3 gap-1">
        <div ref={endRef} />
        <AnimatePresence initial={false}>
          {typingName && <TypingIndicator key="typing" name={typingName} />}
        </AnimatePresence>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-5 h-5 rounded-full border-t-2 border-primary animate-spin" />
          </div>
        ) : (
          messages?.map((msg, i) => (
            <motion.div key={msg.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i < 5 ? i * 0.025 : 0 }}
              className={`flex ${msg.is_own ? "justify-end" : "justify-start"} mb-0.5`}>
              {!msg.is_own && (
                <div className="w-6 h-6 rounded-md shrink-0 flex items-center justify-center text-[9px] font-bold text-white mr-2 mt-auto"
                  style={{ background: "linear-gradient(135deg,#7c5cfc,#f0365a)" }}>
                  {msg.sender_name?.[0]?.toUpperCase() ?? "?"}
                </div>
              )}
              <div className={`max-w-[70%] flex flex-col ${msg.is_own ? "items-end" : "items-start"} gap-0.5`}>
                {!msg.is_own && (
                  <span className="text-[10px] font-medium text-white/30 mx-1">{msg.sender_name}</span>
                )}
                <div className={`px-3.5 py-2 rounded-xl text-[13px] leading-relaxed ${
                  msg.is_own ? "rounded-br-sm" : "rounded-bl-sm"
                }`} style={msg.is_own
                  ? { background: "#7c5cfc" }
                  : { background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.07)" }
                }>
                  {msg.content}
                </div>
                <span className="text-[9px] text-white/18 font-mono mx-1">
                  {msg.sent_at ? new Date(msg.sent_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
                </span>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Input */}
      <div className="px-4 py-3.5 shrink-0" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <form onSubmit={handleSend} className="flex items-center gap-2.5">
          <input type="text" value={content} onChange={e => setContent(e.target.value)}
            placeholder={`Message ${channel.name}…`}
            className="flex-1 px-4 py-3 rounded-xl text-[13px] text-white placeholder:text-white/22 focus:outline-none"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }} />
          <motion.button type="submit" whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
            disabled={!content.trim() || sendMessage.isPending}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white disabled:opacity-30 shrink-0"
            style={{ background: "#7c5cfc" }}>
            <Send className="w-3.5 h-3.5 ml-0.5" />
          </motion.button>
        </form>
      </div>
    </div>
  );
}

/* ── Main page ── */
export default function Messages() {
  const [activeChannel, setActiveChannel] = useState<Channel>(CHANNELS[0]);

  return (
    <Layout>
      <div className="flex overflow-hidden" style={{ height: "100vh" }}>

        {/* ── Channel sidebar ── */}
        <div className="w-52 shrink-0 flex flex-col hidden sm:flex"
          style={{ borderRight: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.015)" }}>

          {/* Header */}
          <div className="px-4 pt-5 pb-4 shrink-0">
            <div className="flex items-center gap-2">
              <h1 className="display text-[32px] text-white leading-none tracking-wide">PULSE</h1>
              <span className="tag tag-live flex items-center gap-1.5 text-[9px]" style={{ padding: "3px 8px" }}>
                <span className="live-dot bg-[#00d4ff]" /> Live
              </span>
            </div>
            <p className="text-[10px] text-white/28 mt-1.5">City-wide ambient chatter</p>
          </div>

          {/* Channels */}
          <div className="flex-1 overflow-y-auto px-2.5 pb-4 space-y-0.5">
            <div className="px-2.5 py-2 text-[9px] font-bold tracking-widest text-white/22 uppercase">Channels</div>
            {CHANNELS.map(ch => {
              const active = activeChannel.id === ch.id;
              return (
                <button key={ch.id} onClick={() => setActiveChannel(ch)}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2.5 rounded-xl text-left transition-all ${
                    active ? "bg-white/8 text-white" : "text-white/38 hover:text-white/65 hover:bg-white/4"
                  }`}>
                  <div className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors ${
                    active ? "bg-primary" : "bg-white/18"
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] font-medium truncate">{ch.name}</div>
                    <div className="text-[10px] text-white/22 truncate">{ch.subtitle}</div>
                  </div>
                  {ch.activeCount > 0 && (
                    <div className="flex items-center gap-0.5 shrink-0">
                      <span className="w-1 h-1 rounded-full bg-emerald-400" />
                      <span className="text-[9px] text-white/25">{ch.activeCount}</span>
                    </div>
                  )}
                </button>
              );
            })}

            {/* Trending topics */}
            <div className="px-2.5 pt-4 pb-2 text-[9px] font-bold tracking-widest text-white/22 uppercase">Trending Topics</div>
            {["#neonafterlife", "#rooftopseason", "#basement4am", "#techno"].map(topic => (
              <div key={topic} className="px-2.5 py-1.5 text-[11px] text-white/28 hover:text-white/50 transition-colors cursor-default">{topic}</div>
            ))}
          </div>
        </div>

        {/* ── Message Feed ── */}
        <AnimatePresence mode="wait">
          <motion.div key={activeChannel.id} className="flex-1 flex flex-col overflow-hidden"
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.2 }}>
            <ChannelFeed channel={activeChannel} />
          </motion.div>
        </AnimatePresence>
      </div>
    </Layout>
  );
}
