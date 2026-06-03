'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import type { User } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function BrowsePage() {
  const [users, setUsers] = useState<User[]>([]);
  const [q, setQ] = useState({ skill: '', location: '', availability: '' });
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(Object.entries(q).filter(([_, v]) => v));
      const path = Object.keys(params).length ? '/users/search' : '/users';
      const { data } = await api.get(path, { params });
      setUsers(data);
    } finally { setLoading(false); }
  };
  useEffect(() => { fetchUsers(); /* eslint-disable-next-line */ }, []);

  const connect = async (id: string) => {
    try { await api.post('/connections', { receiverId: id }); toast.success('Request sent'); }
    catch (e: any) { toast.error(e?.response?.data?.error || 'Failed'); }
  };

  const startChat = async (id: string) => {
    const { data } = await api.post('/conversations', { otherUserId: id });
    window.location.href = `/chat/${data._id}`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Browse skills</h1>
      <div className="grid sm:grid-cols-4 gap-3 mb-6">
        <Input placeholder="Skill (e.g. React)" value={q.skill} onChange={(e) => setQ({ ...q, skill: e.target.value })} />
        <Input placeholder="Location" value={q.location} onChange={(e) => setQ({ ...q, location: e.target.value })} />
        <Input placeholder="Availability" value={q.availability} onChange={(e) => setQ({ ...q, availability: e.target.value })} />
        <Button onClick={fetchUsers} disabled={loading}>{loading ? 'Searching…' : 'Search'}</Button>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((u) => (
          <Card key={u._id}>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                {u.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <CardTitle><Link href={`/profile/${u._id}`}>{u.name}</Link></CardTitle>
                <p className="text-xs text-muted-foreground">{u.location || '—'}</p>
              </div>
            </div>
            {u.bio && <p className="text-sm text-muted-foreground mt-3 line-clamp-2">{u.bio}</p>}
            <div className="mt-3 flex flex-wrap gap-1">
              {u.teachSkills.slice(0, 5).map((s) => <Badge key={s}>{s}</Badge>)}
            </div>
            <div className="mt-4 flex gap-2">
              <Button size="sm" onClick={() => connect(u._id)}>Connect</Button>
              <Button size="sm" variant="outline" onClick={() => startChat(u._id)}>Message</Button>
            </div>
          </Card>
        ))}
        {!loading && users.length === 0 && <p className="text-muted-foreground">No users found.</p>}
      </div>
    </div>
  );
}
