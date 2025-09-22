import Orders from '@/components/orders/orders';
import { setRequestLocale } from 'next-intl/server';

export default async function StoresPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  return <Orders />;
}
