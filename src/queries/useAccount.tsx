
import accountApiRequest from "@/apiRequests/account";
import {  AccountType } from "@/lib/schemaValidations/account.schema";
import { useQuery } from "@tanstack/react-query";

export const useProfile =  () => {
    return useQuery<AccountType>({
        queryKey: ['profile'],
        queryFn: async () => {
            const res = await accountApiRequest.me();
            return res.payload;
        },
       
      
       
    });
}

