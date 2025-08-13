
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Settings } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ProfileTab } from '@/components/account/profile-tab';
import { SecurityTab } from '@/components/account/security-tab';

const Account = () => {
  const t = useTranslations();
  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">{t('account.title')}</h1>
        <p className="text-muted-foreground mt-2">{t('account.description')}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            {t('account.settings')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {t('account.profile')}
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                {t('account.security')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="mt-6">
               <ProfileTab />
            </TabsContent>

            <TabsContent value="security" className="mt-6">
              <SecurityTab />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Account;