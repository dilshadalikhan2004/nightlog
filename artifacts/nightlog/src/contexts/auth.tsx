import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export interface NightlogUser {
  username: string;
  city: string;
  vibePrefs: string[];
  genrePrefs: string[];
  socialBehavior: string;
  onboardingComplete: boolean;
  isGuest: boolean;
  joinedAt: string;
  avatarGradient: string;
}

interface AuthContextType {
  user: NightlogUser | null;
  isLoading: boolean;
  login: (username: string) => NightlogUser;
  signup: (username: string) => void;
  continueAsGuest: () => void;
  completeOnboarding: (prefs: Partial<NightlogUser>) => void;
  logout: () => void;
}

const GRADIENTS = [
  "linear-gradient(135deg,#7c5cfc,#f0365a)",
  "linear-gradient(135deg,#00d4ff,#7c5cfc)",
  "linear-gradient(135deg,#f0365a,#ff9500)",
  "linear-gradient(135deg,#7c5cfc,#00d4ff)",
];

const AuthContext = createContext<AuthContextType | null>(null);
const KEY = "nightlog_session_v2";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<NightlogUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setUser(JSON.parse(raw) as NightlogUser);
    } catch {}
    setIsLoading(false);
  }, []);

  const save = (u: NightlogUser) => {
    setUser(u);
    try { localStorage.setItem(KEY, JSON.stringify(u)); } catch {}
  };

  const login = (username: string): NightlogUser => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const stored = JSON.parse(raw) as NightlogUser;
        setUser(stored);
        return stored;
      }
    } catch {}
    const u: NightlogUser = {
      username,
      city: "City",
      vibePrefs: [],
      genrePrefs: [],
      socialBehavior: "Solo Explorer",
      onboardingComplete: true,
      isGuest: false,
      joinedAt: new Date().toISOString(),
      avatarGradient: GRADIENTS[username.length % GRADIENTS.length],
    };
    save(u);
    return u;
  };

  const signup = (username: string) => {
    save({
      username,
      city: "",
      vibePrefs: [],
      genrePrefs: [],
      socialBehavior: "",
      onboardingComplete: false,
      isGuest: false,
      joinedAt: new Date().toISOString(),
      avatarGradient: GRADIENTS[username.length % GRADIENTS.length],
    });
  };

  const continueAsGuest = () => {
    save({
      username: "guest",
      city: "City",
      vibePrefs: ["High Energy"],
      genrePrefs: ["Electronic"],
      socialBehavior: "Solo Explorer",
      onboardingComplete: true,
      isGuest: true,
      joinedAt: new Date().toISOString(),
      avatarGradient: GRADIENTS[0],
    });
  };

  const completeOnboarding = (prefs: Partial<NightlogUser>) => {
    if (!user) return;
    save({ ...user, ...prefs, onboardingComplete: true });
  };

  const logout = () => {
    setUser(null);
    try { localStorage.removeItem(KEY); } catch {}
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, continueAsGuest, completeOnboarding, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
