"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { login as apiLogin, me as apiMe } from "@/lib/api";
import { clearToken, getToken, setToken } from "@/lib/storage";
import type { Role, UserRead } from "@/lib/types";

type AuthContextValue = {
  user: UserRead | null;
  token: string | null;
  loading: boolean;
  // PUBLIC_INTERFACE
  login: (username: string, password: string) => Promise<void>;
  // PUBLIC_INTERFACE
  logout: () => void;
  // PUBLIC_INTERFACE
  refreshMe: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);
  const [user, setUser] = useState<UserRead | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = getToken();
    setTokenState(t);
    const init = async () => {
      if (t) {
        try {
          const me = await apiMe();
          setUser(me);
        } catch {
          clearToken();
          setTokenState(null);
          setUser(null);
        }
      }
      setLoading(false);
    };
    init();
  }, []);

  const login = async (username: string, password: string) => {
    setLoading(true);
    try {
      const tok = await apiLogin(username, password);
      setToken(tok.access_token);
      setTokenState(tok.access_token);
      const me = await apiMe();
      setUser(me);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    clearToken();
    setTokenState(null);
    setUser(null);
  };

  const refreshMe = async () => {
    if (!getToken()) return;
    const me = await apiMe();
    setUser(me);
  };

  const value = useMemo(
    () => ({ user, token, loading, login, logout, refreshMe }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// PUBLIC_INTERFACE
export function useAuth(): AuthContextValue {
  /** Access the authentication context. */
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

// PUBLIC_INTERFACE
export function hasRole(user: UserRead | null, roles?: Role[]): boolean {
  /** Check if the current user has one of the allowed roles. */
  if (!user || !roles || roles.length === 0) return false;
  return roles.includes(user.role);
}
