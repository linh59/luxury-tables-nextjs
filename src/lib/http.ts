// src/lib/http.ts
import { getAccessTokenFromLocalStorage } from "@/lib/utils";
import envConfig from "../../config";

export class HttpError extends Error {
  constructor(public status: number, public payload: any, message?: string) {
    super(message || "HTTP Error");
  }
}

export type HttpResult<T> = { status: number; payload: T };
export type CustomOptions = Omit<RequestInit, "method"> & {
  baseUrl?: string;           // undefined -> dùng env
  auth?: boolean;             // default true -> tự gắn Authorization
  onUnauthorized?: () => void; // handler 401 theo request (ghi đè global)
};

const isAbs = (u: string) => /^https?:\/\//i.test(u);
const joinUrl = (b: string, p: string) =>
  `${b.replace(/\/+$/, "")}/${p.replace(/^\/+/, "")}`;

async function readSafe<T>(res: Response): Promise<T> {
  const text = await res.text();
  if (!text) return {} as T;
  try { return JSON.parse(text) as T; }
  catch { return { message: text } as unknown as T; }
}

// ===== Global handlers (set 1 lần ở AppProvider)
let globalOnUnauthorized: (() => void) | undefined;
export function setHttpHandlers(h: { onUnauthorized?: () => void }) {
  if (h.onUnauthorized) globalOnUnauthorized = h.onUnauthorized;
}

async function request<T>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  url: string,
  options?: CustomOptions
): Promise<HttpResult<T>> {
  const base =
    options?.baseUrl === undefined ? envConfig.NEXT_PUBLIC_API_ENDPOINT : options.baseUrl;
  const fullUrl = isAbs(url) ? url : base ? joinUrl(base, url) : `/${url.replace(/^\/+/, "")}`;

  const isFD = options?.body instanceof FormData;
  const headers: Record<string, string> = isFD
    ? { ...(options?.headers as any) }
    : { "Content-Type": "application/json", ...(options?.headers as any) };

  if (options?.auth !== false && !("Authorization" in headers)) {
    const token = typeof window !== "undefined" ? getAccessTokenFromLocalStorage() : null;
    if (token) headers["Authorization"] = token;
  }

  const body = isFD ? (options?.body as FormData) : options?.body ? JSON.stringify(options.body) : undefined;

  const res = await fetch(fullUrl, {
    ...options,
    method,
    headers,
    body,
    credentials: base ? "omit" : "include", // không gửi cookie cross-origin
    cache: method === "GET" ? options?.cache : "no-store",
  });

  const payload = await readSafe<T>(res);

  if (!res.ok) {
    // 401: gọi handler (per-request > global) rồi quăng lỗi
    if (res.status === 401) {
      try { (options?.onUnauthorized ?? globalOnUnauthorized)?.(); } catch {}
    }
    throw new HttpError(res.status, payload, res.statusText || "Request failed");
  }

  return { status: res.status, payload };
}

const http = {
  get<T>(url: string, options?: Omit<CustomOptions, "body">) {
    return request<T>("GET", url, options);
  },
  post<T>(url: string, body: any, options?: Omit<CustomOptions, "body">) {
    return request<T>("POST", url, { ...options, body });
  },
  put<T>(url: string, body: any, options?: Omit<CustomOptions, "body">) {
    return request<T>("PUT", url, { ...options, body });
  },
  delete<T>(url: string, options?: Omit<CustomOptions, "body">) {
    return request<T>("DELETE", url, options);
  },
};
export default http;
