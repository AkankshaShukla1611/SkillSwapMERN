'use client';
import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import type { User } from '@/types';

interface AuthCtx {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, confirmPassword: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const refresh = useCallback(async () => {
  console.log("========== REFRESH START ==========");

  try {
    const { data } = await api.get<User>("/api/users/me");

    console.log("REFRESH SUCCESS");
    console.log(data);

    setUser(data);
  } catch (err) {
    console.log("REFRESH FAILED");
    console.log(err);

    setUser(null);
  } finally {
    console.log("LOADING FALSE");
    setLoading(false);
    console.log("========== REFRESH END ==========");
  }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('access')) refresh();
    else setLoading(false);
  }, [refresh]);

 const login = async (email: string, password: string) => {
  const { data } = await api.post('/api/auth/login', { email, password });

  console.log('LOGIN RESPONSE');
  console.log(data);

  localStorage.setItem('access', data.access);
  localStorage.setItem('refresh', data.refresh);

  setUser(data.user);
  router.push('/dashboard');
  };

  const register = async (name: string, email: string, password: string, confirmPassword: string) => {
    const { data } = await api.post('/api/auth/register', { name, email, password, confirmPassword });
    localStorage.setItem('access', data.access);
    localStorage.setItem('refresh', data.refresh);
    setUser(data.user);
    router.push('/dashboard');
  };

  const logout = async () => {
    try { await api.post('/api/auth/logout'); } catch {}
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    setUser(null);
    router.push('/');
  };

  return <Ctx.Provider value={{ user, loading, login, register, logout, refresh }}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useAuth must be used inside AuthProvider');
  return c;
}
