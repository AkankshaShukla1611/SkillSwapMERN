'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useSocket } from '@/contexts/SocketContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Notification } from '@/types';

export default function NotificationsPage() {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [items, setItems] = useState<Notification[]>([]);

  useEffect(() => { if (user) api.get('/notifications').then((r) => setItems(r.data)); }, [user]);

  useEffect(() => {
    if (!socket) return;
    const onNew = (n: Notification) => setItems((p) => [n, ...p]);
    socket.on('notify:new', onNew);
    return () => { socket.off('notify:new', onNew); };
  }, [socket]);

  const markAll = async () => { await api.patch('/notifications/read-all'); setItems((p) => p.map((n) => ({ ...n, read: true }))); };

  if (!user) return <div className="p-12 text-center">Sign in.</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <Button variant="outline" size="sm" onClick={markAll}>Mark all read</Button>
      </div>
      {items.length === 0 && <p className="text-muted-foreground">No notifications yet.</p>}
      <div className="space-y-2">
        {items.map((n) => (
          <Link key={n._id} href={n.link || '#'}>
            <Card className={`hover:bg-muted/40 transition ${!n.read ? 'border-primary/50' : ''}`}>
              <p className="text-sm">{n.message}</p>
              <p className="text-xs text-muted-foreground mt-1">{new Date(n.createdAt).toLocaleString()}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
