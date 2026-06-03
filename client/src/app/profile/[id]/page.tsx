'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import type { User } from '@/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function PublicProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [u, setU] = useState<User | null>(null);
  useEffect(() => { api.get<User>(`/users/${id}`).then((r) => setU(r.data)).catch(() => setU(null)); }, [id]);

  if (!u) return <div className="p-12 text-center">Loading…</div>;

  const connect = async () => {
    try { await api.post('/connections', { receiverId: u._id }); toast.success('Request sent'); }
    catch (e: any) { toast.error(e?.response?.data?.error || 'Failed'); }
  };
  const message = async () => {
    const { data } = await api.post('/conversations', { otherUserId: u._id });
    window.location.href = `/chat/${data._id}`;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <div className="flex items-center gap-4">
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-2xl overflow-hidden">
            {u.avatar ? <img src={u.avatar} className="h-full w-full object-cover" alt="" /> : u.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{u.name}</h1>
            <p className="text-sm text-muted-foreground">{u.location || ''} {u.college && `• ${u.college}`}</p>
          </div>
        </div>
        {u.bio && <p className="text-sm mt-4">{u.bio}</p>}
        {u.availability && <p className="text-sm mt-2 text-muted-foreground">Available: {u.availability}</p>}
        <div className="mt-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Teaches</p>
          <div className="flex flex-wrap gap-1">{u.teachSkills.map((s) => <Badge key={s}>{s}</Badge>)}</div>
        </div>
        <div className="mt-3">
          <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Learning</p>
          <div className="flex flex-wrap gap-1">{u.learnSkills.map((s) => <Badge key={s}>{s}</Badge>)}</div>
        </div>
        <div className="mt-6 flex gap-2">
          <Button onClick={connect}>Connect</Button>
          <Button variant="outline" onClick={message}>Message</Button>
        </div>
      </Card>
    </div>
  );
}
