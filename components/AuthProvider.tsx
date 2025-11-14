"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

export type AuthUser = {
  name: string | null;
  email: string;
  role: string | null;
};

type AuthState = {
  authenticated: boolean;
  user: AuthUser | null;
  loading: boolean;
  refreshAuth: () => Promise<void>;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshAuth = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/auth/me", { credentials: "include" });
      if (!res.ok) {
        setAuthenticated(false);
        setUser(null);
        return;
      }
      const data = await res.json();
      if (data.authenticated) {
        setAuthenticated(true);
        setUser(data.user as AuthUser);
      } else {
        setAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to fetch auth state", error);
      setAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshAuth();
  }, [refreshAuth]);

  return (
    <AuthContext.Provider value={{ authenticated, user, loading, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}

