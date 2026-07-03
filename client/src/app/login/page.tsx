'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Required'),
});
type Form = z.infer<typeof schema>;

export default function LoginPage() {
  console.log("LOGIN PAGE LOADED")
  const { login } = useAuth();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Form>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: Form) => {
    try { await login(data.email, data.password); }
    catch (e: any) { toast.error(e?.response?.data?.error || 'Login failed'); }
  };

  return (
    <div className="container mx-auto max-w-md px-4 py-16">
      <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
      <p className="text-muted-foreground mb-8">Sign in to your SkillSwap account.</p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="text-sm font-medium">Email</label>
          <Input type="email" {...register('email')} />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <label className="text-sm font-medium">Password</label>
          <Input type="password" {...register('password')} />
          {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
        </div>
        <Button type="submit" className="w-full" disabled={isSubmitting}>{isSubmitting ? 'Signing in…' : 'Sign in'}</Button>
      </form>
      <p className="text-sm text-muted-foreground mt-6 text-center">
        No account? <Link href="/register" className="text-primary font-medium">Create one</Link>
      </p>
    </div>
  );
}
