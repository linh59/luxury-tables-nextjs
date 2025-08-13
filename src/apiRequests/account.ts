import http from '@/lib/http'
import { AccountType, AccountUpdateFormSchemaType } from '@/lib/schemaValidations/account.schema'

const accountApiRequest = {
    // gọi Next Route Handler (same-origin)

    me: () => http.get<AccountType>("/v1/userinfo"),
    updateProfile: (data: AccountUpdateFormSchemaType) => http.put<AccountType>("/v1/userinfo", data),
}
export default accountApiRequest