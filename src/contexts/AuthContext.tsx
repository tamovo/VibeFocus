import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { googleLogout } from '@react-oauth/google';

export interface GoogleUser {
  sub: string;
  email: string;
  name: string;
  picture: string;
  idToken: string;
  exp: number;
}

interface AuthContextType {
  user: GoogleUser | null;
  login: (credential: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);
const AUTH_KEY = 'vibefocus_google_auth';
const STATE_KEY = 'vibefocus_state';

function parseToken(token: string): GoogleUser | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.exp * 1000 < Date.now()) return null;
    return {
      sub: payload.sub,
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
      idToken: token,
      exp: payload.exp,
    };
  } catch {
    return null;
  }
}

function loadStoredUser(): GoogleUser | null {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    const stored = JSON.parse(raw) as GoogleUser;
    if (stored.exp * 1000 < Date.now()) {
      localStorage.removeItem(AUTH_KEY);
      return null;
    }
    return stored;
  } catch {
    localStorage.removeItem(AUTH_KEY);
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<GoogleUser | null>(loadStoredUser);

  const login = useCallback((credential: string) => {
    const userData = parseToken(credential);
    if (!userData) return;
    setUser(userData);
    localStorage.setItem(AUTH_KEY, JSON.stringify(userData));
  }, []);

  const logout = useCallback(() => {
    googleLogout();
    setUser(null);
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(STATE_KEY);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
