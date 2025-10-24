"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type User = {
  id: string;
  name: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, name?: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

const STORAGE_KEY = "auth:user";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw) as User);
    } catch {
      setUser(null);
    }
  }, []);

  const login = (email: string, name?: string) => {
    const uid = Buffer.from(email).toString("base64").replace(/=+$/, "");
    const u: User = { id: uid, name: name ?? email.split("@")[0], email };
    setUser(u);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    } catch {
      // ignore
    }
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};