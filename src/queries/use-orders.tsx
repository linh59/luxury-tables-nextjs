import {  useQuery, UseQueryOptions } from '@tanstack/react-query';
import {  StoreParamsType } from '@/lib/schema-validations/stores.schema';
import { QueryKeyOrders } from '@/constants/query-key';
import { OrderListRes } from '@/constants/order-type';
import ordersApiRequest from '@/api-client/orders';

type OrdersQueryOptions = Omit<UseQueryOptions<OrderListRes>, 'queryKey' | 'queryFn'>;

export function useOrders(filters?: StoreParamsType, options?: OrdersQueryOptions) {

    return useQuery<OrderListRes>({
        ...options,
        queryKey: QueryKeyOrders.ORDERS(
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
            const res = await ordersApiRequest.fetchOrders(filters);
            return res.data;
        },
        staleTime: 10_000,                 // giảm tải server, tránh refetch quá dày
        refetchOnWindowFocus: true,        // quay lại tab sẽ refetch
        refetchOnReconnect: true,
        refetchInterval: (query) => {
            const data = query.state.data;

            if (!data) return 5_000;         // lần đầu: 5s
            const hasPending = data.data.some(o => ["ACTIVE_FLAG", "WAITING_FOR_PAYMENT"].includes(o.status));
            return hasPending ? 5_000 : false; // còn pending thì 5s, hết thì dừng
        },
        
    });
}
