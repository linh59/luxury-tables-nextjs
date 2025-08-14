'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { User, Save, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import {  AccountUpdateFormSchema, AccountUpdateFormSchemaType } from '@/lib/schema-validations/account.schema';
import { useEffect, useState } from 'react';
import { useProfile, useUpdateProfileMutation } from '@/queries/useAccount';
import { handleErrorApi } from '@/lib/utils';


export const ProfileTab = () => {
  const t = useTranslations();
  const { data: user, isLoading, isSuccess } = useProfile()
  const useUpdateProfile = useUpdateProfileMutation();
  // const { user, updateProfile } = useAuth();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // 1) KHỞI TẠO form với default rỗng (tránh uncontrolled/controlled warning)
  const form = useForm<AccountUpdateFormSchemaType>({
    resolver: zodResolver(AccountUpdateFormSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
    },
  });

  // 2) KHI user có dữ liệu -> đổ vào form
  useEffect(() => {
    if (isSuccess && user) {
      form.reset({
        first_name: user.first_name ?? '',
        last_name: user.last_name ?? '',
        email: user.email ?? '',
        phone: user.phone ?? '',
      });
      // nếu có avatar trên server thì show trước
      // setAvatarPreview(user.avatar ?? null); // bật nếu có field avatar
    }
  }, [isSuccess, user, form]);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.warning(t('account.avatarTooLarge'));
        return;
      }

      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        toast.warning(t('account.invalidFileType'));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: AccountUpdateFormSchemaType) => {
    try {
      await useUpdateProfile.mutateAsync({
        ...data,
      });

      setLastUpdated(new Date());
      toast.success(t('account.profileUpdated'));
    } catch (error) {
      handleErrorApi({
        error,
      });
    }
  };

  const handleReset = () => {
    form.reset();
    setAvatarPreview(null);
  };

  if (isLoading) {
    return <div className="text-center py-6">{t('common.loading')}</div>;
  }
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {t('account.profileInformation')}
          </CardTitle>
          <CardDescription>
            {t('account.profileDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, (error) => {
              console.error('Form submission error:', error);
            })} className="space-y-6">
              { }
              {/* Avatar Section */}
              {/* <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={avatarPreview || user?.avatar} />
                  <AvatarFallback className="text-lg">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Label htmlFor="avatar" className="cursor-pointer">
                    <Button type="button" variant="outline" asChild>
                      <span className="flex items-center gap-2">
                        <Upload className="h-4 w-4" />
                        {t('account.uploadAvatar')}
                      </span>
                    </Button>
                  </Label>
                  <Input
                    id="avatar"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />

                </div>
              </div> */}

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('account.firstName')}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('account.lastName')}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('account.email')}</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('account.phone')} ({t('common.optional')})</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="+1234567890" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4">
                <div className="flex gap-2">
                  <Button type="submit" className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    {t('account.saveChanges')}
                  </Button>
                  <Button type="button" variant="outline" onClick={handleReset} className="flex items-center gap-2">
                    <RotateCcw className="h-4 w-4" />
                    {t('account.reset')}
                  </Button>
                </div>

                {lastUpdated && (
                  <p className="text-sm text-muted-foreground">
                    {t('account.lastUpdated')}: {lastUpdated.toLocaleString()}
                  </p>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
