import { EntityError, ENTITY_ERROR_STATUS, type EntityErrorPayload } from '@/lib/error'
import envConfig from '../../config'

export class HttpError extends Error {
  status: number
  payload: any
  constructor(status: number, payload: any, message?: string) {
    super(message || 'HTTP Error')
    this.status = status
    this.payload = payload
  }
}


async function readPayloadSafe<T>(res: Response): Promise<T> {
  const text = await res.text()
  if (!text) return {} as T
  try { return JSON.parse(text) as T } catch { return { message: text } as unknown as T }
}

function joinUrl(base: string, path: string) {
  const b = base.replace(/\/+$/, '')
  const p = path.replace(/^\/+/, '')
  return `${b}/${p}`
}

export type CustomOptions = Omit<RequestInit, 'method'> & { baseUrl?: string }
export type HttpResult<T> = { status: number; payload: T }

async function request<ResponseBody>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  url: string,
  options?: CustomOptions
): Promise<HttpResult<ResponseBody>> {
  const baseUrl = options?.baseUrl === undefined ? envConfig.NEXT_PUBLIC_API_ENDPOINT : options.baseUrl
  const fullUrl = baseUrl ? joinUrl(baseUrl, url) : `/${url.replace(/^\/+/, '')}`

  const isFormData = options?.body instanceof FormData

  const headers: Record<string, string> = isFormData
    ? { ...(options?.headers as any) }
    : { 'Content-Type': 'application/json', ...(options?.headers as any) }

  const body = isFormData ? (options?.body as FormData) : options?.body ? JSON.stringify(options?.body) : undefined

  const res = await fetch(fullUrl, {
    ...options,
    method,
    headers,
    body,
    credentials: baseUrl ? 'omit' : 'include', // same-origin ('' baseUrl) sẽ gửi cookie
    cache: method === 'GET' ? options?.cache : 'no-store'
  })

  const payload = await readPayloadSafe<ResponseBody>(res)

  if (!res.ok) {
    if (res.status === ENTITY_ERROR_STATUS) {
      throw new EntityError({ status: ENTITY_ERROR_STATUS, payload: payload as any as EntityErrorPayload })
    }
    throw new HttpError(res.status, payload, res.statusText || 'Request failed')
  }

  // 🔧 Quan trọng: trả về kết quả
  return { status: res.status, payload }
}

const http = {
  get<ResponseBody>(url: string, options?: Omit<CustomOptions, 'body'>) {
    return request<ResponseBody>('GET', url, options)
  },
  post<ResponseBody>(url: string, body: any, options?: Omit<CustomOptions, 'body'>) {
    return request<ResponseBody>('POST', url, { ...options, body })
  },
  put<ResponseBody>(url: string, body: any, options?: Omit<CustomOptions, 'body'>) {
    return request<ResponseBody>('PUT', url, { ...options, body })
  },
  delete<ResponseBody>(url: string, options?: Omit<CustomOptions, 'body'>) {
    return request<ResponseBody>('DELETE', url, options)
  }
}
export default http
