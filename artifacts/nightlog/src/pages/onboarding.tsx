import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/auth";
import { ArrowRight, Check } from "lucide-react";
import { NightlogLogo } from "@/components/nightlog-logo";

const TOTAL_STEPS = 5;

const VIBE_OPTIONS = [
  { id: "underground", label: "Underground", emoji: "🌑" },
  { id: "rooftop",     label: "Rooftop",     emoji: "🌃" },
  { id: "ambient",     label: "Ambient",     emoji: "🌊" },
  { id: "afterhours",  label: "Afterhours",  emoji: "🌙" },
  { id: "techno",      label: "Techno",      emoji: "⚡" },
  { id: "live_music",  label: "Live Music",  emoji: "🎵" },
  { id: "social",      label: "Social",      emoji: "👥" },
  { id: "intimate",    label: "Intimate",    emoji: "✦" },
  { id: "high_energy", label: "High Energy", emoji: "🔥" },
  { id: "cinematic",   label: "Cinematic",   emoji: "🎬" },
];

const GENRE_OPTIONS = [
  "Techno", "House", "Drum & Bass", "Ambient", "Live Jazz",
  "Hip-Hop", "Electronic", "Deep House", "Industrial", "Minimal",
];

const SOCIAL_OPTIONS = [
  { id: "solo",         label: "Solo Explorer",  desc: "I discover on my own terms",       emoji: "🔍" },
  { id: "small_circle", label: "Small Circle",   desc: "A tight crew, coordinated moves",  emoji: "👥" },
  { id: "big_group",    label: "Big Group",      desc: "The more the merrier",             emoji: "🎉" },
  { id: "spontaneous",  label: "Spontaneous",    desc: "Go where the city takes me",       emoji: "⚡" },
];

const AI_MESSAGES = [
  "Building your nightlife graph...",
  "Calibrating city energy...",
  "Mapping your vibe profile...",
  "Connecting you to the pulse...",
  "Night profile ready.",
];

function Blobs() {
  return (
    <>
      <div className="fixed top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle,rgba(124,92,252,0.18) 0%,transparent 70%)", filter: "blur(90px)" }} />
      <div className="fixed bottom-[-15%] right-[-8%] w-[550px] h-[550px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle,rgba(0,212,255,0.12) 0%,transparent 70%)", filter: "blur(80px)" }} />
    </>
  );
}

function VibeChip({ label, emoji, selected, onToggle }: { label: string; emoji: string; selected: boolean; onToggle: () => void }) {
  return (
    <motion.button
      onClick={onToggle}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-left transition-all"
      style={{
        background: selected ? "rgba(124,92,252,0.15)" : "rgba(255,255,255,0.04)",
        border: `1px solid ${selected ? "rgba(124,92,252,0.5)" : "rgba(255,255,255,0.08)"}`,
        boxShadow: selected ? "0 0 0 1px rgba(124,92,252,0.18), 0 0 16px rgba(124,92,252,0.1)" : "none",
      }}>
      <span className="text-base leading-none">{emoji}</span>
      <span className="text-[13px] font-medium" style={{ color: selected ? "#c4b0ff" : "rgba(255,255,255,0.58)" }}>{label}</span>
      {selected && <Check className="w-3 h-3 ml-auto shrink-0" style={{ color: "#9d7fff" }} />}
    </motion.button>
  );
}

