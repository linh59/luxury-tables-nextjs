'use client'
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Crown, User, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { LanguageSelector } from '@/components/language-selector';
import { useTranslations } from 'next-intl';
import LightDarkModeBtn from '@/components/light-dark-mode-btn';

export const LoginForm = () => {
  const t = useTranslations()
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [adminForm, setAdminForm] = useState({
    email: 'linhnguyenphuong59@gmail.com',
    password: 'Pass@123'
  });

  const [employeeForm, setEmployeeForm] = useState({
    username: 'employeeStore1',
    password: 'Pass@123'
  });

  const handleSubmit = async (type: 'admin' | 'employee') => {
    setIsLoading(true);
    setError('');

    try {
      const credentials = type === 'admin'
        ? { email: adminForm.email, password: adminForm.password }
        : { username: employeeForm.username, password: employeeForm.password };

      const success = true;

      if (success) {
        toast('Logined');
      } else {
        setError('Invalid credentials. Please check your login details.');
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
     <Card className="glass shadow-luxury border-border/50">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-luxury text-center">
              {t('login.welcomeBack')}
            </CardTitle>
            <CardDescription className="text-center">
              {t('login.description2')}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="admin" className="space-y-4">
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

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <TabsContent value="admin" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-email">{t('login.eamilAddress')}</Label>
                  <Input
                    id="admin-email"
                    type="email"
                    value={adminForm.email}
                    onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-password">{t('login.password')}</Label>
                  <Input
                    id="admin-password"
                    type="password"
                    value={adminForm.password}
                    onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                  />
                </div>
                <Button
                  className="w-full btn-luxury"
                  onClick={() => handleSubmit('admin')}
                  disabled={isLoading}
                >
                  {isLoading ? t('login.signingIn') : t('login.signInAsEmployee') }
                </Button>
              </TabsContent>

              <TabsContent value="employee" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="employee-username">{t('login.username')}</Label>
                  <Input
                    id="employee-username"
                    type="text"
                    value={employeeForm.username}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, username: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employee-password">{t('login.password')}</Label>
                  <Input
                    id="employee-password"
                    type="password"
                    value={employeeForm.password}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, password: e.target.value })}
                    placeholder="Enter password"
                  />
                </div>
                <Button
                  className="w-full btn-luxury"
                  onClick={() => handleSubmit('employee')}
                  disabled={isLoading}
                >
                  {isLoading ? t('login.signingIn') : t('login.signInAsEmployee') }
                </Button>
              </TabsContent>
            </Tabs>
            <div className='text-center mt-3'>
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
};
