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
  name: z.string().trim().min(2).max(80),
  email: z.string().email(),
  password: z.string().min(8).regex(/[A-Z]/, 'Uppercase').regex(/[a-z]/, 'Lowercase').regex(/\d/, 'Digit'),
  confirmPassword: z.string(),
}).refine((v) => v.password === v.confirmPassword, { path: ['confirmPassword'], message: 'Passwords do not match' });
type Form = z.infer<typeof schema>;

export default function RegisterPage() {
  const { register: doRegister } = useAuth();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Form>({ resolver: zodResolver(schema) });

  const onSubmit = async (d: Form) => {
    try { await doRegister(d.name, d.email, d.password, d.confirmPassword); }
    catch (e: any) { toast.error(e?.response?.data?.error || 'Register failed'); }
  };

  return (
    <div className="container mx-auto max-w-md px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Create your account</h1>
      <p className="text-muted-foreground mb-8">Start swapping skills with peers.</p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {(['name', 'email', 'password', 'confirmPassword'] as const).map((field) => (
          <div key={field}>
            <label className="text-sm font-medium capitalize">{field === 'confirmPassword' ? 'Confirm password' : field}</label>
            <Input type={field.includes('assword') ? 'password' : field === 'email' ? 'email' : 'text'} {...register(field)} />
            {errors[field] && <p className="text-xs text-red-500 mt-1">{errors[field]?.message as string}</p>}
          </div>
        ))}
        <Button type="submit" className="w-full" disabled={isSubmitting}>{isSubmitting ? 'Creating…' : 'Create account'}</Button>
      </form>
      <p className="text-sm text-muted-foreground mt-6 text-center">
        Already have one? <Link href="/login" className="text-primary font-medium">Sign in</Link>
      </p>
    </div>
  );
}
