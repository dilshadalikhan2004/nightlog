import { Layout } from "@/components/layout";
import { useGetMyProfile, useUpdateMyProfile, useListMemories, useListUsers } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Settings, Moon, Sparkles, Users, Play, TrendingUp, Calendar, Activity } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const ENERGY_DATA = [
  { n: "M", v: 72 }, { n: "T", v: 45 }, { n: "W", v: 88 },
  { n: "T", v: 91 }, { n: "F", v: 94 }, { n: "S", v: 97 }, { n: "S", v: 83 },
];

/* Fake activity heatmap (8 weeks × 7 days) */
const HEATMAP = Array.from({ length: 56 }, (_, i) => {
  const rand = Math.random();
  if (rand > 0.7) return "high";
  if (rand > 0.45) return "mid";
  if (rand > 0.28) return "low";
  return "none";
});

const HEAT_COLOR: Record<string, string> = {
  none: "rgba(255,255,255,0.05)",
  low:  "rgba(124,92,252,0.25)",
  mid:  "rgba(124,92,252,0.55)",
  high: "#7c5cfc",
};

const RECENT_NIGHTS = [
  { title: "Neon Afterlife", venue: "Skyline Rooftop", date: "Last Thursday", energy: 97, people: 247 },
  { title: "Vault Descent", venue: "The Bunker", date: "Last Saturday", energy: 91, people: 124 },
  { title: "Midnight Echo", venue: "Crystal Basement", date: "Last Friday", energy: 94, people: 156 },
  { title: "Skyline Pulse", venue: "Neon Deck", date: "2 weeks ago", energy: 88, people: 203 },
];

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
    if (profile) { setUsername(profile.username); setBio(profile.bio); setVibeLabel(profile.vibe_label); }
  }, [profile]);

  if (isLoading || !profile) return (
    <Layout><div className="h-screen flex items-center justify-center"><div className="w-6 h-6 rounded-full border-t-2 border-primary animate-spin" /></div></Layout>
  );

  const recentMemories = memories?.slice(0, 3) ?? [];
  const otherUsers = (users?.filter(u => u.id !== profile.id) ?? []).slice(0, 8);

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-6 lg:px-8 py-6 pb-16 space-y-5">

        {/* ── Identity header (compact) ── */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="relative rounded-2xl overflow-hidden px-5 py-5"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="absolute inset-0 pointer-events-none" style={{ background: profile.avatar_gradient, opacity: 0.05 }} />
          <div className="relative flex items-center gap-4">
            <div className="relative shrink-0">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold text-white"
                style={{ background: profile.avatar_gradient }}>{profile.username[0].toUpperCase()}</div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-[#0a0a0a] bg-emerald-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-[20px] font-semibold tracking-tight text-white">@{profile.username}</h1>
                <span className="tag tag-primary text-[9px]" style={{ padding: "3px 8px" }}>{profile.vibe_label}</span>
              </div>
              <p className="text-[13px] text-white/42 mt-1 leading-relaxed line-clamp-1">{profile.bio}</p>
            </div>

            {/* Inline stats */}
            <div className="hidden md:flex items-center gap-0 shrink-0" style={{ borderLeft: "1px solid rgba(255,255,255,0.06)", paddingLeft: "20px" }}>
              {[
                { icon: Moon, label: "Nights", value: profile.nights_count, color: "#7c5cfc" },
                { icon: Sparkles, label: "Memories", value: profile.memories_count, color: "#00d4ff" },
                { icon: Users, label: "Circles", value: profile.circles_count, color: "#f0365a" },
              ].map(({ icon: Icon, label, value, color }, i) => (
                <div key={label} className={`flex flex-col items-center gap-0.5 px-5 ${i < 2 ? "border-r" : ""}`}
                  style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                  <span className="text-[22px] font-semibold tabular-nums" style={{ color }}>{value}</span>
                  <span className="text-[9px] text-white/25 uppercase tracking-widest">{label}</span>
                </div>
              ))}
            </div>

            {/* Edit */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
              <DialogTrigger asChild>
                <button className="w-8 h-8 rounded-xl flex items-center justify-center text-white/28 hover:text-white/65 transition-colors shrink-0"
                  style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
                  <Settings className="w-3.5 h-3.5" />
                </button>
              </DialogTrigger>
              <DialogContent className="border-white/8 max-w-sm" style={{ background: "#111" }}>
                <DialogHeader><DialogTitle className="text-lg font-semibold tracking-tight">Edit Identity</DialogTitle></DialogHeader>
                <div className="space-y-4 pt-2">
                  {[
                    { label: "Username", val: username, set: setUsername },
                    { label: "Bio", val: bio, set: setBio },
                    { label: "Vibe Label", val: vibeLabel, set: setVibeLabel },
                  ].map(({ label, val, set }) => (
                    <div key={label} className="space-y-1.5">
                      <label className="text-[11px] font-medium tracking-widest uppercase text-white/30">{label}</label>
                      <input value={val} onChange={e => set(e.target.value)}
                        className="w-full rounded-xl px-4 py-2.5 text-[14px] text-white focus:outline-none"
                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }} />
                    </div>
                  ))}
                  <button
                    onClick={() => updateProfile.mutate({ data: { username, bio, vibe_label: vibeLabel } }, {
                      onSuccess: () => { setIsEditOpen(false); queryClient.invalidateQueries({ queryKey: ["/api/users/me"] }); }
                    })}
                    disabled={updateProfile.isPending}
                    className="w-full py-2.5 rounded-xl text-[14px] font-semibold text-white disabled:opacity-40"
                    style={{ background: "#7c5cfc" }}>
                    {updateProfile.isPending ? "Saving..." : "Save"}
                  </button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>

        {/* ── Two-column content ── */}
        <div className="grid lg:grid-cols-[1fr_300px] gap-5">

          {/* Left col */}
          <div className="space-y-5">

            {/* Energy chart + heatmap */}
            <div className="grid grid-cols-2 gap-5">
              <div className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-3.5 h-3.5 text-white/25" />
                  <span className="text-[11px] font-medium text-white/35 tracking-tight">Energy This Week</span>
                </div>
                <ResponsiveContainer width="100%" height={120}>
                  <BarChart data={ENERGY_DATA} barCategoryGap="30%" barSize={16}>
                    <XAxis dataKey="n" tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 10, fontFamily: "'DM Mono'" }}
                      axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, fontSize: 11, color: "#fff" }}
                      cursor={{ fill: "rgba(255,255,255,0.03)" }}
                      formatter={(v: number) => [`${v}%`, ""]} />
                    <Bar dataKey="v" radius={[3, 3, 0, 0]}>
                      {ENERGY_DATA.map((d, i) => (
                        <Cell key={i} fill={d.v >= 90 ? "#00d4ff" : d.v >= 75 ? "#7c5cfc" : "rgba(124,92,252,0.3)"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-3.5 h-3.5 text-white/25" />
                  <span className="text-[11px] font-medium text-white/35 tracking-tight">Night Activity</span>
                </div>
                <div className="grid gap-1" style={{ gridTemplateColumns: "repeat(8, 1fr)" }}>
                  {HEATMAP.map((level, i) => (
                    <div key={i} className="rounded-sm aspect-square"
                      style={{ background: HEAT_COLOR[level] }} />
                  ))}
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-[9px] text-white/20">8 weeks</span>
                  <div className="flex items-center gap-1">
                    {["none", "low", "mid", "high"].map(l => (
                      <div key={l} className="w-2.5 h-2.5 rounded-sm" style={{ background: HEAT_COLOR[l] }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Recent nights timeline */}
            <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex items-center justify-between px-5 py-3.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-white/25" />
                  <span className="text-[12px] font-semibold text-white/45">Recent Nights</span>
                </div>
                <Link href="/memories"><span className="text-[11px] text-white/25 hover:text-white/50 transition-colors">Archive →</span></Link>
              </div>
              {RECENT_NIGHTS.map((night, i) => (
                <div key={night.title} className="flex items-center gap-4 px-5 py-3.5"
                  style={{ borderBottom: i < RECENT_NIGHTS.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                  <div className="w-8 h-8 rounded-xl shrink-0 flex items-center justify-center"
                    style={{ background: "rgba(124,92,252,0.12)" }}>
                    <Moon className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-semibold text-white/80 truncate">{night.title}</div>
                    <div className="text-[11px] text-white/30 truncate">{night.venue} · {night.date}</div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 text-[11px]">
                    <span className="text-white/30">{night.people} people</span>
                    <span className="font-mono font-semibold" style={{ color: night.energy >= 90 ? "#00d4ff" : "#7c5cfc" }}>{night.energy}%</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Memory replays */}
            {recentMemories.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-semibold text-white/40 tracking-widest uppercase">Memory Replays</span>
                  <Link href="/memories"><span className="text-[11px] text-white/25 hover:text-white/50 transition-colors">View all</span></Link>
                </div>
                <div className="grid sm:grid-cols-3 gap-3">
                  {recentMemories.map((memory, i) => (
                    <Link key={memory.id} href={`/memories/${memory.id}`}>
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.07 + 0.1 }}
                        whileHover={{ y: -2 }}
                        className="group p-3.5 rounded-2xl cursor-pointer"
                        style={{ background: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,255,255,0.07)" }}>
                        <div className="flex items-center justify-between mb-2.5">
                          <div className="w-7 h-7 rounded-xl flex items-center justify-center"
                            style={{ background: "rgba(124,92,252,0.14)" }}>
                            <Play className="w-3 h-3 text-primary ml-0.5" />
                          </div>
                          <span className="font-mono text-[11px] text-white/22">{memory.energy_score}%</span>
                        </div>
                        <h4 className="text-[13px] font-semibold text-white/75 group-hover:text-white transition-colors leading-tight mb-0.5">{memory.title}</h4>
                        <p className="text-[11px] text-white/28">{memory.night_date} · {memory.moments_count} moments</p>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right col — Circles */}
          <div className="space-y-5">
            <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex items-center gap-2 px-4 py-3.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <Users className="w-3.5 h-3.5 text-white/25" />
                <span className="text-[12px] font-semibold text-white/45">Your Circles</span>
                <span className="ml-auto font-mono text-[11px] text-white/25">{otherUsers.length}</span>
              </div>
              <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                {otherUsers.map((user, i) => {
                  const isOnline = i % 3 === 0;
                  return (
                    <motion.div key={user.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.04 }}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-white/3 transition-colors">
                      <div className="relative shrink-0">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold text-white"
                          style={{ background: user.avatar_gradient }}>
                          {user.username[0].toUpperCase()}
                        </div>
                        {isOnline && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-[#0a0a0a] bg-emerald-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[12px] font-medium text-white/70 truncate">@{user.username}</div>
                        <div className="text-[10px] text-white/28 truncate">{user.nights_count} nights</div>
                      </div>
                      <div className="text-[10px] font-medium shrink-0" style={{ color: isOnline ? "#34d399" : "rgba(255,255,255,0.18)" }}>
                        {isOnline ? "out" : "offline"}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Quick stats tile */}
            <div className="rounded-2xl p-4 space-y-3" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <span className="text-[11px] font-semibold text-white/35 tracking-widest uppercase">All-time</span>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Total nights", value: profile.nights_count, color: "#7c5cfc" },
                  { label: "Memories", value: profile.memories_count, color: "#00d4ff" },
                  { label: "Circles", value: profile.circles_count, color: "#f0365a" },
                  { label: "Avg energy", value: "89%", color: "#fbbf24" },
                ].map(({ label, value, color }) => (
                  <div key={label} className="space-y-0.5">
                    <div className="text-[9px] text-white/22 uppercase tracking-widest">{label}</div>
                    <div className="text-[20px] font-semibold tabular-nums" style={{ color }}>{value}</div>
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
