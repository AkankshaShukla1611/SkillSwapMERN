import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <div className="container mx-auto px-4 py-20">
      <section className="max-w-3xl mx-auto text-center space-y-6">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight">Trade skills. Grow together.</h1>
        <p className="text-lg text-muted-foreground">
          SkillSwap connects learners and teachers. Share what you know, learn what you want — with real chat and video calls.
        </p>
        <div className="flex justify-center gap-3">
          <Link href="/register"><Button size="lg">Get started — free</Button></Link>
          <Link href="/login"><Button size="lg" variant="outline">Sign in</Button></Link>
        </div>
      </section>

      <section className="mt-24 grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {[
          { t: 'Skill matching', d: 'Search peers by what they teach or want to learn.' },
          { t: 'Real-time chat', d: 'Messages, typing indicators, read receipts, unread badges.' },
          { t: 'WebRTC video', d: 'Audio + video calls right in the browser. No installs.' },
        ].map((f) => (
          <div key={f.t} className="rounded-xl border border-border p-6">
            <h3 className="font-semibold text-lg">{f.t}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{f.d}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
