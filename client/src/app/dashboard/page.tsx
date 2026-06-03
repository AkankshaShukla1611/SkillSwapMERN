'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardTitle } from '@/components/ui/card';
import { Search, Users, MessageSquare, Bell } from 'lucide-react';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  useEffect(() => { if (!loading && !user) router.replace('/login'); }, [loading, user, router]);
  if (loading || !user) return <div className="p-12 text-center">Loading…</div>;

  const tiles = [
    { href: '/browse', t: 'Browse skills', d: 'Find peers to swap with', I: Search },
    { href: '/connections', t: 'Connections', d: 'Manage your requests', I: Users },
    { href: '/chat', t: 'Chats', d: 'Continue conversations', I: MessageSquare },
    { href: '/notifications', t: 'Notifications', d: 'See latest activity', I: Bell },
  ];

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold">Hi, {user.name.split(' ')[0]} 👋</h1>
      <p className="text-muted-foreground mt-1">What do you want to swap today?</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        {tiles.map(({ href, t, d, I }) => (
          <Link key={href} href={href}>
            <Card className="hover:shadow-md transition cursor-pointer h-full">
              <I className="h-6 w-6 text-primary" />
              <CardTitle className="mt-3">{t}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">{d}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
