import { getAccessTokenFromLocalStorage } from '@/lib/utils';
import envConfig from '../../config';

// ---------- Types ----------
export class HttpError extends Error {
  constructor(public status: number, public payload: any, message?: string) {
    super(message || 'HTTP Error');
  }
}
export type HttpResult<T> = { status: number; payload: T };

type Primitive = string | number | boolean | null | undefined;

export type CustomOptions = Omit<RequestInit, 'method'> & {
  baseUrl?: string;                    // default: env
  auth?: boolean;                      // default: true
  onUnauthorized?: () => void;         // per-request handler
  params?: Record<string, Primitive>;  // query string
  body?: any;                          // auto JSON.stringify (nếu không phải FormData)
};

// ---------- Small helpers ----------
const isAbs = (u: string) => /^https?:\/\//i.test(u);
const trimJoin = (b: string, p: string) => `${b.replace(/\/+$/, '')}/${p.replace(/^\/+/, '')}`;

const qs = (params?: Record<string, Primitive>) => {
  if (!params) return '';
  const u = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v !== '' && v != null) u.append(k, String(v));
  const s = u.toString();
  return s ? `?${s}` : '';
};

async function safeJson<T>(res: Response): Promise<T> {
  const text = await res.text();
  if (!text) return {} as T;
  try { return JSON.parse(text) as T; } catch { return { message: text } as unknown as T; }
}

// ---------- Global 401 handler ----------
let globalOnUnauthorized: (() => void) | undefined;
export function setHttpHandlers(h: { onUnauthorized?: () => void }) {
  globalOnUnauthorized = h.onUnauthorized ?? globalOnUnauthorized;
}

// ---------- Core request ----------
async function request<T>(
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  url: string,
  opt: CustomOptions = {}
): Promise<HttpResult<T>> {
  const base = opt.baseUrl === undefined ? envConfig.NEXT_PUBLIC_API_ENDPOINT : opt.baseUrl;
  let full = isAbs(url) ? url : base ? trimJoin(base, url) : `/${url.replace(/^\/+/, '')}`;
  full += qs(opt.params);

  const isFD = opt.body instanceof FormData;

  const headers: HeadersInit = isFD
    ? (opt.headers || {})
    : { 'Content-Type': 'application/json', ...(opt.headers || {}) };

  // attach token
  const useAuth = opt.auth !== false;
  if (useAuth && !(headers as Record<string, string>)['Authorization']) {
    const token = typeof window !== 'undefined' ? getAccessTokenFromLocalStorage() : null;
    if (token) (headers as Record<string, string>)['Authorization'] = token;
  }

  const body = isFD ? (opt.body as FormData) : opt.body != null ? JSON.stringify(opt.body) : undefined;

  const res = await fetch(full, {
    ...opt,
    method,
    headers,
    body,
    credentials: base ? 'omit' : 'include',
    cache: method === 'GET' ? opt.cache : 'no-store',
  });

  const payload = await safeJson<T>(res);

  if (!res.ok) {
    if (res.status === 401) {
      try { (opt.onUnauthorized ?? globalOnUnauthorized)?.(); } catch { /* ignore */ }
    }
    throw new HttpError(res.status, payload, res.statusText || 'Request failed');
  }
  return { status: res.status, payload };
}

// ---------- Public API ----------
const http = {
  get<T>(url: string, options?: Omit<CustomOptions, 'body'>) { return request<T>('GET', url, options as CustomOptions); },
  post<T>(url: string, body?: any, options?: Omit<CustomOptions, 'body'>) { return request<T>('POST', url, { ...(options || {}), body }); },
  put<T>(url: string, body?: any, options?: Omit<CustomOptions, 'body'>) { return request<T>('PUT', url, { ...(options || {}), body }); },
  patch<T>(url: string, body?: any, options?: Omit<CustomOptions, 'body'>) { return request<T>('PATCH', url, { ...(options || {}), body }); },
  delete<T>(url: string, options?: Omit<CustomOptions, 'body'>) { return request<T>('DELETE', url, options as CustomOptions); },
};

export default http;
