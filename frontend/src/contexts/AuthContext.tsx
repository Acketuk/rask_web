"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

const API = process.env.NEXT_PUBLIC_API_URL;
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user,        setUser]        = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    try {
      const token = localStorage.getItem(ACCESS_KEY);
      const stored = localStorage.getItem(USER_KEY);
      if (token && stored) {
        setAccessToken(token);
        setUser(JSON.parse(stored));
      }
    } catch {}
  }, []);

  const persist = useCallback((token: string, refresh: string, u: User) => {
    localStorage.setItem(ACCESS_KEY,  token);
    localStorage.setItem(REFRESH_KEY, refresh);
    localStorage.setItem(USER_KEY,    JSON.stringify(u));
    setAccessToken(token);
    setUser(u);
  }, []);

  const clear = useCallback(() => {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
    setAccessToken(null);
    setUser(null);
  }, []);

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
