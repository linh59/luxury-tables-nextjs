import axiosClient from '@/api-client/axios-client'
import { AccountType, AccountUpdateFormSchemaType, PasswordFormDataResType, PasswordFormDataType } from '@/lib/schema-validations/account.schema'

const accountApiRequest = {
    me: () => axiosClient.get<AccountType>("/v1/userinfo"),
    updateProfile: (data: AccountUpdateFormSchemaType) => axiosClient.put<AccountType>("/v1/userinfo", data),
    changePassword: (data: PasswordFormDataType) => axiosClient.put<PasswordFormDataResType>("/v1/userinfo/change_password", data),
}
export default accountApiRequest