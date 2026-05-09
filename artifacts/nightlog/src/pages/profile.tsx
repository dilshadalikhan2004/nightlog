import { Layout } from "@/components/layout";
import { useGetMyProfile, useUpdateMyProfile } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { User as UserIcon, Settings, Moon, Sparkles, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function Profile() {
  const queryClient = useQueryClient();
  const { data: profile, isLoading } = useGetMyProfile();
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

  if (isLoading || !profile) return <Layout><div className="h-screen flex items-center justify-center"><div className="w-8 h-8 rounded-full border-t-2 border-primary animate-spin" /></div></Layout>;

  return (
    <Layout>
      <div className="p-4 lg:p-8 max-w-4xl mx-auto space-y-8">
        
        {/* Cinematic ID Card */}
        <div className="relative rounded-[3rem] overflow-hidden glass-card border-white/10 p-8 lg:p-12">
          <div className="absolute inset-0 opacity-40 pointer-events-none mix-blend-screen" style={{ background: profile.avatar_gradient || "linear-gradient(to right, var(--primary), var(--secondary))" }} />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8 text-center md:text-left">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-background shadow-2xl relative overflow-hidden">
               <div className="absolute inset-0" style={{ background: profile.avatar_gradient || "linear-gradient(to right, var(--primary), var(--secondary))" }} />
            </div>
            
            <div className="flex-1 space-y-4">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div>
                  <h1 className="text-4xl md:text-5xl font-display font-bold glow-text mb-2">@{profile.username}</h1>
                  <span className="px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-bold tracking-widest uppercase">
                    {profile.vibe_label}
                  </span>
                </div>
                
                <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                  <DialogTrigger asChild>
                    <button className="w-12 h-12 rounded-full glass-card flex items-center justify-center text-white hover:bg-white/10 transition-colors mx-auto md:mx-0">
                      <Settings className="w-5 h-5" />
                    </button>
                  </DialogTrigger>
                  <DialogContent className="glass-card border-white/10 bg-[#05050d]">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-display glow-text">Edit Night Identity</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-white/70">Username</label>
                        <input 
                          type="text" value={username} onChange={e => setUsername(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-primary/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-white/70">Bio</label>
                        <input 
                          type="text" value={bio} onChange={e => setBio(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-primary/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-white/70">Vibe Label</label>
                        <input 
                          type="text" value={vibeLabel} onChange={e => setVibeLabel(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-primary/50"
                        />
                      </div>
                      <button 
                        onClick={() => {
                          updateProfile.mutate({ data: { username, bio, vibe_label: vibeLabel } }, {
                            onSuccess: () => {
                              setIsEditOpen(false);
                              queryClient.invalidateQueries({ queryKey: ["/api/users/me"] });
                            }
                          });
                        }}
                        disabled={updateProfile.isPending}
                        className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl transition-colors"
                      >
                        {updateProfile.isPending ? "Saving..." : "Save Identity"}
                      </button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              
              <p className="text-lg text-white/80 max-w-lg mx-auto md:mx-0">{profile.bio}</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="glass-card p-8 rounded-[2rem] border-white/5 text-center space-y-4 hover:border-primary/30 transition-colors">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                <Moon className="w-8 h-8" />
              </div>
              <div className="text-4xl font-display font-bold glow-text">{profile.nights_count}</div>
              <div className="text-white/50 uppercase tracking-widest text-sm font-bold">Nights Out</div>
           </div>
           <div className="glass-card p-8 rounded-[2rem] border-white/5 text-center space-y-4 hover:border-secondary/30 transition-colors">
              <div className="w-16 h-16 mx-auto rounded-full bg-secondary/10 flex items-center justify-center text-secondary mb-2">
                <Sparkles className="w-8 h-8" />
              </div>
              <div className="text-4xl font-display font-bold glow-text text-secondary">{profile.memories_count}</div>
              <div className="text-white/50 uppercase tracking-widest text-sm font-bold">Memories</div>
           </div>
           <div className="glass-card p-8 rounded-[2rem] border-white/5 text-center space-y-4 hover:border-accent/30 transition-colors">
              <div className="w-16 h-16 mx-auto rounded-full bg-accent/10 flex items-center justify-center text-accent mb-2">
                <Users className="w-8 h-8" />
              </div>
              <div className="text-4xl font-display font-bold glow-text text-accent">{profile.circles_count}</div>
              <div className="text-white/50 uppercase tracking-widest text-sm font-bold">Circles</div>
           </div>
        </div>

      </div>
    </Layout>
  );
}