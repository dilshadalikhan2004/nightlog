import { Layout } from "@/components/layout";
import { useGetMyProfile, useUpdateMyProfile, useListMemories, useListUsers } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Settings, Moon, Sparkles, Users, Flame, Play, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const energyHistory = [
  { night: "Mon", energy: 72 },
  { night: "Tue", energy: 45 },
  { night: "Wed", energy: 88 },
  { night: "Thu", energy: 91 },
  { night: "Fri", energy: 94 },
  { night: "Sat", energy: 97 },
  { night: "Sun", energy: 83 },
];

function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(value / 30);
    const t = setInterval(() => {
      start += step;
      if (start >= value) { setDisplay(value); clearInterval(t); }
      else setDisplay(start);
    }, 30);
    return () => clearInterval(t);
  }, [value]);
  return <>{display}</>;
}

export default function Profile() {
  const queryClient = useQueryClient();
  const { data: profile, isLoading } = useGetMyProfile();
  const { data: memories } = useListMemories();
  const { data: users } = useListUsers();
  const updateProfile = useUpdateMyProfile();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [vibeLabel, setVibeLabel] = useState("");

  useEffect(() => {
    if (profile) {
      setUsername(profile.username);
      setBio(profile.bio);
      setVibeLabel(profile.vibe_label);
    }
  }, [profile]);

  if (isLoading || !profile) return (
    <Layout><div className="h-screen flex items-center justify-center"><div className="w-8 h-8 rounded-full border-t-2 border-primary animate-spin" /></div></Layout>
  );

  const recentMemories = memories?.slice(0, 3) ?? [];
  const otherUsers = users?.filter(u => u.id !== profile.id) ?? [];

  return (
    <Layout>
      <div className="p-4 lg:p-8 max-w-5xl mx-auto space-y-8 pb-16">

        {/* Cinematic ID Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-[3rem] overflow-hidden border border-white/10 p-8 lg:p-12"
          style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(30px)" }}
        >
          <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ background: profile.avatar_gradient || "linear-gradient(135deg,#8b6fff,#00d4ff)" }} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#05050d] via-transparent to-transparent pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8 text-center md:text-left">
            <div className="relative">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white/10 shadow-2xl overflow-hidden relative">
                <div className="absolute inset-0" style={{ background: profile.avatar_gradient || "linear-gradient(135deg,#8b6fff,#00d4ff)" }} />
                <div className="absolute inset-0 flex items-center justify-center text-4xl font-display font-bold text-white/80">
                  {profile.username[0].toUpperCase()}
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-green-400 border-2 border-[#05050d] shadow-[0_0_10px_rgba(74,222,128,0.6)]" />
            </div>

            <div className="flex-1 space-y-4">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div className="space-y-3">
                  <h1 className="text-4xl md:text-5xl font-display font-bold leading-none" style={{ textShadow: "0 0 40px rgba(139,111,255,0.5)" }}>
                    @{profile.username}
                  </h1>
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10">
                    <Flame className="w-3.5 h-3.5 text-primary" />
                    <span className="text-primary text-xs font-bold tracking-widest uppercase">{profile.vibe_label}</span>
                  </div>
                </div>

                <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                  <DialogTrigger asChild>
                    <button className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all mx-auto md:mx-0">
                      <Settings className="w-5 h-5" />
                    </button>
                  </DialogTrigger>
                  <DialogContent className="border-white/10 bg-[#08081a]">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-display" style={{ textShadow: "0 0 20px rgba(139,111,255,0.5)" }}>Edit Night Identity</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      {[
                        { label: "Username", val: username, set: setUsername, ph: "your handle" },
                        { label: "Bio", val: bio, set: setBio, ph: "what you do after dark" },
                        { label: "Vibe Label", val: vibeLabel, set: setVibeLabel, ph: "your energy in words" },
                      ].map(({ label, val, set, ph }) => (
                        <div key={label} className="space-y-1.5">
                          <label className="text-xs font-bold text-white/40 uppercase tracking-wider">{label}</label>
                          <input value={val} onChange={e => set(e.target.value)} placeholder={ph}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50 transition-colors" />
                        </div>
                      ))}
                      <button
                        onClick={() => {
                          updateProfile.mutate({ data: { username, bio, vibe_label: vibeLabel } }, {
                            onSuccess: () => { setIsEditOpen(false); queryClient.invalidateQueries({ queryKey: ["/api/users/me"] }); }
                          });
                        }}
                        disabled={updateProfile.isPending}
                        className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50 shadow-[0_0_20px_rgba(139,111,255,0.3)]">
                        {updateProfile.isPending ? "Saving..." : "Save Identity"}
                      </button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <p className="text-lg text-white/70 max-w-lg">{profile.bio}</p>
            </div>
          </div>
        </motion.div>

        {/* Stats + Chart row */}
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Stats */}
          <div className="lg:col-span-2 grid grid-cols-3 lg:grid-cols-1 gap-4">
            {[
              { icon: Moon, label: "Nights Out", value: profile.nights_count, color: "text-primary", bg: "bg-primary/10" },
              { icon: Sparkles, label: "Memories", value: profile.memories_count, color: "text-secondary", bg: "bg-secondary/10" },
              { icon: Users, label: "Circles", value: profile.circles_count, color: "text-[#ff4d9a]", bg: "bg-[#ff4d9a]/10" },
            ].map(({ icon: Icon, label, value, color, bg }, i) => (
              <motion.div key={label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 + 0.2 }}
                className="glass-card rounded-[1.5rem] p-6 border border-white/5 hover:border-white/10 transition-all space-y-3 text-center lg:text-left lg:flex lg:items-center lg:gap-5"
              >
                <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center ${color} shrink-0 mx-auto lg:mx-0`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <div className={`text-3xl font-display font-bold ${color}`}>
                    <AnimatedNumber value={value} />
                  </div>
                  <div className="text-white/40 text-xs uppercase tracking-widest font-bold mt-0.5">{label}</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Energy History Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-3 glass-card rounded-[2rem] p-6 border border-white/5"
          >
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h3 className="font-display font-bold text-lg">Night Energy This Week</h3>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={energyHistory} barCategoryGap="30%">
                <XAxis dataKey="night" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 10 }} axisLine={false} tickLine={false} width={28} />
                <Tooltip
                  contentStyle={{ background: "rgba(8,8,26,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "#fff", fontSize: 12 }}
                  cursor={{ fill: "rgba(255,255,255,0.03)" }}
                  formatter={(v: any) => [`${v}%`, "Energy"]}
                />
                <Bar dataKey="energy" radius={[6, 6, 0, 0]}>
                  {energyHistory.map((entry, i) => (
                    <Cell key={i} fill={entry.energy >= 90 ? "#00d4ff" : entry.energy >= 75 ? "#8b6fff" : "rgba(139,111,255,0.4)"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Recent Memories */}
        {recentMemories.length > 0 && (
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-display font-bold">Recent Replays</h2>
              <Link href="/memories" className="text-sm text-primary/70 hover:text-primary transition-colors">View all</Link>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {recentMemories.map((memory, i) => (
                <Link key={memory.id} href={`/memories/${memory.id}`}>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 + 0.5 }}
                    className="group glass-card rounded-2xl p-5 border border-white/5 hover:border-primary/20 transition-all duration-300 hover:shadow-[0_0_20px_rgba(139,111,255,0.1)] cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Play className="w-4 h-4 text-primary ml-0.5" />
                      </div>
                      <span className="text-xs text-white/30 font-mono">{memory.energy_score}%</span>
                    </div>
                    <h4 className="font-display font-bold mb-1 group-hover:text-primary transition-colors">{memory.title}</h4>
                    <p className="text-xs text-white/40">{memory.night_date} · {memory.moments_count} moments</p>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.section>
        )}

        {/* Social Circles */}
        {otherUsers.length > 0 && (
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="space-y-5">
            <h2 className="text-xl font-display font-bold">Your Circles</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {otherUsers.map((user, i) => (
                <motion.div key={user.id}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 + 0.55 }}
                  className="glass-card rounded-2xl p-4 border border-white/5 flex items-center gap-4 hover:border-white/10 transition-all"
                >
                  <div className="w-12 h-12 rounded-full shrink-0 relative overflow-hidden" style={{ background: user.avatar_gradient }}>
                    <div className="absolute inset-0 flex items-center justify-center text-lg font-display font-bold text-white/80">
                      {user.username[0].toUpperCase()}
                    </div>
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-sm truncate">@{user.username}</div>
                    <div className="text-xs text-white/40 truncate">{user.vibe_label}</div>
                    <div className="flex gap-3 mt-1.5 text-xs text-white/30">
                      <span>{user.nights_count} nights</span>
                      <span>{user.memories_count} memories</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </Layout>
  );
}
