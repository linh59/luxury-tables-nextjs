import axiosClient from '@/api-client/axios-client';
import http from '@/lib/http'
import { LoginBodyType, LoginEmployeeBodyType, LoginResType } from '@/lib/schema-validations/auth.schema';


const authApiRequest = {
    // gọi Next Route Handler (same-origin)
    login(body: LoginBodyType) {
        return axiosClient.post<LoginResType>('/v1/console/login', body)
    },
    loginEmployee(body: LoginEmployeeBodyType) {
        return axiosClient.post<LoginResType>('/v1/console/login', body)
    },


    logout: () => axiosClient.post('/v1/console/logout'),
    session: () => http.get<{ authenticated: boolean; user?: any; exp?: number }>('/api/auth/session', { baseUrl: '' })
}
export default authApiRequest