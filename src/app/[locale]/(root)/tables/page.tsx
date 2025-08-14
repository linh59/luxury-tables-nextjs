// app/[locale]/tables/page.tsx
import {setRequestLocale} from 'next-intl/server';
import TableList from '@/app/[locale]/(root)/tables/table-list';
import { MOCK_STORES, MOCK_TABLES, MOCK_GROUPS } from '@/app/[locale]/(root)/tables/mock';

export default async function TablesPage({
  params: {locale}
}: {params:{locale:string}}) {
  setRequestLocale(locale);

  return (
    <TableList
      initialTables={MOCK_TABLES}
      initialGroups={MOCK_GROUPS}
    />
  );
}
