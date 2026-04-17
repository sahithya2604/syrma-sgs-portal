import { useActor } from "@caffeineai/core-infrastructure";
import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { createActor } from "../backend";

const SESSION_KEY = "syrma_sgs_session";

interface AuthState {
  isAuthenticated: boolean;
  username: string | null;
  isInitializing: boolean;
}

interface AuthContextValue extends AuthState {
  login: (username: string, password: string) => Promise<boolean>;
  register: (
    username: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function storeSession(username: string) {
  const session = {
    username,
    expiresAt: Date.now() + 8 * 60 * 60 * 1000, // 8 hours
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { actor } = useActor(createActor);

  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    username: null,
    isInitializing: true,
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem(SESSION_KEY);
      if (stored) {
        const session = JSON.parse(stored) as {
          username: string;
          expiresAt: number;
        };
        if (session.expiresAt > Date.now()) {
          setState({
            isAuthenticated: true,
            username: session.username,
            isInitializing: false,
          });
          return;
        }
        localStorage.removeItem(SESSION_KEY);
      }
    } catch {
      localStorage.removeItem(SESSION_KEY);
    }
    setState({ isAuthenticated: false, username: null, isInitializing: false });
  }, []);

  const login = useCallback(
    async (username: string, password: string): Promise<boolean> => {
      // Try backend login first
      if (actor) {
        try {
          const result = await actor.login(username, password);
          if (result.__kind__ === "ok") {
            storeSession(username);
            setState({
              isAuthenticated: true,
              username,
              isInitializing: false,
            });
            return true;
          }
          // Backend returned an error — credentials invalid
          return false;
        } catch {
          // Fall through to hardcoded fallback on network error
        }
      }

      // Fallback for when actor is unavailable (offline / initializing)
      const FALLBACK: Record<string, string> = {
        admin: "admin123",
        syrma: "syrma@2024",
      };
      const valid = FALLBACK[username.toLowerCase()];
      if (valid && valid === password) {
        storeSession(username);
        setState({ isAuthenticated: true, username, isInitializing: false });
        return true;
      }
      return false;
    },
    [actor],
  );

  const register = useCallback(
    async (
      username: string,
      password: string,
    ): Promise<{ success: boolean; error?: string }> => {
      if (!actor) {
        return {
          success: false,
          error: "Backend not ready. Please try again.",
        };
      }
      try {
        const result = await actor.register(username, password);
        if (result.__kind__ === "ok") {
          // Auto-login after successful registration
          const loginResult = await actor.login(username, password);
          if (loginResult.__kind__ === "ok") {
            storeSession(username);
            setState({
              isAuthenticated: true,
              username,
              isInitializing: false,
            });
          }
          return { success: true };
        }
        return { success: false, error: result.err };
      } catch (e) {
        const msg =
          e instanceof Error
            ? e.message
            : "Registration failed. Please try again.";
        return { success: false, error: msg };
      }
    },
    [actor],
  );

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setState({ isAuthenticated: false, username: null, isInitializing: false });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
