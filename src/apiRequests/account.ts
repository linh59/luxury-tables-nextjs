import http from '@/lib/http'
import { AccountType } from '@/lib/schemaValidations/account.schema'

const accountApiRequest = {
    // gọi Next Route Handler (same-origin)
    
    me: () =>
        http.get<AccountType>("/v1/userinfo"),
}
export default accountApiRequest