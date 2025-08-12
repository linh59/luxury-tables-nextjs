// app/components/app-providers.tsx
"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { setHttpHandlers } from "@/lib/http";
import { removeTokensFromLocalStorage } from "@/lib/utils";

export default function AppProviders({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setHttpHandlers({
      onUnauthorized: () => {
        try { removeTokensFromLocalStorage() } catch {}
        // tránh vòng lặp nếu đang ở trang login
        if (!pathname?.startsWith("/login")) router.replace("/login");
      },
    });
  }, [router, pathname]);

  return <>{children}</>;
}
