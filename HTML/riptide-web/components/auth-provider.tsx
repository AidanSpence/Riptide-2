'use client';

import React, { createContext, useCallback, useContext, useState } from "react";

// keeps the login keys available to other frontend components
// currently stored in memory, so refreshing the page logs the user out
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
  const [tokens, setTokens] = useState<AuthTokens | null>(null);

  // clears the login keys when the user logs out
  const logout = useCallback(() => setTokens(null), []);

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
