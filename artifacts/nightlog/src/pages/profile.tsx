import { Layout } from "@/components/layout";
import { useGetMyProfile, useUpdateMyProfile, useListMemories, useListUsers } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Settings, Moon, Sparkles, Users, Play, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const ENERGY_DATA = [
  { n: "M", v: 72 }, { n: "T", v: 45 }, { n: "W", v: 88 },
  { n: "T", v: 91 }, { n: "F", v: 94 }, { n: "S", v: 97 }, { n: "S", v: 83 },
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
    <Layout><div className="h-screen flex items-center justify-center"><div className="w-7 h-7 rounded-full border-t-2 border-primary animate-spin" /></div></Layout>
  );

  const recentMemories = memories?.slice(0, 3) ?? [];
  const otherUsers = (users?.filter(u => u.id !== profile.id) ?? []).slice(0, 6);

  const stats = [
    { icon: Moon, label: "Nights Out", value: profile.nights_count, color: "#7c5cfc" },
    { icon: Sparkles, label: "Memories", value: profile.memories_count, color: "#00d4ff" },
    { icon: Users, label: "Circles", value: profile.circles_count, color: "#f0365a" },
  ];

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-6 lg:px-10 py-10 lg:py-14 space-y-10 pb-16">

        {/* Identity card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-2xl overflow-hidden p-8"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          {/* Ambient tint */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: profile.avatar_gradient, opacity: 0.06 }} />

          <div className="relative flex flex-col md:flex-row items-start gap-7">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-20 h-20 rounded-2xl overflow-hidden relative flex items-center justify-center text-3xl font-bold text-white"
                style={{ background: profile.avatar_gradient }}>
                {profile.username[0].toUpperCase()}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center"
                style={{ background: "#0a0a0a", borderColor: "#0a0a0a" }}>
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" style={{ boxShadow: "0 0 6px #34d399" }} />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 space-y-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1.5">
                  <h1 className="text-[28px] font-semibold tracking-tight text-white">@{profile.username}</h1>
                  <span className="tag tag-primary">{profile.vibe_label}</span>
                </div>
                <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                  <DialogTrigger asChild>
                    <button className="w-9 h-9 rounded-xl flex items-center justify-center text-white/30 hover:text-white/70 transition-colors"
                      style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
                      <Settings className="w-4 h-4" />
                    </button>
                  </DialogTrigger>
                  <DialogContent className="border-white/8 max-w-sm" style={{ background: "#111" }}>
                    <DialogHeader>
                      <DialogTitle className="text-lg font-semibold tracking-tight">Edit Identity</DialogTitle>
                    </DialogHeader>
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
              <p className="text-[15px] text-white/50 leading-relaxed max-w-md font-light">{profile.bio}</p>
            </div>
          </div>
        </motion.div>

        {/* Stats + Chart */}
        <div className="grid lg:grid-cols-5 gap-4">
          {/* Stat tiles */}
          <div className="lg:col-span-2 space-y-3">
            {stats.map(({ icon: Icon, label, value, color }, i) => (
              <motion.div key={label}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 + 0.1 }}
                className="flex items-center gap-5 px-5 py-4 rounded-2xl"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <div className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center"
                  style={{ background: `${color}18` }}>
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <div>
                  <div className="text-2xl font-semibold tabular-nums" style={{ color }}>{value}</div>
                  <div className="text-[11px] text-white/30 uppercase tracking-widest font-medium">{label}</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Chart */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3 rounded-2xl p-6"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <div className="flex items-center gap-2 mb-5">
              <TrendingUp className="w-4 h-4 text-white/25" />
              <span className="text-[13px] font-medium text-white/40 tracking-tight">Energy This Week</span>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={ENERGY_DATA} barCategoryGap="35%" barSize={20}>
                <XAxis dataKey="n" tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 11, fontFamily: "'DM Mono'" }}
                  axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} hide />
                <Tooltip
                  contentStyle={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, fontSize: 12, color: "#fff" }}
                  cursor={{ fill: "rgba(255,255,255,0.03)" }}
                  formatter={(v: any) => [`${v}%`, ""]}
                />
                <Bar dataKey="v" radius={[4, 4, 0, 0]}>
                  {ENERGY_DATA.map((d, i) => (
                    <Cell key={i} fill={d.v >= 90 ? "#00d4ff" : d.v >= 75 ? "#7c5cfc" : "rgba(124,92,252,0.3)"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Recent memories */}
        {recentMemories.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[15px] font-semibold text-white/50">Recent Replays</h2>
              <Link href="/memories"><span className="text-[13px] text-white/25 hover:text-white/50 transition-colors">View all</span></Link>
            </div>
            <div className="grid md:grid-cols-3 gap-3">
              {recentMemories.map((memory, i) => (
                <Link key={memory.id} href={`/memories/${memory.id}`}>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 + 0.3 }}
                    whileHover={{ y: -2 }}
                    className="group p-4 rounded-2xl cursor-pointer transition-colors"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                        style={{ background: "rgba(124,92,252,0.12)" }}>
                        <Play className="w-3.5 h-3.5 text-primary ml-0.5" />
                      </div>
                      <span className="font-mono text-[11px] text-white/25">{memory.energy_score}%</span>
                    </div>
                    <h4 className="text-[14px] font-semibold text-white/80 group-hover:text-white transition-colors mb-1 leading-tight">{memory.title}</h4>
                    <p className="text-[12px] text-white/30">{memory.night_date} · {memory.moments_count} moments</p>
                  </motion.div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Circles */}
        {otherUsers.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-[15px] font-semibold text-white/50">Your Circles</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {otherUsers.map((user, i) => (
                <motion.div key={user.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 + 0.4 }}
                  className="flex items-center gap-3.5 px-4 py-3.5 rounded-2xl"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <div className="w-9 h-9 rounded-xl shrink-0 flex items-center justify-center text-sm font-semibold text-white"
                    style={{ background: user.avatar_gradient }}>
                    {user.username[0].toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[13px] font-medium text-white/75 truncate">@{user.username}</div>
                    <div className="text-[11px] text-white/30 truncate">{user.nights_count} nights · {user.memories_count} memories</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
}
