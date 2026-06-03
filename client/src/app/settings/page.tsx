'use client';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function SettingsPage() {
  const { user, logout } = useAuth();
  if (!user) return <div className="p-12 text-center">Sign in.</div>;
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <Card className="space-y-3">
        <div><p className="text-sm text-muted-foreground">Email</p><p className="font-medium">{user.email}</p></div>
        <div><p className="text-sm text-muted-foreground">Member since</p><p className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</p></div>
        <Button variant="destructive" onClick={logout}>Sign out</Button>
      </Card>
    </div>
  );
}
