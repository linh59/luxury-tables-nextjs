
export const OrderStatusOption = {
  PAID_FLAG: 'PAID_FLAG',
  EXPIRED_FLAG: 'EXPIRED_FLAG',
  WAITING_FOR_PAYMENT: 'WAITING_FOR_PAYMENT'

} as const;

export const OrderStatusOptionValues = Object.values(OrderStatusOption) ;
export type OrderStatusOptionType = (typeof OrderStatusOptionValues)[number];

export type OrderDataType = {
    id: string,
    amount: number,
    created_at: string,
    status: OrderStatusOptionType,
    description?: string,
}

export type OrderListRes ={
  data: OrderDataType[],
  last: boolean,
  page_no: number,
  page_size: number,
  total_elements: number,
  total_pages: number,
}

export type OrderParams = {
  status?: string,
  stores?: string,
  start_date?: string,
  end_date?: string,
  // sort
  sort_by?: string,               
  sort_dir?: string,

  // paging
  page_no?: number,               
  page_size?: number,            
}

