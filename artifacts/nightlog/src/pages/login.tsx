import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation, Link } from "wouter";
import { useAuth } from "@/contexts/auth";
import { ArrowRight, Eye, EyeOff } from "lucide-react";

function Blobs() {
  return (
    <>
      <div className="absolute top-[-15%] left-[-8%] w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle,rgba(124,92,252,0.22) 0%,transparent 70%)", filter: "blur(90px)" }} />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle,rgba(0,212,255,0.14) 0%,transparent 70%)", filter: "blur(80px)" }} />
      <div className="absolute top-[55%] left-[45%] w-[350px] h-[350px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle,rgba(240,54,90,0.1) 0%,transparent 70%)", filter: "blur(60px)" }} />
    </>
  );
}

export default function Login() {
  const [, navigate] = useLocation();
  const { login, continueAsGuest, user } = useAuth();
  const [username, setUsername] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [isLogging, setIsLogging] = useState(false);
  const [isGuesting, setIsGuesting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.onboardingComplete) navigate("/discover");
    else if (user && !user.onboardingComplete) navigate("/onboarding");
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) { setError("Enter your username"); return; }
    setIsLogging(true);
    await new Promise(r => setTimeout(r, 850));
    const u = login(username.trim());
    navigate(u.onboardingComplete ? "/discover" : "/onboarding");
  };

  const handleGuest = async () => {
    setIsGuesting(true);
    await new Promise(r => setTimeout(r, 600));
    continueAsGuest();
    navigate("/discover");
  };

  const busy = isLogging || isGuesting;

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: "#080808" }}>
      <Blobs />

      {/* Back to home */}
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
            <h1 className="text-[26px] font-semibold tracking-tight text-white leading-tight">Welcome back.</h1>
            <p className="text-[14px] text-white/32 mt-1.5 font-light">The city is live tonight.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold tracking-widest uppercase text-white/28">Username</label>
              <input
                type="text"
                value={username}
                onChange={e => { setUsername(e.target.value); setError(""); }}
                placeholder="dilshad"
                autoFocus
                disabled={busy}
                className="w-full px-4 py-3 rounded-xl text-[14px] text-white placeholder:text-white/20 focus:outline-none transition-colors disabled:opacity-50"
                style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${error ? "rgba(240,54,90,0.5)" : "rgba(255,255,255,0.08)"}` }}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold tracking-widest uppercase text-white/28">Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  defaultValue="password"
                  disabled={busy}
                  className="w-full px-4 py-3 rounded-xl text-[14px] text-white placeholder:text-white/20 focus:outline-none pr-11 disabled:opacity-50"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/22 hover:text-white/50 transition-colors">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                className="text-[12px]" style={{ color: "#f0365a" }}>
                {error}
              </motion.p>
            )}

            <motion.button
              type="submit"
              disabled={busy}
              whileHover={{ scale: busy ? 1 : 1.01 }}
              whileTap={{ scale: busy ? 1 : 0.98 }}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl text-[14px] font-semibold text-white disabled:opacity-60 mt-2"
              style={{ background: "linear-gradient(135deg,#7c5cfc,#9d7fff)", boxShadow: "0 4px 24px rgba(124,92,252,0.3)" }}>
              {isLogging
                ? <div className="w-5 h-5 rounded-full border-t-2 border-white animate-spin" />
                : <><span>Enter Nightlog</span><ArrowRight className="w-4 h-4" /></>
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
        </div>

        <p className="text-center text-[13px] text-white/28 mt-6">
          New here?{" "}
          <Link href="/signup">
            <span className="text-white/58 hover:text-white transition-colors cursor-pointer font-medium">Create your night profile →</span>
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
