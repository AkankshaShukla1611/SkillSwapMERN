'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';

export default function ChatListPage() {
  const { user } = useAuth();
  const [convos, setConvos] = useState<any[]>([]);
  useEffect(() => { if (user) api.get('/conversations').then((r) => setConvos(r.data)); }, [user]);
  if (!user) return <div className="p-12 text-center">Sign in.</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Conversations</h1>
      {convos.length === 0 && <p className="text-muted-foreground">No conversations yet. Browse to start one.</p>}
      <div className="space-y-2">
        {convos.map((c) => {
          const other = c.participants.find((p: any) => p._id !== user._id);
          return (
            <Link key={c._id} href={`/chat/${c._id}`}>
              <Card className="hover:bg-muted/40 transition cursor-pointer">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{other?.name || 'Unknown'}</span>
                  <span className="text-xs text-muted-foreground">{new Date(c.lastMessageAt).toLocaleString()}</span>
                </div>
                {c.lastMessage && <p className="text-sm text-muted-foreground truncate mt-1">{c.lastMessage.content}</p>}
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
