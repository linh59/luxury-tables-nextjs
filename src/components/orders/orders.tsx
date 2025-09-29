'use client';
import OrdersTable from "@/components/orders/orders-table";
import { OrderStatusOption, OrderStatusOptionValues } from "@/constants/order-type";
import { SortByOption, SortDirOption } from "@/constants/type";
import { useOrders } from "@/queries/use-orders";
import { useTranslations } from "next-intl";
import { useState } from "react";

const  Orders = () => {
  const t = useTranslations();
  // paging
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(50);

  const {data: orders, isLoading} = useOrders({
        page_no: pageNo,
        page_size: pageSize,
        sort_by: SortByOption.create_date,
        sort_dir: SortDirOption.desc,
  });

  return  <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-luxury font-bold">{t('sidebar.transactions')}</h1>
      </div>
     {orders && <OrdersTable orders={orders.data} isLoading={isLoading} />}
    
  </div>;
}
export default Orders;