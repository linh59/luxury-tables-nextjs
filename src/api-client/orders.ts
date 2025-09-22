// apiRequests/stores.ts
import axiosClient from '@/api-client/axios-client'
import { OrderListRes, OrderParams } from '@/constants/order-type'

const urlMerchant = 'merchant'



const ordersApiRequest = {
fetchOrders(params?: OrderParams) {
    return axiosClient.get<OrderListRes>(`/v1/${urlMerchant}/products`, { params })
}

}
export default ordersApiRequest
