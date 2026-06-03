import './globals.css';
import type { Metadata } from 'next';
import { AuthProvider } from '@/contexts/AuthContext';
import { SocketProvider } from '@/contexts/SocketContext';
import { Toaster } from 'sonner';
import { Navbar } from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'SkillSwap — Trade skills with peers',
  description: 'Teach what you know, learn what you want. Connect, chat, and video-call with peers.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <SocketProvider>
            <Navbar />
            <main className="min-h-[calc(100vh-4rem)]">{children}</main>
            <Toaster richColors position="top-right" />
          </SocketProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
