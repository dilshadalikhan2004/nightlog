import { Layout } from "@/components/layout";
import { useListMessages, useSendMessage } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Send } from "lucide-react";
import { useState, useRef, useEffect } from "react";

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
      <div className="h-screen flex flex-col max-w-4xl mx-auto">
        <header className="p-4 lg:p-8 pb-4 border-b border-white/5 bg-background/80 backdrop-blur-xl z-10">
          <h1 className="text-4xl font-display font-bold glow-text">Global Pulse</h1>
          <p className="text-muted-foreground text-sm mt-1">Live chatter from the city</p>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-6 flex flex-col-reverse">
          <div ref={endRef} />
          {isLoading ? (
            <div className="flex justify-center"><div className="w-6 h-6 rounded-full border-t-2 border-primary animate-spin" /></div>
          ) : (
            messages?.map((msg) => (
              <div key={msg.id} className={`flex ${msg.is_own ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] md:max-w-[70%] rounded-[1.5rem] px-6 py-4 ${
                  msg.is_own 
                    ? 'bg-primary text-white rounded-br-sm shadow-[0_0_20px_rgba(139,111,255,0.15)]' 
                    : 'glass-card border-white/5 rounded-bl-sm'
                }`}>
                  {!msg.is_own && <div className="text-xs font-bold text-secondary mb-1">{msg.sender_name}</div>}
                  <p className="text-base leading-relaxed">{msg.content}</p>
                  <div className={`text-[10px] mt-2 ${msg.is_own ? 'text-white/60 text-right' : 'text-white/40'}`}>
                    {msg.sent_at ? new Date(msg.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 lg:p-8 bg-background/80 backdrop-blur-xl border-t border-white/5 pb-safe">
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
            className="flex gap-3"
          >
            <input 
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Broadcast to the city..."
              className="flex-1 glass-card border border-white/10 rounded-full px-6 py-4 text-lg focus:outline-none focus:border-primary/50 transition-colors shadow-inner"
            />
            <button 
              type="submit" 
              disabled={!content.trim() || sendMessage.isPending}
              className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-white disabled:opacity-50 hover:scale-105 transition-transform"
            >
              <Send className="w-6 h-6 ml-1" />
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}