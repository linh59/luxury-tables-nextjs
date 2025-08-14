import http from '@/lib/http'
import { AccountType, AccountUpdateFormSchemaType, PasswordFormDataResType, PasswordFormDataType } from '@/lib/schema-validations/account.schema'

const accountApiRequest = {
    // gọi Next Route Handler (same-origin)

    me: () => http.get<AccountType>("/v1/userinfo"),
    updateProfile: (data: AccountUpdateFormSchemaType) => http.put<AccountType>("/v1/userinfo", data),
    changePassword: (data: PasswordFormDataType) => http.put<PasswordFormDataResType>("/v1/userinfo/change_password", data),
}
export default accountApiRequest