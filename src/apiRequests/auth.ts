import http from '@/lib/http'
import { LoginBodyType, LoginEmployeeBodyType, LoginResType } from '@/lib/schemaValidations/auth.schema';


const authApiRequest = {
    // gọi Next Route Handler (same-origin)
    login: (body: LoginBodyType) => http.post<LoginResType>('/api/auth/login', body, { baseUrl: '' }),
    loginEmployee: (body: LoginEmployeeBodyType) => http.post<LoginResType>('/api/auth/login', body, { baseUrl: '' }),

    logout: () => http.post<{ ok: true }>('/api/auth/logout', null, { baseUrl: '' }),
    session: () => http.get<{ authenticated: boolean; user?: any; exp?: number }>('/api/auth/session', { baseUrl: '' })
}
export default authApiRequest