'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Shield, Eye, EyeOff, Key } from 'lucide-react';
import { PasswordFormDataType, PasswordSchema } from '@/lib/schema-validations/account.schema';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useChangePasswordMutation } from '@/queries/useAccount';
import { toast } from 'sonner';
import { handleErrorApi } from '@/lib/utils';



export const SecurityTab = () => {
  const t = useTranslations();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const useChangePassword = useChangePasswordMutation();
  const form = useForm<PasswordFormDataType>({
    resolver: zodResolver(PasswordSchema),
    defaultValues: {
      password: '',
      new_password: '',
      re_new_password: '',
    },
  });

  const onSubmit = async (data: PasswordFormDataType) => {
    try {
      await useChangePassword.mutateAsync(data);
      form.reset();
      toast.success(t('account.passwordChanged'));
    } catch (error) {
      handleErrorApi({
        error,
      });
    }


  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/(?=.*[a-z])/.test(password)) strength++;
    if (/(?=.*[A-Z])/.test(password)) strength++;
    if (/(?=.*\d)/.test(password)) strength++;
    if (/(?=.*[@$!%*?&])/.test(password)) strength++;
    return strength;
  };

  const renderPasswordStrength = (password: string) => {
    const strength = getPasswordStrength(password);
    const labels = [t('account.veryWeak'), t('account.weak'), t('account.fair'), t('account.good'), t('account.strong')];
    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];

    return (
      <div className="mt-2">
        <div className="flex gap-1 mb-1">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`h-2 w-full rounded ${i < strength ? colors[strength - 1] : 'bg-gray-200'}`}
            />
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          {password ? labels[strength - 1] || labels[0] : ''}
        </p>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            {t('account.changePassword')}
          </CardTitle>
          <CardDescription>
            {t('account.securityDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, (error) => {
              console.error('Form submission error:', error);
            })} className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('account.currentPassword')}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showCurrentPassword ? 'text' : 'password'}
                          className="pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        >
                          {showCurrentPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="new_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('account.newPassword')}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showNewPassword ? 'text' : 'password'}
                          className="pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    {field.value && renderPasswordStrength(field.value)}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="re_new_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('account.confirmNewPassword')}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showConfirmPassword ? 'text' : 'password'}
                          className="pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="pt-4">
                <Button type="submit" className="flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  {t('account.updatePassword')}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
