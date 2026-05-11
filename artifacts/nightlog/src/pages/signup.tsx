import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation, Link } from "wouter";
import { useAuth } from "@/contexts/auth";
import { ArrowRight } from "lucide-react";

function Blobs() {
  return (
    <>
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle,rgba(124,92,252,0.2) 0%,transparent 70%)", filter: "blur(90px)" }} />
      <div className="absolute bottom-[-15%] left-[-8%] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle,rgba(240,54,90,0.14) 0%,transparent 70%)", filter: "blur(80px)" }} />
      <div className="absolute top-[40%] left-[30%] w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle,rgba(0,212,255,0.08) 0%,transparent 70%)", filter: "blur(70px)" }} />
    </>
  );
}

export default function Signup() {
  const [, navigate] = useLocation();
  const { signup, continueAsGuest, user } = useAuth();
  const [username, setUsername] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isGuesting, setIsGuesting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.onboardingComplete) navigate("/discover");
    else if (user && !user.onboardingComplete) navigate("/onboarding");
  }, [user, navigate]);

  const validate = (v: string) => {
    if (!v.trim()) return "Choose a username";
    if (v.length < 2) return "At least 2 characters";
    if (!/^[a-zA-Z0-9_]+$/.test(v)) return "Letters, numbers, and _ only";
    return "";
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate(username);
    if (err) { setError(err); return; }
    setIsCreating(true);
    await new Promise(r => setTimeout(r, 700));
    signup(username.trim());
    navigate("/onboarding");
  };

  const handleGuest = async () => {
    setIsGuesting(true);
    await new Promise(r => setTimeout(r, 600));
    continueAsGuest();
    navigate("/discover");
  };

  const busy = isCreating || isGuesting;

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: "#080808" }}>
      <Blobs />

      <Link href="/">
        <span className="absolute top-6 left-6 text-[12px] text-white/28 hover:text-white/55 transition-colors cursor-pointer z-10">
          ← Nightlog
        </span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-[400px] mx-6"
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-10 justify-center">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#7c5cfc,#00d4ff)" }}>
            <span className="text-white font-bold text-xs">NL</span>
          </div>
          <span className="text-[16px] font-semibold text-white/75 tracking-tight">Nightlog</span>
        </div>

        <div className="rounded-2xl p-7"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", backdropFilter: "blur(24px)" }}>
          <div className="mb-7">
            <h1 className="text-[26px] font-semibold tracking-tight text-white leading-tight">Join the city.</h1>
            <p className="text-[14px] text-white/32 mt-1.5 font-light">Your night profile starts here.</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold tracking-widest uppercase text-white/28">Your Handle</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-[14px] select-none">@</span>
                <input
                  type="text"
                  value={username}
                  onChange={e => { setUsername(e.target.value.replace(/\s/g, "").toLowerCase()); setError(""); }}
                  placeholder="yournightname"
                  autoFocus
                  disabled={busy}
                  maxLength={24}
                  className="w-full pl-8 pr-4 py-3 rounded-xl text-[14px] text-white placeholder:text-white/20 focus:outline-none disabled:opacity-50"
                  style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${error ? "rgba(240,54,90,0.5)" : "rgba(255,255,255,0.08)"}` }}
                />
              </div>
              {error && (
                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                  className="text-[12px]" style={{ color: "#f0365a" }}>
                  {error}
                </motion.p>
              )}
            </div>

            {/* Preview handle */}
            {username.length >= 2 && !error && (
              <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl"
                style={{ background: "rgba(124,92,252,0.08)", border: "1px solid rgba(124,92,252,0.2)" }}>
                <div className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                  style={{ background: "linear-gradient(135deg,#7c5cfc,#f0365a)" }}>
                  {username[0].toUpperCase()}
                </div>
                <span className="text-[13px] text-white/65">@{username}</span>
                <span className="ml-auto text-[10px]" style={{ color: "#9d7fff" }}>✓ Available</span>
              </motion.div>
            )}

            <motion.button
              type="submit"
              disabled={busy}
              whileHover={{ scale: busy ? 1 : 1.01 }}
              whileTap={{ scale: busy ? 1 : 0.98 }}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl text-[14px] font-semibold text-white disabled:opacity-60 mt-2"
              style={{ background: "linear-gradient(135deg,#7c5cfc,#9d7fff)", boxShadow: "0 4px 24px rgba(124,92,252,0.3)" }}>
              {isCreating
                ? <div className="w-5 h-5 rounded-full border-t-2 border-white animate-spin" />
                : <><span>Create Night Profile</span><ArrowRight className="w-4 h-4" /></>
              }
            </motion.button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
            <span className="text-[11px] text-white/20">or</span>
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
          </div>

          <button onClick={handleGuest} disabled={busy}
            className="w-full py-3 rounded-xl text-[13px] font-medium text-white/42 hover:text-white/65 transition-colors disabled:opacity-50"
            style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
            {isGuesting
              ? <span className="flex items-center justify-center gap-2"><div className="w-4 h-4 rounded-full border-t-2 border-white/40 animate-spin" /> Entering...</span>
              : "Continue as Guest"
            }
          </button>

          <p className="text-center text-[11px] text-white/20 mt-4">
            Free forever · No credit card needed
          </p>
        </div>

        <p className="text-center text-[13px] text-white/28 mt-6">
          Already on Nightlog?{" "}
          <Link href="/login">
            <span className="text-white/58 hover:text-white transition-colors cursor-pointer font-medium">Sign in →</span>
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
