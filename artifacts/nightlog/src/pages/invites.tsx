import { Layout } from "@/components/layout";
import { useListInvites, useAcceptInvite, useDeclineInvite, useCreateInvite, useListUsers, useListEvents } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Check, X, Send, Users } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function Invites() {
  const queryClient = useQueryClient();
  const { data: invites, isLoading } = useListInvites();
  const acceptInvite = useAcceptInvite();
  const declineInvite = useDeclineInvite();
  
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [recipientUsername, setRecipientUsername] = useState("");
  const [message, setMessage] = useState("");
  const createInvite = useCreateInvite();

  const { data: users } = useListUsers();
  const { data: events } = useListEvents({ filter: 'tonight' });

  const pendingInvites = invites?.filter(i => i.status === 'pending') || [];
  const pastInvites = invites?.filter(i => i.status !== 'pending') || [];

  return (
    <Layout>
      <div className="p-4 lg:p-8 max-w-4xl mx-auto space-y-12">
        <header className="space-y-4 pt-8 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-display font-bold glow-text">Tonight's Circle</h1>
            <p className="text-muted-foreground text-lg">Who are you running with tonight?</p>
          </div>
          <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
            <DialogTrigger asChild>
              <button className="px-6 py-3 bg-primary text-white rounded-full font-bold shadow-[0_0_20px_rgba(139,111,255,0.3)] hover:scale-105 transition-transform flex items-center gap-2">
                <Send className="w-4 h-4" /> Send Invite
              </button>
            </DialogTrigger>
            <DialogContent className="glass-card border-white/10 sm:max-w-md bg-[#05050d]">
              <DialogHeader>
                <DialogTitle className="text-2xl font-display glow-text">Invite to Circle</DialogTitle>
              </DialogHeader>
              <div className="space-y-6 pt-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-white/70">Select Event</label>
                  <select 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white appearance-none"
                    value={selectedEventId}
                    onChange={(e) => setSelectedEventId(e.target.value)}
                  >
                    <option value="" disabled>Choose an event...</option>
                    {events?.map(e => <option key={e.id} value={e.id} className="bg-background">{e.title}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-white/70">Recipient Username</label>
                  <input 
                    type="text"
                    value={recipientUsername}
                    onChange={(e) => setRecipientUsername(e.target.value)}
                    placeholder="e.g. nightowl"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-white/70">Message (Optional)</label>
                  <input 
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Let's link up..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50"
                  />
                </div>
                <button 
                  disabled={!selectedEventId || !recipientUsername || createInvite.isPending}
                  onClick={() => {
                    createInvite.mutate({ data: { event_id: parseInt(selectedEventId), recipient_username: recipientUsername, message } }, {
                      onSuccess: () => {
                        setIsInviteOpen(false);
                        setSelectedEventId("");
                        setRecipientUsername("");
                        setMessage("");
                      }
                    })
                  }}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl disabled:opacity-50 transition-colors"
                >
                  {createInvite.isPending ? "Sending..." : "Send Invite"}
                </button>
              </div>
            </DialogContent>
          </Dialog>
        </header>

        {isLoading ? (
          <div className="space-y-4">
             {[1,2,3].map(i => <div key={i} className="h-24 rounded-[1.5rem] glass-card animate-pulse" />)}
          </div>
        ) : (
          <div className="space-y-12">
            {pendingInvites.length > 0 && (
              <section className="space-y-6">
                <h2 className="text-2xl font-display font-bold flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  Pending Invites
                </h2>
                <div className="grid gap-4">
                  {pendingInvites.map((invite) => (
                    <motion.div key={invite.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 rounded-[1.5rem] border-primary/20 bg-primary/5 flex flex-col sm:flex-row gap-6 justify-between items-center shadow-[inset_0_0_20px_rgba(139,111,255,0.05)]">
                      <div className="space-y-2 text-center sm:text-left">
                        <div className="flex items-center gap-2 justify-center sm:justify-start">
                          <Users className="w-4 h-4 text-primary" />
                          <span className="font-medium text-white/80">{invite.sender_name} invited you</span>
                        </div>
                        <h3 className="text-xl font-display font-bold">{invite.event_title}</h3>
                        {invite.message && <p className="text-sm text-white/60 italic">"{invite.message}"</p>}
                      </div>
                      <div className="flex gap-3">
                        <button 
                          onClick={() => declineInvite.mutate({ id: invite.id }, { onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/invites"] }) })}
                          className="w-12 h-12 rounded-full glass-card border-white/10 flex items-center justify-center text-white/50 hover:text-destructive hover:border-destructive/50 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => acceptInvite.mutate({ id: invite.id }, { onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/invites"] }) })}
                          className="px-6 h-12 rounded-full bg-primary text-white font-bold flex items-center gap-2 hover:scale-105 transition-transform shadow-[0_0_15px_rgba(139,111,255,0.3)]"
                        >
                          <Check className="w-5 h-5" /> Accept
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            <section className="space-y-6">
              <h2 className="text-2xl font-display font-bold">Circle History</h2>
              {pastInvites.length === 0 ? (
                <div className="text-center py-12 glass-card rounded-[2rem] border-white/5">
                  <p className="text-white/50">No past invites</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {pastInvites.map((invite) => (
                    <div key={invite.id} className="glass-card p-5 rounded-[1.5rem] border-white/5 flex justify-between items-center opacity-60">
                      <div>
                        <span className="text-sm text-white/50">{invite.sender_name} invited you to</span>
                        <h3 className="font-bold">{invite.event_title}</h3>
                      </div>
                      <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${invite.status === 'accepted' ? 'border-secondary/30 text-secondary bg-secondary/10' : 'border-white/10 text-white/50'}`}>
                        {invite.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </Layout>
  );
}