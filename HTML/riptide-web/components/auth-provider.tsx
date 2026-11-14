'use client';

import { API_URL } from "../lib/api";
import React, { createContext, useCallback, useContext, useState, useEffect } from "react";

// keeps the login keys available to other frontend components
// session storage keeps login through the spotify redirect in this tab
export type AuthTokens = {
  access: string;
  refresh: string;
};

type AuthContextType = {
  accessToken: string | null;
  setTokens: (tokens: AuthTokens) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [tokens, updateTokens] = useState<AuthTokens | null>(null);

  const setTokens = useCallback((value: AuthTokens) => {
    sessionStorage.setItem("riptide_tokens", JSON.stringify(value));
    updateTokens(value);
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem("riptide_tokens");
    updateTokens(null);
  }, []);

  useEffect(() => {
    let active = true;
    async function restoreLogin() {
      const saved = sessionStorage.getItem("riptide_tokens");
      if (!saved) return;
      try {
        const value = JSON.parse(saved) as AuthTokens;
        if (typeof value.refresh !== "string") throw new Error("invalid saved login");
        const response = await fetch(`${API_URL}/api/token/refresh/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh: value.refresh }),
        });
        if (!response.ok) throw new Error("session expired");
        const data = await response.json();
        if (typeof data.access !== "string") throw new Error("invalid access token");
        if (active) setTokens({ access: data.access, refresh: value.refresh });
      } catch {
        if (active) logout();
      }
    }
    void restoreLogin();
    return () => { active = false; };
  }, [setTokens, logout]);

  return (
    <AuthContext.Provider value={{ accessToken: tokens?.access ?? null, setTokens, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
