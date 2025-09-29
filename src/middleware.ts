// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from '@/i18n/routing';

const intl = createIntlMiddleware(routing);

// Các trang public (không cần login)
const PUBLIC_PREFIXES = ['/', '/login', '/signup', '/forgot-password', '/404'];

function isPublic(pathNoLocale: string): boolean {
  // Trang gốc
  if (pathNoLocale === '/') return true;

  // Các trang khác: match chính xác hoặc subpath
  return PUBLIC_PREFIXES.some(
    (p) => p !== '/' && (pathNoLocale === p || pathNoLocale.startsWith(p + '/')),
  );
}

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Lấy locale từ URL
  const parts = pathname.split('/'); // ["", "vi", "stores"]
  const maybeLocale = parts[1];
  const supported = (routing.locales as readonly string[]).includes(maybeLocale as any);
  const locale = supported ? (maybeLocale as string) : routing.defaultLocale;

  // Path bỏ locale để check
  const pathNoLocale = supported ? `/${parts.slice(2).join('/')}` : pathname;

  const token = req.cookies.get('accessToken')?.value ?? null;

  // 1) Nếu chưa login và không phải public page → redirect về login
  if (!isPublic(pathNoLocale) && !token) {
    const url = req.nextUrl.clone();
    url.pathname = `/${locale}/login`;
    return NextResponse.redirect(url);
  }

  // 2) Nếu đã login mà vẫn vào login/signup/forgot → đưa về trang mặc định
  if (
    token &&
    ['/login', '/signup', '/forgot-password'].some(
      (p) => pathNoLocale === p || pathNoLocale.startsWith(p + '/'),
    )
  ) {
    const url = req.nextUrl.clone();
    url.pathname = `/${locale}/tables`; // Trang mặc định sau login
    return NextResponse.redirect(url);
  }

  // 3) Các case còn lại để next-intl xử lý
  return intl(req);
}

export const config = {
  // Chạy trên tất cả path ngoại trừ /api, /_next, file tĩnh
  matcher: ['/', '/((?!api|_next|.*\\..*).*)'],
};
