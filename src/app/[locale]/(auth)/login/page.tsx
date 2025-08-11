import LoginForm from '@/app/[locale]/(auth)/login/login-form';
import { Utensils } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';

export default async function Login(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-luxury-cream via-background to-luxury-cream/20 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="h-16 w-16 mx-auto rounded-2xl bg-luxury-gold flex items-center justify-center shadow-luxury">
            <Utensils className="h-8 w-8 text-luxury-gold-foreground" />
          </div>
          <h1 className="text-3xl font-luxury font-bold text-foreground">{t('login.title')}</h1>
          <p className="text-muted-foreground">{t('login.description')}</p>
        </div>

        {/* Login Form */}
        <LoginForm />
      </div>
    </div>
  );
}
