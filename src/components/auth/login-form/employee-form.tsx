'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { AlertCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import authApiRequest from '@/apiRequests/auth';
import { LoginEmployeeBody, LoginEmployeeBodyType } from '@/lib/schema-validations/auth.schema';


export default function EmployeeLoginForm({ onLoggedIn }: { onLoggedIn?: () => void }) {
  const t = useTranslations();
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginEmployeeBodyType>({
    resolver: zodResolver(LoginEmployeeBody),
    defaultValues: { username: 'employeeStore1', password: 'Pass@123' }
  });

  const onSubmit = handleSubmit(async (values) => {
    setError(null); setLoading(true);
    try {
      await authApiRequest.loginEmployee(values); // {username, password}
      onLoggedIn?.();
    } catch (e: any) {
      setError(e?.message || 'Login error');
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
        <Label htmlFor="employee-username">{t('login.username')}</Label>
        <Input id="employee-username" type="text" {...register('username')} />
        {errors.username && <p className="text-xs text-destructive">{errors.username.message as any}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="employee-password">{t('login.password')}</Label>
        <Input id="employee-password" type="password" {...register('password')} />
        {errors.password && <p className="text-xs text-destructive">{errors.password.message as any}</p>}
      </div>

      <Button className="w-full btn-luxury" type="submit" disabled={loading}>
        {loading ? t('login.signingIn') : t('login.signInAsEmployee')}
      </Button>
    </form>
  );
}
