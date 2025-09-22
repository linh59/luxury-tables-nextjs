'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Filter, Building2 } from 'lucide-react';
import { Table, TableGroup } from '../../../../../types';
import { OrderDialog } from '@/components/order-dialog';
import { useStores } from '@/queries/use-stores';
// import {useAuth} from '@/contexts/AuthContext';

type Props = {
  initialTables: Table[];
  initialGroups: TableGroup[];
};

const STATUS_OPTIONS = [
  { value: 'all', labelKey: 'tables.allStatus' },
  { value: 'empty', labelKey: 'tables.available' },
  { value: 'eating', labelKey: 'tables.occupied' },
  { value: 'processing', labelKey: 'tables.processing' },
  { value: 'paid', labelKey: 'tables.paid' }
] as const;

export default function TableList({
  initialTables,
  initialGroups
}: Props) {
  const t = useTranslations();
  // const {user} = useAuth(); // bật khi có AuthContext
  const { data: store, isLoading: isLoadingStore } = useStores({}); // bật khi có useStores hook
  const user = undefined as unknown as { role: 'admin' | 'employee'; storeId?: string } | undefined;

  const [tables, setTables] = useState<Table[]>([]);
  const [filteredTables, setFilteredTables] = useState<Table[]>([]);
  const [selectedStore, setSelectedStore] = useState<string>('');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  //   const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Init store theo role
  useEffect(() => {
    if (!store || isLoadingStore) return;
    console.log('Store data:', store);
    if (user?.role === 'employee' && user.storeId) {
      setSelectedStore(user.storeId);
    } else {

      // demo: pick store đầu tiên
      setSelectedStore(store.data[0]?.id ?? '');
      // setSelectedStore(initialStores[0]?.id ?? '');
    }
  }, [user, store, isLoadingStore]);

  // Lọc theo store
  useEffect(() => {
    if (selectedStore) {
      setTables(initialTables.filter(tb => tb.storeId === selectedStore));
    } else {
      setTables([]);
    }
  }, [selectedStore, initialTables]);

  // Lọc theo group + status
  useEffect(() => {
    let result = tables;
    if (selectedGroup !== 'all') result = result.filter(tb => tb.groupId === selectedGroup);
    if (selectedStatus !== 'all') result = result.filter(tb => tb.status === selectedStatus);
    setFilteredTables(result);
  }, [tables, selectedGroup, selectedStatus]);

  const counts = useMemo(() => ({
    empty: filteredTables.filter(t => t.status === 'empty').length,
    eating: filteredTables.filter(t => t.status === 'eating').length,
    processing: filteredTables.filter(t => t.status === 'processing').length,
    paid: filteredTables.filter(t => t.status === 'paid').length
  }), [filteredTables]);

  // const selectedStoreName = useMemo(
  //   () => store?.data.find(s => s.id === selectedStore)?.store_name,
  //   [store, selectedStore]
  // );
  const selectedStoreName = store?.data.find((s) => s.id === selectedStore)?.store_name ?? '';

  const handleTableClick = (table: Table) => setSelectedTable(table);

  const handleUpdateTable = (updated: Table) => {
    setTables(prev => prev.map(t => t.id === updated.id ? updated : t));
    setSelectedTable(updated);
  };
  const handleCreateTransaction = () => {

  };
  //   const handleCreateTransaction = (tx: Transaction) => {
  //     setTransactions(prev => [...prev, tx]);
  //     // toast.success(t('order.transactionRecorded'))
  //   };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-luxury font-bold">{t('tables.title')}</h1>
          <p className="text-muted-foreground">
            {user?.role === 'admin' ? t('tables.manageDescription') : t('tables.managingStore')}
          </p>
        </div>


      </div>

      {/* Store Selection */}

      <Card className="glass">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <div className="flex items-center gap-2">
              <Label htmlFor="store-select">{t('tables.selectStore')}:</Label>
              <Select value={selectedStore} onValueChange={setSelectedStore}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder={t('tables.chooseStore')} />
                </SelectTrigger>
                <SelectContent>
                  {store?.data.map(store => (
                    <SelectItem key={store.id} value={store.id}>{store.store_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedStoreName && (
              <Badge variant="outline" className="ml-2">{selectedStoreName}</Badge>
            )}
          </div>
        </CardContent>
      </Card>


      {selectedStore ? (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {([
              { colorClass: 'bg-table-empty', label: t('tables.available'), value: counts.empty },
              { colorClass: 'bg-table-eating', label: t('tables.occupied'), value: counts.eating },
              { colorClass: 'bg-table-processing  ', label: t('tables.processing'), value: counts.processing },
              { colorClass: 'bg-table-paid', label: t('tables.paid'), value: counts.paid },
            ] as const).map((item, i) => (
              <Card key={i} className="glass">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <div className={`h-3 w-3 rounded-full ${item.colorClass}`} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  <div className="text-2xl font-bold mt-2">{item.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Filters */}
          <Card className="glass">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full">
                  <div className="flex items-center gap-2">
                    <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                      <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {initialGroups.map(g => (
                          <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-2">
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.map(s => (
                          <SelectItem key={s.value} value={s.value}>
                            {t(s.labelKey)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tables Grid */}
          {/* <TableGrid tables={filteredTables} onTableClick={handleTableClick} /> */}
           <div className="mx-16">
            Table
              {/* <POSTableGrid
                tables={paginatedTables}
                onTableClick={handleTableClick}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                maxColumnsPerRow={maxColumnsPerRow}
              /> */}
            </div>
        </>
      ) : (
        <Card className="glass">
          <CardContent className="p-8 text-center">
            <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">{t('tables.selectStore')}</h3>
            <p className="text-muted-foreground">
              {user?.role === 'admin' ? t('tables.selectStoreDescription') : t('tables.loadingStore')}
            </p>
          </CardContent>
        </Card>
      )
      }

      {/* Order Dialog */}
      {selectedTable && (
        <OrderDialog
          open={!!selectedTable}
          onOpenChange={(open) => !open && setSelectedTable(null)}
          table={selectedTable}
          onUpdateTable={handleUpdateTable}
          onCreateTransaction={handleCreateTransaction}
        />
      )}
    </div>
  );
}
