// apiRequests/stores.ts
import http from '@/lib/http'
import { StoreListResType, StoreParamsType } from '@/lib/schema-validations/stores.schema'

const urlMerchant = '/v1/merchant'



const storesApiRequest = {
  fetchStores: (params?: Partial<StoreParamsType>) =>
   http.get<StoreListResType>(`${urlMerchant}/stores`, { params }),

}
export default storesApiRequest