export default function Onboarding() {
  const [, navigate] = useLocation();
  const { user, completeOnboarding } = useAuth();

  const [step, setStep] = useState(1);
  const [username, setUsername] = useState("");
  const [city, setCity] = useState("");
  const [vibePrefs, setVibePrefs] = useState<string[]>([]);
  const [genrePrefs, setGenrePrefs] = useState<string[]>([]);
  const [socialBehavior, setSocialBehavior] = useState("");
  const [aiIdx, setAiIdx] = useState(0);

  useEffect(() => {
    if (!user) { navigate("/"); return; }
    if (user.onboardingComplete) { navigate("/discover"); return; }
    setUsername(user.username);
  }, [user, navigate]);

  /* AI calibration animation on step 5 */
  useEffect(() => {
    if (step !== 5) return;
    let idx = 0;
    const iv = setInterval(() => {
      idx++;
      if (idx < AI_MESSAGES.length) {
        setAiIdx(idx);
      } else {
        clearInterval(iv);
        setTimeout(() => {
          completeOnboarding({ username, city, vibePrefs, genrePrefs, socialBehavior });
          navigate("/discover");
        }, 1200);
      }
    }, 1100);
    return () => clearInterval(iv);
  }, [step]); // eslint-disable-line

  const next = () => setStep(s => Math.min(s + 1, TOTAL_STEPS));
  const back = () => setStep(s => Math.max(s - 1, 1));

  const toggleVibe = (id: string) =>
    setVibePrefs(p => p.includes(id) ? p.filter(v => v !== id) : [...p, id]);
  const toggleGenre = (g: string) =>
    setGenrePrefs(p => p.includes(g) ? p.filter(v => v !== g) : [...p, g]);

  const canContinue = () => {
    if (step === 1) return username.trim().length >= 2;
    if (step === 2) return vibePrefs.length >= 1;
    if (step === 3) return genrePrefs.length >= 1;
    if (step === 4) return socialBehavior !== "";
    return true;
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col" style={{ background: "#080808" }}>
      <Blobs />

      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 h-0.5 z-50" style={{ background: "rgba(255,255,255,0.06)" }}>
        <motion.div className="h-full"
          style={{ background: "linear-gradient(90deg,#7c5cfc,#00d4ff)" }}
          animate={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
          transition={{ duration: 0.45, ease: "easeOut" }} />
      </div>

      {/* Back */}
      {step > 1 && step < TOTAL_STEPS && (
        <button onClick={back}
          className="fixed top-5 left-5 text-[12px] text-white/28 hover:text-white/58 transition-colors z-50 flex items-center gap-1.5">
          ← Back
        </button>
      )}

      {/* Step counter */}
      {step < TOTAL_STEPS && (
        <div className="fixed top-5 right-5 text-[11px] font-mono text-white/22 z-50">{step}/{TOTAL_STEPS}</div>
      )}

      {/* Main */}
      <div className="flex-1 flex items-center justify-center px-6 py-16 relative z-10">
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 28 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -28 }}
              transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
            >

              {/* ── Step 1: Identity ── */}
              {step === 1 && (
                <div className="space-y-8">
                  <div>
                    <p className="text-[10px] font-bold tracking-widest uppercase text-white/25 mb-3">Your Identity</p>
                    <h2 className="display text-[58px] text-white leading-none tracking-wide">WHO<br />ARE YOU?</h2>
                    <p className="text-[14px] text-white/38 mt-3 font-light">What should we call you in the city?</p>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold tracking-widest uppercase text-white/28">Handle</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/32 text-[14px] select-none">@</span>
                        <input type="text" value={username}
                          onChange={e => setUsername(e.target.value.replace(/\s/g, "").toLowerCase())}
                          placeholder="yournightname" maxLength={24}
                          className="w-full pl-8 pr-4 py-3.5 rounded-xl text-[14px] text-white placeholder:text-white/20 focus:outline-none"
                          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)" }} />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold tracking-widest uppercase text-white/28">Your City</label>
                      <input type="text" value={city} onChange={e => setCity(e.target.value)}
                        placeholder="Mumbai, Tokyo, Berlin..."
                        className="w-full px-4 py-3.5 rounded-xl text-[14px] text-white placeholder:text-white/20 focus:outline-none"
                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)" }} />
                    </div>
                    <motion.button onClick={next} disabled={!canContinue()}
                      whileHover={{ scale: canContinue() ? 1.01 : 1 }}
                      whileTap={{ scale: canContinue() ? 0.98 : 1 }}
                      className="w-full flex items-center justify-center gap-2.5 py-4 rounded-xl text-[14px] font-semibold text-white disabled:opacity-35 mt-2"
                      style={{ background: "linear-gradient(135deg,#7c5cfc,#9d7fff)", boxShadow: "0 4px 24px rgba(124,92,252,0.28)" }}>
                      Continue <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              )}

              {/* ── Step 2: Vibe ── */}
              {step === 2 && (
                <div className="space-y-7">
                  <div>
                    <p className="text-[10px] font-bold tracking-widest uppercase text-white/25 mb-3">Your Night</p>
                    <h2 className="display text-[58px] text-white leading-none tracking-wide">WHAT'S<br />YOUR VIBE?</h2>
                    <p className="text-[14px] text-white/38 mt-3 font-light">Select everything that resonates.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    {VIBE_OPTIONS.map(v => (
                      <VibeChip key={v.id} label={v.label} emoji={v.emoji}
                        selected={vibePrefs.includes(v.id)}
                        onToggle={() => toggleVibe(v.id)} />
                    ))}
                  </div>
                  <button onClick={next} disabled={!canContinue()}
                    className="w-full flex items-center justify-center gap-2.5 py-4 rounded-xl text-[14px] font-semibold text-white disabled:opacity-35"
                    style={{ background: "linear-gradient(135deg,#7c5cfc,#9d7fff)", boxShadow: "0 4px 24px rgba(124,92,252,0.28)" }}>
                    Continue <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* ── Step 3: Genres ── */}
              {step === 3 && (
                <div className="space-y-7">
                  <div>
                    <p className="text-[10px] font-bold tracking-widest uppercase text-white/25 mb-3">Your Sound</p>
                    <h2 className="display text-[58px] text-white leading-none tracking-wide">WHAT<br />MOVES YOU?</h2>
                    <p className="text-[14px] text-white/38 mt-3 font-light">Pick your genres. No wrong answers.</p>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {GENRE_OPTIONS.map(g => {
                      const sel = genrePrefs.includes(g);
                      return (
                        <motion.button key={g} onClick={() => toggleGenre(g)}
                          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}
                          className="flex items-center gap-1.5 px-4 py-2.5 rounded-full text-[13px] font-medium transition-all"
                          style={{
                            background: sel ? "rgba(124,92,252,0.15)" : "rgba(255,255,255,0.04)",
                            border: `1px solid ${sel ? "rgba(124,92,252,0.5)" : "rgba(255,255,255,0.09)"}`,
                            color: sel ? "#c4b0ff" : "rgba(255,255,255,0.55)",
                          }}>
                          {sel && <Check className="w-3 h-3" />}
                          {g}
                        </motion.button>
                      );
                    })}
                  </div>
                  <button onClick={next} disabled={!canContinue()}
                    className="w-full flex items-center justify-center gap-2.5 py-4 rounded-xl text-[14px] font-semibold text-white disabled:opacity-35"
                    style={{ background: "linear-gradient(135deg,#7c5cfc,#9d7fff)", boxShadow: "0 4px 24px rgba(124,92,252,0.28)" }}>
                    Continue <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* ── Step 4: Social behavior ── */}
              {step === 4 && (
                <div className="space-y-7">
                  <div>
                    <p className="text-[10px] font-bold tracking-widest uppercase text-white/25 mb-3">Your Style</p>
                    <h2 className="display text-[58px] text-white leading-none tracking-wide">HOW DO<br />YOU MOVE?</h2>
                    <p className="text-[14px] text-white/38 mt-3 font-light">How do you navigate a night?</p>
                  </div>
                  <div className="space-y-2.5">
                    {SOCIAL_OPTIONS.map(opt => {
                      const sel = socialBehavior === opt.id;
                      return (
                        <motion.button key={opt.id} onClick={() => setSocialBehavior(opt.id)}
                          whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                          className="w-full flex items-center gap-4 px-5 py-4 rounded-xl text-left transition-all"
                          style={{
                            background: sel ? "rgba(124,92,252,0.13)" : "rgba(255,255,255,0.04)",
                            border: `1px solid ${sel ? "rgba(124,92,252,0.48)" : "rgba(255,255,255,0.08)"}`,
                            boxShadow: sel ? "0 0 20px rgba(124,92,252,0.12)" : "none",
                          }}>
                          <span className="text-2xl">{opt.emoji}</span>
                          <div className="flex-1">
                            <div className="text-[15px] font-semibold" style={{ color: sel ? "#c4b0ff" : "rgba(255,255,255,0.78)" }}>{opt.label}</div>
                            <div className="text-[12px] text-white/32 mt-0.5">{opt.desc}</div>
                          </div>
                          {sel && (
                            <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ background: "#7c5cfc" }}>
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                  <button onClick={next} disabled={!canContinue()}
                    className="w-full flex items-center justify-center gap-2.5 py-4 rounded-xl text-[14px] font-semibold text-white disabled:opacity-35"
                    style={{ background: "linear-gradient(135deg,#7c5cfc,#9d7fff)", boxShadow: "0 4px 24px rgba(124,92,252,0.28)" }}>
                    Build My Profile <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* ── Step 5: AI calibration ── */}
              {step === 5 && (
                <div className="flex flex-col items-center text-center space-y-10">
                  {/* Pulsing orb */}
                  <div className="relative flex items-center justify-center" style={{ width: 140, height: 140 }}>
                    {[0, 1, 2].map(i => (
                      <motion.div key={i}
                        className="absolute rounded-full"
                        style={{
                          width: 60 + i * 28,
                          height: 60 + i * 28,
                          border: "1px solid rgba(124,92,252,0.35)",
                        }}
                        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.15, 0.5] }}
                        transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.5, ease: "easeInOut" }}
                      />
                    ))}
                    <div className="relative z-10 flex items-center justify-center">
                      <NightlogLogo />
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="space-y-3 min-h-[120px] flex flex-col justify-center">
                    <AnimatePresence>
                      {AI_MESSAGES.slice(0, aiIdx + 1).map((msg, i) => (
                        <motion.div key={msg}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: i === aiIdx ? 1 : 0.28, y: 0 }}
                          className={`text-[15px] ${i === aiIdx && aiIdx === AI_MESSAGES.length - 1 ? "font-semibold text-white" : "text-white/55"} leading-relaxed`}
                          style={i === aiIdx && aiIdx === AI_MESSAGES.length - 1 ? { color: "#c4b0ff" } : {}}>
                          {msg}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  {aiIdx < AI_MESSAGES.length - 1 && (
                    <p className="text-[12px] text-white/25">Personalizing your nightlife intelligence…</p>
                  )}
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
