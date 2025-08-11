import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import env from '../../../../../config';
/**
 * POST /api/auth/logout
 * - Proxy tới BE: {NEXT_PUBLIC_API_ENDPOINT}/v1/logout
 * - Xoá cookie đăng nhập ở phía server
 */
export async function POST() {
  const jar = await cookies();
  const token = jar.get('accessToken')?.value;

  // Gọi BE /api/v1/logout (NEXT_PUBLIC_API_ENDPOINT ví dụ: https://staging-api.swa-pay.com/api)
  if (token) {
    const url = `${env.NEXT_PUBLIC_API_ENDPOINT.replace(/\/$/, '')}/v1/logout`;
    try {
      await fetch(url, {
        method: 'POST', // đổi nếu BE yêu cầu method khác
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        // body: JSON.stringify({}), // nếu BE cần body
        cache: 'no-store',
      });
    } catch {
      // Bỏ qua lỗi BE để vẫn logout local cho mượt
    }
  }

  const res = NextResponse.json({ ok: true });

  // Xoá cookie HttpOnly do server set
  const common = {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    expires: new Date(0),
  };

  // accessToken
  res.cookies.set('accessToken', '', { ...common, httpOnly: true });
  // xoá cả bản non-HttpOnly (nếu lỡ có set nhầm trước đó)
  res.cookies.set('accessToken', '', { ...common });

  // nếu có xài sessionToken thì xoá luôn
  res.cookies.set('sessionToken', '', { ...common, httpOnly: true });
  res.cookies.set('sessionToken', '', { ...common });

  // KHÔNG xoá NEXT_LOCALE để giữ ngôn ngữ
  return res;
}
