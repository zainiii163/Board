"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { AuthResponse, UserSummary } from "@/lib/shared-types";

import { apiAuthFetch, apiPost, setAuthToken, getAuthToken } from "@/lib/api-client";

type AuthContextValue = {
  user: UserSummary | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
  refreshUser: () => Promise<void>;
  isAdmin: boolean;
  isEditor: boolean;
  isStaff: boolean;
  isTeacher: boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const token = getAuthToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const data = await apiAuthFetch<{ user: UserSummary }>("/api/auth/me");
      setUser(data.user);
    } catch {
      setAuthToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      void refreshUser();
    });
  }, [refreshUser]);

  const signIn = useCallback(async (email: string, password: string) => {
    const data = await apiPost<AuthResponse>("/api/auth/login", { email, password });
    setAuthToken(data.token);
    setUser(data.user);
  }, []);

  const signUp = useCallback(async (name: string, email: string, password: string) => {
    const data = await apiPost<AuthResponse>("/api/auth/register", { name, email, password });
    setAuthToken(data.token);
    setUser(data.user);
  }, []);

  const signOut = useCallback(() => {
    setAuthToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      signIn,
      signUp,
      signOut,
      refreshUser,
      isAdmin: user?.role === "admin",
      isEditor: user?.role === "admin" || user?.role === "editor",
      isStaff: user?.role === "admin" || user?.role === "editor" || user?.role === "teacher",
      isTeacher: user?.role === "teacher",
    }),
    [user, loading, signIn, signUp, signOut, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
