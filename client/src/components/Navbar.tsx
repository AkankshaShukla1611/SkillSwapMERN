'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from './ui/button';
import { Bell, MessageSquare, Users, LogOut, Search, User as UserIcon } from 'lucide-react';

export function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  if (!user) return null;
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/dashboard" className="font-bold text-lg">SkillSwap</Link>
        <nav className="hidden md:flex items-center gap-1">
          <Link href="/browse" className="px-3 py-2 rounded hover:bg-muted text-sm flex items-center gap-2"><Search className="h-4 w-4" />Browse</Link>
          <Link href="/connections" className="px-3 py-2 rounded hover:bg-muted text-sm flex items-center gap-2"><Users className="h-4 w-4" />Connections</Link>
          <Link href="/chat" className="px-3 py-2 rounded hover:bg-muted text-sm flex items-center gap-2"><MessageSquare className="h-4 w-4" />Chat</Link>
          <Link href="/notifications" className="px-3 py-2 rounded hover:bg-muted text-sm flex items-center gap-2"><Bell className="h-4 w-4" />Alerts</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.push('/profile')}><UserIcon className="h-4 w-4" /></Button>
          <Button variant="outline" size="sm" onClick={logout}><LogOut className="h-4 w-4" />Sign out</Button>
        </div>
      </div>
    </header>
  );
}
