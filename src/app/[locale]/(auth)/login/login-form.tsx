'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Crown, User } from 'lucide-react';
import { LanguageSelector } from '@/components/language-selector';
import LightDarkModeBtn from '@/components/light-dark-mode-btn';
import AdminLoginForm from '@/components/auth/login-form/admin-form';
import EmployeeLoginForm from '@/components/auth/login-form/employee-form';

export default function LoginForm() {
  const t = useTranslations();
  const [tab, setTab] = React.useState<'admin' | 'employee'>('admin');
  const router = useRouter();
  const locale = useLocale();

  const onLoggedIn = React.useCallback(() => {
    toast.success('Logged in');
    router.push(`/${locale}/tables`);
    router.refresh();
  }, [router, locale]);

  return (
    <Card className="glass shadow-luxury border-border/50">
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-2xl font-luxury text-center">{t('login.welcomeBack')}</CardTitle>
        <CardDescription className="text-center">{t('login.description2')}</CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="admin" className="flex items-center gap-2">
              <Crown className="h-4 w-4" />
              {t('login.admin')}
            </TabsTrigger>
            <TabsTrigger value="employee" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              {t('login.employee')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="admin" className="space-y-4">
            <AdminLoginForm onLoggedIn={onLoggedIn} />
          </TabsContent>

          <TabsContent value="employee" className="space-y-4">
            <EmployeeLoginForm onLoggedIn={onLoggedIn} />
          </TabsContent>
        </Tabs>

        <div className="text-center mt-3">
          <LanguageSelector />
          <LightDarkModeBtn />
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-muted/30 rounded-lg text-xs space-y-2">
          <p className="font-medium text-muted-foreground">Demo Credentials:</p>
          <div className="space-y-1">
            <p><strong>Admin:</strong> linhnguyenphuong59@gmail.com / Pass@123</p>
            <p><strong>Employee Store 1:</strong> employeeStore1 / Pass@123</p>
            <p><strong>Employee Store 2:</strong> employeeStore2 / Pass@123</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
