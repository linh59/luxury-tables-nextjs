import { DateFilterType } from '@/constants/type';

export function getPresetDateRange(
  filter: DateFilterType
): { start_date?: string; end_date?: string } {
  if (filter === 'all') return {};

  const end = new Date();
  const start = new Date();

  if (filter === 'today') {
    start.setHours(0, 0, 0, 0);
  } else if (filter === 'week') {
    start.setDate(end.getDate() - 7);
    start.setHours(0, 0, 0, 0);
  }

  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  return { start_date: fmt(start), end_date: fmt(end) };
}

export function formatDate(d: string) {
    // BE trả ISO → hiện ngắn gọn, tuỳ bạn đổi theo locale
    try { return new Date(d).toLocaleString(); } catch { return d; }
}