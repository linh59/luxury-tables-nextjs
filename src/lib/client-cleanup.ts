// lib/client-cleanup.ts
export function clientCleanup(options?: {
  keepLocalKeys?: string[];
  keepCookies?: string[];
}) {
  if (typeof window === 'undefined') return;

  const keepLocal = new Set(options?.keepLocalKeys ?? ['theme', 'NEXT_LOCALE', 'currentLanguage']);

  // 1) localStorage
  try {
    Object.keys(localStorage).forEach((k) => {
      if (!keepLocal.has(k)) localStorage.removeItem(k);
    });
  } catch {}

  // 2) sessionStorage
  try {
    sessionStorage.clear();
  } catch {}

  // 3) Cookies không-HttpOnly (server không xoá được)
  try {
    const keepCookies = new Set(options?.keepCookies ?? ['NEXT_LOCALE']);
    document.cookie.split(';').forEach((c) => {
      const name = c.split('=')[0]?.trim();
      if (name && !keepCookies.has(name)) {
        // xoá cookie ở path '/'
        document.cookie = `${name}=; Max-Age=0; path=/`;
      }
    });
  } catch {}
}
