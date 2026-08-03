"use client";

import { createContext, useContext, useState, useEffect, useRef, useCallback, ReactNode } from "react";

const API = process.env.NEXT_PUBLIC_API_URL ?? "";
const ACCESS_KEY  = "rask_access_token";
const REFRESH_KEY = "rask_refresh_token";
const USER_KEY    = "rask_user";

type User = { id: string; name: string; email: string };

type AuthCtx = {
  user: User | null;
  accessToken: string | null;
  isLoggedIn: boolean;
  login:    (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout:   () => Promise<void>;
};

const AuthContext = createContext<AuthCtx | null>(null);

function getTokenExp(token: string): number | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return typeof payload.exp === "number" ? payload.exp : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user,        setUser]        = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const clear = useCallback(() => {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
    setAccessToken(null);
    setUser(null);
    clearTimeout(timerRef.current);
  }, []);

  const scheduleRefresh = useCallback((token: string) => {
    clearTimeout(timerRef.current);
    const exp = getTokenExp(token);
    if (!exp) return;
    const msLeft = exp * 1000 - Date.now() - 60_000; // refresh 1 min early
    if (msLeft > 0) {
      timerRef.current = setTimeout(async () => {
        const refresh = localStorage.getItem(REFRESH_KEY);
        if (!refresh) { clear(); return; }
        try {
          const res = await fetch(`${API}/api/v1/auth/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh_token: refresh }),
          });
          if (!res.ok) { clear(); return; }
          const { access_token } = await res.json();
          localStorage.setItem(ACCESS_KEY, access_token);
          setAccessToken(access_token);
          scheduleRefresh(access_token);
        } catch {
          clear();
        }
      }, msLeft);
    }
  }, [clear]);

  const persist = useCallback((token: string, refresh: string, u: User) => {
    localStorage.setItem(ACCESS_KEY,  token);
    localStorage.setItem(REFRESH_KEY, refresh);
    localStorage.setItem(USER_KEY,    JSON.stringify(u));
    setAccessToken(token);
    setUser(u);
    scheduleRefresh(token);
  }, [scheduleRefresh]);

  // Restore session on mount — refresh immediately if token is expired/missing
  useEffect(() => {
    const token   = localStorage.getItem(ACCESS_KEY);
    const refresh = localStorage.getItem(REFRESH_KEY);
    const stored  = localStorage.getItem(USER_KEY);
    if (!refresh || !stored) return;

    const exp = token ? getTokenExp(token) : null;
    const isValid = exp && exp * 1000 > Date.now() + 5_000;

    if (isValid && token) {
      setAccessToken(token);
      setUser(JSON.parse(stored));
      scheduleRefresh(token);
    } else {
      // Token missing or expired — silently refresh
      fetch(`${API}/api/v1/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refresh }),
      })
        .then(r => r.ok ? r.json() : Promise.reject())
        .then(({ access_token }) => {
          localStorage.setItem(ACCESS_KEY, access_token);
          setAccessToken(access_token);
          setUser(JSON.parse(stored));
          scheduleRefresh(access_token);
        })
        .catch(clear);
    }
  }, [clear, scheduleRefresh]);

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch(`${API}/api/v1/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error("Invalid email or password");
    const { access_token, refresh_token } = await res.json();

    const me = await fetch(`${API}/api/v1/users/me`, {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    if (!me.ok) throw new Error("Failed to load user profile");
    const userData: User = await me.json();

    persist(access_token, refresh_token, userData);
  }, [persist]);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const res = await fetch(`${API}/api/v1/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error ?? "Registration failed");
    }
    await login(email, password);
  }, [login]);

  const logout = useCallback(async () => {
    const refresh = localStorage.getItem(REFRESH_KEY);
    if (refresh) {
      await fetch(`${API}/api/v1/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refresh }),
      }).catch(() => {});
    }
    clear();
  }, [clear]);

  return (
    <AuthContext.Provider value={{ user, accessToken, isLoggedIn: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
