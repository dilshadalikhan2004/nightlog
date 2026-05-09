import { Layout } from "@/components/layout";
import { useListInvites, useAcceptInvite, useDeclineInvite, useCreateInvite, useListEvents } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Check, X, Plus } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function Invites() {
  const queryClient = useQueryClient();
  const { data: invites, isLoading } = useListInvites();
  const acceptInvite = useAcceptInvite();
  const declineInvite = useDeclineInvite();

  const [isOpen, setIsOpen] = useState(false);
  const [eventId, setEventId] = useState("");
  const [recipient, setRecipient] = useState("");
  const [msg, setMsg] = useState("");
  const createInvite = useCreateInvite();
  const { data: events } = useListEvents({ filter: "tonight" });

  const pending = invites?.filter(i => i.status === "pending") ?? [];
  const past = invites?.filter(i => i.status !== "pending") ?? [];

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["/api/invites"] });

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-6 lg:px-10 py-10 lg:py-14 space-y-10 pb-16">

        {/* Header */}
        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <h1 className="display text-[72px] text-white leading-none tracking-wide">Circle</h1>
            <p className="text-[14px] text-white/30 font-light">Who are you running with tonight?</p>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold text-white mb-2"
                style={{ background: "#7c5cfc", boxShadow: "0 0 0 1px rgba(124,92,252,0.3)" }}>
                <Plus className="w-4 h-4" /> Send Invite
              </motion.button>
            </DialogTrigger>
            <DialogContent className="border-white/8 max-w-sm" style={{ background: "#111" }}>
              <DialogHeader>
                <DialogTitle className="text-lg font-semibold tracking-tight">Send Invite</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                {[
                  { label: "Recipient", val: recipient, set: setRecipient, ph: "username..." },
                  { label: "Message", val: msg, set: setMsg, ph: "Let's link up..." },
                ].map(({ label, val, set, ph }) => (
                  <div key={label} className="space-y-1.5">
                    <label className="text-[11px] font-medium tracking-widest uppercase text-white/30">{label}</label>
                    <input value={val} onChange={e => set(e.target.value)} placeholder={ph}
                      className="w-full rounded-xl px-4 py-2.5 text-[14px] text-white placeholder:text-white/20 focus:outline-none"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }} />
                  </div>
                ))}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-medium tracking-widest uppercase text-white/30">Event</label>
                  <select value={eventId} onChange={e => setEventId(e.target.value)}
                    className="w-full rounded-xl px-4 py-2.5 text-[14px] text-white focus:outline-none appearance-none"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <option value="" style={{ background: "#111" }}>Choose an event…</option>
                    {events?.map(e => <option key={e.id} value={e.id} style={{ background: "#111" }}>{e.title}</option>)}
                  </select>
                </div>
                <button
                  disabled={!eventId || !recipient || createInvite.isPending}
                  onClick={() => createInvite.mutate({ data: { event_id: parseInt(eventId), recipient_username: recipient, message: msg } }, {
                    onSuccess: () => { setIsOpen(false); setEventId(""); setRecipient(""); setMsg(""); }
                  })}
                  className="w-full py-2.5 rounded-xl text-[14px] font-semibold text-white disabled:opacity-40"
                  style={{ background: "#7c5cfc" }}>
                  {createInvite.isPending ? "Sending..." : "Send"}
                </button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-20 rounded-2xl animate-pulse" style={{ background: "rgba(255,255,255,0.04)" }} />)}</div>
        ) : (
          <div className="space-y-10">

            {/* Pending */}
            {pending.length > 0 && (
              <section className="space-y-3">
                <div className="flex items-center gap-2 mb-4">
                  <span className="live-dot bg-primary" />
                  <span className="text-[13px] font-medium text-white/40 uppercase tracking-widest">Pending · {pending.length}</span>
                </div>
                {pending.map((invite, i) => (
                  <motion.div key={invite.id}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                    className="flex items-center gap-5 p-5 rounded-2xl"
                    style={{ background: "rgba(124,92,252,0.07)", border: "1px solid rgba(124,92,252,0.15)" }}
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-primary shrink-0"
                      style={{ background: "rgba(124,92,252,0.15)" }}>
                      {invite.sender_name?.[0]?.toUpperCase() ?? "?"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] text-white/35 mb-0.5">{invite.sender_name} invited you</p>
                      <h3 className="text-[16px] font-semibold text-white tracking-tight leading-tight">{invite.event_title}</h3>
                      {invite.message && <p className="text-[12px] text-white/35 mt-1 italic">"{invite.message}"</p>}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => declineInvite.mutate({ id: invite.id }, { onSuccess: invalidate })}
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-white/30 hover:text-white/60 transition-colors"
                        style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
                        <X className="w-4 h-4" />
                      </button>
                      <button onClick={() => acceptInvite.mutate({ id: invite.id }, { onSuccess: invalidate })}
                        className="flex items-center gap-1.5 px-4 h-9 rounded-xl text-[13px] font-semibold text-white"
                        style={{ background: "#7c5cfc" }}>
                        <Check className="w-3.5 h-3.5" /> Accept
                      </button>
                    </div>
                  </motion.div>
                ))}
              </section>
            )}

            {/* History */}
            <section className="space-y-0">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[13px] font-medium text-white/25 uppercase tracking-widest">History</span>
              </div>
              {past.length === 0 ? (
                <div className="py-12 text-center text-[14px] text-white/20">No past invites yet</div>
              ) : (
                past.map((invite, i) => (
                  <div key={invite.id}
                    className="flex items-center gap-4 py-3.5 border-b border-white/5"
                  >
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold text-white/40 shrink-0"
                      style={{ background: "rgba(255,255,255,0.05)" }}>
                      {invite.sender_name?.[0]?.toUpperCase() ?? "?"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] text-white/40 truncate">{invite.sender_name} — {invite.event_title}</p>
                    </div>
                    <span className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-lg ${
                      invite.status === "accepted"
                        ? "text-[#00d4ff]"
                        : "text-white/25"
                    }`} style={{ background: invite.status === "accepted" ? "rgba(0,212,255,0.08)" : "rgba(255,255,255,0.04)" }}>
                      {invite.status}
                    </span>
                  </div>
                ))
              )}
            </section>
          </div>
        )}
      </div>
    </Layout>
  );
}
