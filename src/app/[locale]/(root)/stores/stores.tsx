'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useStores } from '@/queries/use-stores';
import { DateFilterType, SortDirOption, StoreStatusUIType } from '../../../../constants/type';
import StoresFilters from '@/app/[locale]/(root)/stores/stores-filters';
import TablePagination from '@/components/table-pagination';
import StoresTable from '@/app/[locale]/(root)/stores/stores-table';
import {  getPresetDateRange } from '@/lib/date';

export default function StoresClient() {
  // search / status
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState<StoreStatusUIType>('all');

  // date filter & custom range
  const [dateFilter, setDateFilter] = useState<DateFilterType>('all');
  const [startDate, setStartDate] = useState<string | undefined>(undefined);
  const [endDate, setEndDate] = useState<string | undefined>(undefined);

  // paging
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  // đồng bộ preset -> range (trừ khi custom)
  useEffect(() => {
    if (dateFilter === 'custom') return;
    const { start_date, end_date } = getPresetDateRange(dateFilter);
    setStartDate(start_date);
    setEndDate(end_date);
    setPageNo(1);
  }, [dateFilter]);

  const { data: stores, isLoading } = useStores({
    stores: searchTerm || undefined,
    status: status === 'all' ? undefined : status,
    start_date: startDate,
    end_date: endDate,
    page_no: pageNo,
    page_size: pageSize,
    sort_by: 'create_date',
    sort_dir: SortDirOption.desc,
  });

  const totalPages = stores?.total_pages ?? 1;
  const currentPage = stores?.page_no ?? pageNo;
  const totalItems = stores?.total_elements ?? 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-luxury font-bold">Stores</h1>
      </div>

      {/* Filters */}
      <Card className="glass">
        <CardContent className="p-4">
          {}
          <StoresFilters
            // search
            searchTerm={searchTerm}
            onSearchChange={(v) => { setSearchTerm(v); setPageNo(1); }}
            // status
            status={status}
            onStatusChange={(v) => { setStatus(v); setPageNo(1); }}
            // date
            dateFilter={dateFilter}
            onDateFilterChange={(v) => setDateFilter(v)}
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={(v) => { setStartDate(v); setPageNo(1); }}
            onEndDateChange={(v) => { setEndDate(v); setPageNo(1); }}
            // page size
            pageSize={pageSize}
            onPageSizeChange={(v) => { setPageSize(v); setPageNo(1); }}
          />
        </CardContent>
      </Card>

      {/* Table + Pagination */}
      <Card className="glass">
        <CardContent>
          <TablePagination
            totalPages={totalPages}
            currentPage={currentPage}
            totalItems={totalItems}
            onPrev={() => setPageNo((p) => Math.max(1, p - 1))}
            onNext={() => setPageNo((p) => Math.min(totalPages, p + 1))}
            onJump={(page) => setPageNo(page)}
          />

          <StoresTable stores={stores?.data ?? []} isLoading={isLoading} />

         
        </CardContent>
      </Card>
    </div>
  );
}
