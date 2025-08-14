'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { AlertCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LoginBody, type LoginBodyType } from '@/lib/schema-validations/auth.schema';
import { useLoginMutation } from '@/queries/useAuth';
import { handleErrorApi } from '@/lib/utils';

export default function AdminLoginForm({ onLoggedIn }: { onLoggedIn?: () => void }) {
  const t = useTranslations();
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const loginAdminMutation = useLoginMutation();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginBodyType>({
    resolver: zodResolver(LoginBody),
    defaultValues: { email: 'linhnguyenphuong59@gmail.com', password: 'Pass@123' }
  });

  const onSubmit = handleSubmit(async (values) => {
    setError(null); setLoading(true);
    if(loginAdminMutation.isPending) return; // Prevent multiple submissions
   
    try {
      await loginAdminMutation.mutateAsync(values); // {email, password}
      onLoggedIn?.();
    } catch (e: any) {
        handleErrorApi({
            error: e,
            setError,
        });
      ;
    } finally {
      setLoading(false);
    }
  });

  return (
    <form className="space-y-4" onSubmit={onSubmit} noValidate>
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="admin-email">{t('login.eamilAddress')}</Label>
        <Input id="admin-email" type="email" {...register('email', { required: t('common.required') as string })} />
        {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="admin-password">{t('login.password')}</Label>
        <Input id="admin-password" type="password" {...register('password', { required: t('common.required') as string })} />
        {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
      </div>

      <Button className="w-full btn-luxury" type="submit" disabled={loading}>
        {loading ? t('login.signingIn') : t('login.signIn')}
      </Button>
    </form>
  );
}
