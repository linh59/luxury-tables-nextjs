'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { DateFilterType, DateFilterValues, StoreStatusUIType, StoreStatusUIValues } from '@/constants/type';
import { useTranslations } from 'next-intl';




type Props = {
    // search
    searchTerm: string;
    onSearchChange: (v: string) => void;
    // status
    status: StoreStatusUIType;
    onStatusChange: (v: StoreStatusUIType) => void;
    // date
    dateFilter: DateFilterType;
    onDateFilterChange: (v: DateFilterType) => void;
    startDate?: string;
    endDate?: string;
    onStartDateChange: (v?: string) => void;
    onEndDateChange: (v?: string) => void;
    // paging size
    pageSize: number;
    onPageSizeChange: (v: number) => void;
};

export default function StoresFilters({
    searchTerm, onSearchChange,
    status, onStatusChange,
    dateFilter, onDateFilterChange,
    startDate, endDate, onStartDateChange, onEndDateChange,
    pageSize, onPageSizeChange,
}: Props) {
    const t = useTranslations();
    return (
        <div className="flex flex-col md:grid md:grid-cols-12 gap-4 items-start md:items-end">
            {/* Search */}
            <div className="md:col-span-5 w-full">
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        id="search"
                        placeholder="Search by name or phone…"
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            {/* Status */}
            <div className="md:col-span-2 w-full">
                <Label>Status</Label>
                <Select value={status} onValueChange={(v: StoreStatusUIType) => onStatusChange(v)}>
                    <SelectTrigger className="w-full">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {StoreStatusUIValues.map((s) => (
                            <SelectItem key={s} value={s}>
                                {t(`store.status.${s}`)}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Date preset */}
            <div className="md:col-span-2 w-full">
                <Label>Date Range</Label>
                <Select
                    value={dateFilter}
                    onValueChange={(v: DateFilterType) => onDateFilterChange(v)}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {DateFilterValues.map((value) => (
                            <SelectItem key={value} value={value}>
                                {t(`store.date.${value}`)}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Custom range (chỉ bật khi chọn custom) */}
            <div className="md:col-span-3 w-full grid grid-cols-2 gap-2">
                <div>
                    <Label>Start</Label>
                    <Input
                        type="date"
                        disabled={dateFilter !== 'custom'}
                        value={startDate ?? ''}
                        onChange={(e) => onStartDateChange(e.target.value || undefined)}
                    />
                </div>
                <div>
                    <Label>End</Label>
                    <Input
                        type="date"
                        disabled={dateFilter !== 'custom'}
                        value={endDate ?? ''}
                        onChange={(e) => onEndDateChange(e.target.value || undefined)}
                    />
                </div>
            </div>

            {/* Page size */}
            <div className="md:col-span-0 w-full">
                <Label>Page size</Label>
                <Select value={String(pageSize)} onValueChange={(v) => onPageSizeChange(Number(v))}>
                    <SelectTrigger className="w-full">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
