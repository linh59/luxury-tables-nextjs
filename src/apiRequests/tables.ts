import http from '@/lib/http'
import { AccountType, AccountUpdateFormSchemaType, PasswordFormDataResType, PasswordFormDataType } from '@/lib/schema-validations/account.schema'
import { StoreListResType } from '@/lib/schema-validations/stores.schema'
import { urlMerchant } from '../constants/type'

const storesApiRequest = {

    fetchStores: (storeId: string) => http.get<StoreListResType>(`${urlMerchant}/products/store_table/${storeId}`),
}
export default storesApiRequest