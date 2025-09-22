// apiRequests/stores.ts
import axiosClient from '@/api-client/axios-client'
import { StoreListResType, StoreParamsType } from '@/lib/schema-validations/stores.schema'

const urlMerchant = 'merchant'



const storesApiRequest = {
fetchStores(params?: Partial<StoreParamsType>) {
    return axiosClient.get<StoreListResType>(`/v1/${urlMerchant}/stores`, { params })
}

}
export default storesApiRequest
