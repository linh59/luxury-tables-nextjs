// queries/useStoresByFilters.ts
import { Query, useQuery, UseQueryOptions } from '@tanstack/react-query';
import storesApiRequest from '@/apiRequests/stores';
import { StoreListResType, StoreParamsType } from '@/lib/schema-validations/stores.schema';
import { QueryKeyStores } from '@/constants/query-key';

type StoreQueryOptions = Omit<UseQueryOptions<StoreListResType>, 'queryKey' | 'queryFn'>;

export function useStores(filters?: StoreParamsType, options?: StoreQueryOptions) {

    return useQuery<StoreListResType>({
        ...options,
        queryKey: QueryKeyStores.STORES(
            filters?.stores,
            filters?.status,
            filters?.start_date,
            filters?.end_date,
            filters?.page_no,
            filters?.page_size,
            filters?.sort_by,
            filters?.sort_dir
        ),
        queryFn: async () => {
            const res = await storesApiRequest.fetchStores(filters);
            return res.payload;
        },
        refetchOnWindowFocus: false,
    });
}
