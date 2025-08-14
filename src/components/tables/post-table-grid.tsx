
import React, { useEffect } from 'react';
import { Table } from '@/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface POSTableGridProps {
  tables: Table[];
  onTableClick: (table: Table) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  maxColumnsPerRow: number;
}

export const POSTableGrid: React.FC<POSTableGridProps> = ({
  tables,
  onTableClick,
  currentPage,
  totalPages,
  onPageChange,
  maxColumnsPerRow,
}) => {
  const { t } = useLanguage();

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && currentPage > 1) {
        onPageChange(currentPage - 1);
      } else if (e.key === 'ArrowRight' && currentPage < totalPages) {
        onPageChange(currentPage + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, totalPages, onPageChange]);

  const getStatusClass = (status: string): string => {
    switch (status) {
      case 'empty':
        return 'border-border bg-background hover:bg-muted/50';
      case 'eating':
        return 'border-amber-300 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/30 dark:hover:bg-amber-950/50';
      case 'processing':
        return 'border-cyan-300 bg-cyan-50 hover:bg-cyan-100 dark:bg-cyan-950/30 dark:hover:bg-cyan-950/50';
      case 'paid':
        return 'border-green-300 bg-green-50 hover:bg-green-100 dark:bg-green-950/30 dark:hover:bg-green-950/50';
      default:
        return 'border-border bg-background hover:bg-muted/50';
    }
  };

  const getStatusBadgeClass = (status: string): string => {
    switch (status) {
      case 'empty':
        return 'bg-muted text-muted-foreground border-border';
      case 'eating':
        return 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/50 dark:text-amber-200';
      case 'processing':
        return 'bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-900/50 dark:text-cyan-200';
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-200';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getStatusLabel = (status: string): string => {
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

  return (
    <div className="relative">
      {/* Previous Button */}
      <Button
        variant="outline"
        size="icon"
        className={cn(
          "absolute left-[-60px] top-1/2 -translate-y-1/2 z-10 h-14 w-14 rounded-full shadow-lg bg-background",
          "hover:scale-105 transition-all duration-200 border-2",
          currentPage === 1 && "opacity-50 cursor-not-allowed"
        )}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        title="Previous page (←)"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>

      {/* Next Button */}
      <Button
        variant="outline"
        size="icon"
        className={cn(
          "absolute right-[-60px] top-1/2 -translate-y-1/2 z-10 h-14 w-14 rounded-full shadow-lg bg-background",
          "hover:scale-105 transition-all duration-200 border-2",
          currentPage === totalPages && "opacity-50 cursor-not-allowed"
        )}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        title="Next page (→)"
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Tables Grid */}
      <div 
        className="grid gap-3 p-1"
        style={{
          gridTemplateColumns: `repeat(${Math.min(maxColumnsPerRow, tables.length || 1)}, minmax(0, 1fr))`,
        }}
      >
        {tables.map((table) => (
          <Card
            key={table.id}
            className={cn(
              "cursor-pointer transition-all duration-200 transform hover:scale-[1.02] focus:scale-[1.02]",
              "aspect-square flex flex-col items-center justify-center p-4 rounded-xl border-2",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
              "shadow-sm hover:shadow-md",
              getStatusClass(table.status)
            )}
            onClick={() => onTableClick(table)}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onTableClick(table);
              }
            }}
            title={`#${table.number} – ${getStatusLabel(table.status)}`}
          >
            <div className="text-3xl font-bold font-luxury mb-2 text-foreground">
              {table.number}
            </div>
            <div 
              className={cn(
                "text-xs font-medium px-2 py-1 rounded-full border text-center min-w-[60px]",
                getStatusBadgeClass(table.status)
              )}
            >
              {getStatusLabel(table.status)}
            </div>
            {table.amount && (
              <div className="text-sm font-semibold text-primary mt-2">
                ${table.amount.toFixed(2)}
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* No Results */}
      {tables.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg">
            {t('tables.noTablesFound')}
          </p>
        </div>
      )}
    </div>
  );
};
