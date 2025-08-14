import Stores from '@/app/[locale]/(root)/stores/stores';
import { setRequestLocale } from 'next-intl/server';

export default async function StoresPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  return <Stores />;
}
