
import accountApiRequest from "@/api-client/account";
import { AccountType, AccountUpdateFormSchemaType, PasswordFormDataType } from "@/lib/schema-validations/account.schema";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useProfile = () => {
    return useQuery<AccountType>({
        queryKey: ['profile'],
        queryFn: async () => {
            const res = await accountApiRequest.me();
            return res.data;
        },
        staleTime: 0,
        refetchOnMount: 'always',
        refetchOnWindowFocus: false,


    });
}

export const useUpdateProfileMutation = () => {
    return useMutation<AccountType, Error, AccountUpdateFormSchemaType>({
        mutationFn: async (data) => {
            const res = await accountApiRequest.updateProfile(data);
            return res.data;
        },
        onSuccess: (data) => {
            console.log('Profile updated successfully:', data);
        },
        onError: (error) => {
            console.error('Error updating profile:', error);
        }
    });
}

export const useChangePasswordMutation = () => {
    return useMutation({
        mutationFn: async (data: PasswordFormDataType) => {
            const res = await accountApiRequest.changePassword(data);
            return res.data;
        },
        onSuccess: () => {
            console.log('Password changed successfully');
        },
        onError: (error) => {
            console.error('Error changing password:', error);
        }
    });
}
