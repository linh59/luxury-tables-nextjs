'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { toast } from 'sonner';
import authApiRequest from '@/apiRequests/auth';
import { clientCleanup } from '@/lib/client-cleanup';

type Props = React.ComponentProps<typeof Button> & {
  withConfirm?: boolean;
  onLoggedOut?: () => void;
};

export default function LogoutButton({
  withConfirm = false,
  onLoggedOut,
  className,
  ...btnProps
}: Props) {
  const router = useRouter();
  const locale = useLocale();
  const [loading, setLoading] = React.useState(false);

  const handleLogout = async () => {
    if (withConfirm && !window.confirm('Bạn chắc chắn muốn đăng xuất?')) return;
    setLoading(true);
    try {
      await authApiRequest.logout();     // xoá cookie HttpOnly ở server + gọi BE /v1/logout
      clientCleanup();                   // xoá storage & cookies non-HttpOnly ở client
      toast.success('Logged out');
      onLoggedOut?.();
      router.push(`/${locale}/login`);
      // refresh để server/middleware đọc trạng thái mới
      router.refresh();
    } catch (e: any) {
      toast.error(e?.message || 'Logout failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleLogout}
      disabled={loading}
      className={`h-9 w-9 text-destructive hover:text-destructive ${className ?? ''}`}
      {...btnProps}
    >
      <LogOut className="h-4 w-4" />
    </Button>
  );
}
