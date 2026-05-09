import { Layout } from "@/components/layout";
import { useListMessages, useSendMessage } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Send } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Messages() {
  const queryClient = useQueryClient();
  const { data: messages, isLoading } = useListMessages({}, { query: { queryKey: ["messages", "global"] } });
  const sendMessage = useSendMessage();
  const [content, setContent] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Layout>
      <div className="h-screen flex flex-col max-w-3xl mx-auto">

        {/* Header */}
        <header className="px-6 lg:px-10 pt-8 pb-5 shrink-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center gap-3">
            <h1 className="display text-[48px] text-white leading-none tracking-wide">Pulse</h1>
            <span className="tag tag-live flex items-center gap-1.5 mt-1">
              <span className="live-dot bg-[#00d4ff]" /> Live
            </span>
          </div>
          <p className="text-[13px] text-white/30 mt-1.5 font-light">City-wide ambient chatter</p>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 lg:px-10 py-6 flex flex-col-reverse gap-3">
          <div ref={endRef} />
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="w-5 h-5 rounded-full border-t-2 border-primary animate-spin" />
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {messages?.map((msg, i) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.02 }}
                  className={`flex ${msg.is_own ? "justify-end" : "justify-start"} mb-1`}
                >
                  {!msg.is_own && (
                    <div className="w-7 h-7 rounded-lg shrink-0 flex items-center justify-center text-xs font-semibold text-white mr-2.5 mt-auto"
                      style={{ background: "linear-gradient(135deg,#7c5cfc,#f0365a)" }}>
                      {msg.sender_name?.[0]?.toUpperCase() ?? "?"}
                    </div>
                  )}
                  <div className={`max-w-[72%] ${msg.is_own ? "items-end" : "items-start"} flex flex-col gap-1`}>
                    {!msg.is_own && (
                      <span className="text-[11px] font-medium text-white/35 ml-1">{msg.sender_name}</span>
                    )}
                    <div className={`px-4 py-3 rounded-2xl text-[14px] leading-relaxed ${
                      msg.is_own
                        ? "text-white rounded-br-sm"
                        : "text-white/85 rounded-bl-sm"
                    }`} style={msg.is_own
                      ? { background: "#7c5cfc", boxShadow: "0 2px 12px rgba(124,92,252,0.2)" }
                      : { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.07)" }
                    }>
                      {msg.content}
                    </div>
                    <span className="text-[10px] text-white/20 font-mono mx-1">
                      {msg.sent_at ? new Date(msg.sent_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Input */}
        <div className="px-6 lg:px-10 py-5 shrink-0" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (content.trim()) {
                sendMessage.mutate({ data: { content } }, {
                  onSuccess: () => {
                    setContent("");
                    queryClient.invalidateQueries({ queryKey: ["messages", "global"] });
                  }
                });
              }
            }}
            className="flex items-center gap-3"
          >
            <input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Broadcast to the city..."
              className="flex-1 px-5 py-3.5 rounded-2xl text-[14px] text-white placeholder:text-white/25 focus:outline-none transition-colors"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
            />
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={!content.trim() || sendMessage.isPending}
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-white disabled:opacity-30 transition-opacity shrink-0"
              style={{ background: "#7c5cfc" }}
            >
              <Send className="w-4 h-4 ml-0.5" />
            </motion.button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
