
import accountApiRequest from "@/apiRequests/account";
import {  AccountType, AccountUpdateFormSchemaType } from "@/lib/schemaValidations/account.schema";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useProfile =  () => {
    return useQuery<AccountType>({
        queryKey: ['profile'],
        queryFn: async () => {
            const res = await accountApiRequest.me();
            return res.payload;
        },
       
      
       
    });
}

export const useUpdateProfileMutation = () => {
    return useMutation<AccountType, Error, AccountUpdateFormSchemaType>({
        mutationFn: async (data) => {
            const res = await accountApiRequest.updateProfile(data);
            return res.payload;
        },
        onSuccess: (data) => {
            console.log('Profile updated successfully:', data);
        },
        onError: (error) => {
            console.error('Error updating profile:', error);
        }
    });
}

