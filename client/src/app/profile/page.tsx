'use client';
import { useEffect, useState, ChangeEvent } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { user, refresh } = useAuth();
  const [form, setForm] = useState<any>({});
  const [skill, setSkill] = useState({ teach: '', learn: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (user) setForm({
    name: user.name, bio: user.bio || '', college: user.college || '',
    location: user.location || '', availability: user.availability || '',
    teachSkills: user.teachSkills || [], learnSkills: user.learnSkills || [],
    socialLinks: user.socialLinks || {},
  }); }, [user]);

  if (!user) return <div className="p-12 text-center">Sign in to view profile.</div>;

  const save = async () => {
    setSaving(true);
    try { await api.patch('/users/me', form); await refresh(); toast.success('Saved'); }
    catch (e: any) { toast.error(e?.response?.data?.error || 'Failed'); }
    finally { setSaving(false); }
  };

  const uploadAvatar = async (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    const fd = new FormData(); fd.append('avatar', f);
    try { await api.post('/users/me/avatar', fd, { headers: { 'Content-Type': 'multipart/form-data' } }); await refresh(); toast.success('Avatar updated'); }
    catch (err: any) { toast.error(err?.response?.data?.error || 'Upload failed'); }
  };

  const addSkill = (key: 'teach' | 'learn') => {
    const v = skill[key].trim(); if (!v) return;
    const field = key === 'teach' ? 'teachSkills' : 'learnSkills';
    setForm({ ...form, [field]: [...(form[field] || []), v] });
    setSkill({ ...skill, [key]: '' });
  };
  const removeSkill = (field: 'teachSkills' | 'learnSkills', s: string) =>
    setForm({ ...form, [field]: form[field].filter((x: string) => x !== s) });

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">My profile</h1>

      <Card className="mb-6 flex items-center gap-4">
        <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-2xl overflow-hidden">
          {user.avatar ? <img src={user.avatar} alt="" className="h-full w-full object-cover" /> : user.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-semibold">{user.name}</p>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          <label className="inline-block mt-2">
            <input type="file" accept="image/*" className="hidden" onChange={uploadAvatar} />
            <span className="text-sm text-primary cursor-pointer">Change avatar</span>
          </label>
        </div>
      </Card>

      <Card className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-3">
          <div><label className="text-sm font-medium">Name</label><Input value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div><label className="text-sm font-medium">College</label><Input value={form.college || ''} onChange={(e) => setForm({ ...form, college: e.target.value })} /></div>
          <div><label className="text-sm font-medium">Location</label><Input value={form.location || ''} onChange={(e) => setForm({ ...form, location: e.target.value })} /></div>
          <div><label className="text-sm font-medium">Availability</label><Input value={form.availability || ''} onChange={(e) => setForm({ ...form, availability: e.target.value })} placeholder="Weekday evenings" /></div>
        </div>
        <div><label className="text-sm font-medium">Bio</label><Textarea value={form.bio || ''} onChange={(e) => setForm({ ...form, bio: e.target.value })} /></div>

        {(['teach', 'learn'] as const).map((key) => {
          const field = key === 'teach' ? 'teachSkills' : 'learnSkills';
          return (
            <div key={key}>
              <label className="text-sm font-medium">{key === 'teach' ? 'I can teach' : 'I want to learn'}</label>
              <div className="flex gap-2 mt-1">
                <Input value={skill[key]} onChange={(e) => setSkill({ ...skill, [key]: e.target.value })} placeholder="Add a skill" onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill(key))} />
                <Button type="button" onClick={() => addSkill(key)}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {(form[field] || []).map((s: string) => (
                  <Badge key={s} className="cursor-pointer" onClick={() => removeSkill(field as any, s)}>{s} ✕</Badge>
                ))}
              </div>
            </div>
          );
        })}

        <div className="grid sm:grid-cols-2 gap-3">
          {(['github', 'linkedin', 'twitter', 'website'] as const).map((k) => (
            <div key={k}>
              <label className="text-sm font-medium capitalize">{k}</label>
              <Input value={form.socialLinks?.[k] || ''} onChange={(e) => setForm({ ...form, socialLinks: { ...form.socialLinks, [k]: e.target.value } })} placeholder="https://" />
            </div>
          ))}
        </div>

        <Button onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</Button>
      </Card>
    </div>
  );
}
