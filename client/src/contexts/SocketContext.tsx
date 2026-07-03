'use client';
import { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { API_BASE } from '@/lib/api';
import { useAuth } from './AuthContext';

const Ctx = createContext<{ socket: Socket | null; online: Set<string> }>({ socket: null, online: new Set() });

export function SocketProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [online, setOnline] = useState<Set<string>>(new Set());
  const ref = useRef<Socket | null>(null);

  useEffect(() => {
    if (!user) {
      ref.current?.disconnect();
      ref.current = null;
      setSocket(null);
      return;
    }
    const token = localStorage.getItem('access');
    const s = io(API_BASE, { auth: { token }, transports: ['websocket'] });

    s.onAny((event, ...args) => {
    console.log('SOCKET EVENT:', event, args);
    });
    s.on("connect", () => {
      console.log("SOCKET CONNECTED");
      console.log("USER:", user?._id);
      console.log("SOCKET:", s.id);
    });

    s.on('connect_error', (err) => {
      console.log('ONLINE SET', Array.from(online));
      console.log('SOCKET ERROR:', err);
    });

    s.on('disconnect', (reason) => {
      console.log('SOCKET DISCONNECTED:', reason);
    });
    ref.current = s;
    setSocket(s);

    s.on('presence:list', (users: string[]) => {
    setOnline(new Set(users));
    });

    s.on('presence:online', ({ userId }) => setOnline((p) => new Set(p).add(userId)));
    s.on('presence:offline', ({ userId }) => setOnline((p) => { const n = new Set(p); n.delete(userId); return n; }));

    return () => { s.disconnect(); ref.current = null; setSocket(null); };
  }, [user]);

  return <Ctx.Provider value={{ socket, online }}>{children}</Ctx.Provider>;
}

export const useSocket = () => useContext(Ctx);
