import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from '@/i18n/routing';

// i18n middleware từ next-intl
const intl = createIntlMiddleware(routing);

export default function middleware(req: NextRequest) {
  const {pathname} = req.nextUrl;
  // Tách locale từ URL: /vi/... hoặc /en/...
  const parts = pathname.split('/');            // ["", "vi", "tables"]
  const maybeLocale = parts[1];
  const supported = (routing.locales as readonly string[]).includes(maybeLocale as any);
  const locale = supported ? (maybeLocale as string) : routing.defaultLocale;

  // Path bỏ locale: "/login", "/tables", ...
  const pathNoLocale = supported ? `/${parts.slice(2).join('/')}` : pathname;

  // Auth rules
  const token = req.cookies.get('accessToken')?.value ?? null;
  const isLogin = pathNoLocale === '/login';
  const requiresAuth = pathNoLocale.startsWith('/tables'); // thêm các path bảo vệ khác nếu cần
  // 1) Chưa login mà vào /tables -> về /{locale}/login
  if (requiresAuth && !token) {
    const url = req.nextUrl.clone();
    url.pathname = `/${locale}/login`;
    return NextResponse.redirect(url);
  }

  // 2) Đã login mà vào /login -> sang /{locale}/tables
  if (isLogin && token) {
    const url = req.nextUrl.clone();
    url.pathname = `/${locale}/tables`;
    return NextResponse.redirect(url);
  }

  // Cuối cùng để i18n xử lý prefix /vi mặc định, rewrite/redirect phù hợp
  return intl(req);
}

export const config = {
  // Chạy trên tất cả path ngoại trừ /api, /_next và file tĩnh
  matcher: ['/', '/((?!api|_next|.*\\..*).*)'],
};
