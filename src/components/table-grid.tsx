
'use client'
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Table, TableStatus } from '../../types';
import { useTranslations } from 'next-intl';

interface TableGridProps {
  tables: Table[];
  onTableClick: (table: Table) => void;
}

export const TableGrid: React.FC<TableGridProps> = ({ tables, onTableClick }) => {
  const t = useTranslations();
  const [currentPage, setCurrentPage] = useState(1);
  const tablesPerPage = 12;
  
  const totalPages = Math.ceil(tables.length / tablesPerPage);
  const startIndex = (currentPage - 1) * tablesPerPage;
  const endIndex = startIndex + tablesPerPage;
  const currentTables = tables.slice(startIndex, endIndex);

  const getStatusClass = (status: TableStatus): string => {
    switch (status) {
      case 'empty':
        return 'table-empty hover:bg-muted/50 cursor-pointer';
      case 'eating':
        return 'table-eating hover:bg-table-eating/20 cursor-pointer';
      case 'processing':
        return 'table-processing hover:bg-table-processing/20 cursor-pointer animate-[border-blink_2s_linear_infinite]  ';
      case 'paid':
        return 'table-paid hover:bg-table-paid/20 cursor-pointer';
      default:
        return 'table-empty';
    }
  };

  const getStatusLabel = (status: TableStatus): string => {
    switch (status) {
      case 'empty':
        return t('tables.available');
      case 'eating':
        return t('tables.occupied');
      case 'processing':
        return t('tables.processing');
      case 'paid':
        return t('tables.paid');
      default:
        return t('tables.available');
    }
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'empty': return 'status-empty';
      case 'eating': return 'status-eating';
      case 'processing': return 'status-processing';
      case 'paid': return 'status-paid';
      default: return 'status-empty';
    }
  };

  return (
    <div className="space-y-6">
      {/* Tables Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {currentTables.map((table) => (
          <Card
            key={table.id}
            className={`${getStatusClass(table.status)} p-4 transition-all duration-200 transform hover:scale-105 shadow-luxury border-2  border-transparent`}
            onClick={() => onTableClick(table)}
          >
            <div className="text-center space-y-2">
              <div className="text-2xl font-elegant font-semibold">
                {table.number}
              </div>
              <span className={` status-badge ${getStatusColor(table.status)} text-xs`}>
                {getStatusLabel(table.status)}
              </span>
              {table.amount && (
                <div className="text-sm font-medium text-luxury-gold">
                  ${table.amount.toFixed(2)}
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className={currentPage === page ? "btn-luxury" : ""}
              >
                {page}
              </Button>
            ))}
          </div>
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* No Results Message */}
      {currentTables.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">{t('tables.noTablesFound')}</p>
        </div>
      )}
    </div>
  );
};
