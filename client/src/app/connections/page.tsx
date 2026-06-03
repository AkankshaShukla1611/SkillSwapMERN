'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

export default function ConnectionsPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<any[]>([]);

  const load = () => api.get('/connections').then((r) => setItems(r.data));
  useEffect(() => { if (user) load(); }, [user]);

  const act = async (id: string, action: 'accept' | 'reject') => {
    try { await api.patch(`/connections/${id}`, { action }); toast.success(action); load(); }
    catch (e: any) { toast.error(e?.response?.data?.error || 'Failed'); }
  };

  if (!user) return <div className="p-12 text-center">Sign in.</div>;
  const incoming = items.filter((i) => i.receiver._id === user._id && i.status === 'pending');
  const outgoing = items.filter((i) => i.sender._id === user._id);
  const accepted = items.filter((i) => i.status === 'accepted');

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl space-y-8">
      <section>
        <h2 className="text-xl font-bold mb-3">Incoming</h2>
        {incoming.length === 0 && <p className="text-muted-foreground text-sm">No incoming requests.</p>}
        {incoming.map((c) => (
          <Card key={c._id} className="flex justify-between items-center mb-2">
            <span>{c.sender.name}</span>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => act(c._id, 'accept')}>Accept</Button>
              <Button size="sm" variant="outline" onClick={() => act(c._id, 'reject')}>Reject</Button>
            </div>
          </Card>
        ))}
      </section>

      <section>
        <h2 className="text-xl font-bold mb-3">Sent</h2>
        {outgoing.length === 0 && <p className="text-muted-foreground text-sm">No sent requests.</p>}
        {outgoing.map((c) => (
          <Card key={c._id} className="flex justify-between items-center mb-2">
            <span>{c.receiver.name}</span>
            <span className="text-sm text-muted-foreground capitalize">{c.status}</span>
          </Card>
        ))}
      </section>

      <section>
        <h2 className="text-xl font-bold mb-3">Connected</h2>
        {accepted.length === 0 && <p className="text-muted-foreground text-sm">No connections yet.</p>}
        {accepted.map((c) => {
          const other = c.sender._id === user._id ? c.receiver : c.sender;
          return (
            <Card key={c._id} className="flex justify-between items-center mb-2">
              <span>{other.name}</span>
              <Button size="sm" variant="outline" onClick={async () => {
                const { data } = await api.post('/conversations', { otherUserId: other._id });
                window.location.href = `/chat/${data._id}`;
              }}>Message</Button>
            </Card>
          );
        })}
      </section>
    </div>
  );
}
