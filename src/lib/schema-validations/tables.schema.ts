import { PageableSchema, SortSchema } from "@/lib/schema-validations/common.schema";
import { z } from "zod";


export const PaymentMethodEnum = z.enum(["CREDIT_CARD"]); // mở rộng nếu BE có thêm
export const GatewayTypeEnum = z.enum(["GMO_GATEWAY"]);   // mở rộng nếu BE có thêm
export const StoreStatusEnum = z.enum(["STORE_ACTIVE"]);   // mở rộng nếu BE có thêm

export const StoreSchema = z.object({
  id: z.string(),
  store_name: z.string(),
  office_name: z.string().nullable(),
  status: StoreStatusEnum,
  address: z.string().nullable(),
  address2: z.string().nullable(),
  phone: z.string().nullable().or(z.string()), // BE đang trả "4332543" (string); để an toàn cho null
  amount: z.number(),
  payment_methods: z.array(PaymentMethodEnum),
  flag_amount: z.boolean(),
  merchant_display_based_on_the_specified_commercial_law: z.string().nullable(),
  min_amount: z.number().nullable(),
  max_amount: z.number().nullable(),
  limit_amount: z.boolean(),
  applepay: z.any().nullable(),
  fincode_google_pay_info: z.any().nullable(),
  gateway_type: GatewayTypeEnum,
  waiting_complete: z.boolean(),
  methods: z.array(z.unknown()),
  flag_specified_commercial_law: z.boolean(),
  receipt_enabled: z.boolean(),
  send_payment_success_email: z.boolean(),
});

/** ---- Table item ---- */
export const TableStatusEnum = z.enum(["Vacant"]); // bổ sung nếu có thêm: "Occupied", "Processing", ...
export const TableSchema = z.object({
  id: z.string(),
  store: StoreSchema,
  name: z.string(),                 // "1", "2", ...
  description: z.string().nullable(),
  status: TableStatusEnum,          // hiện đang thấy "Vacant"
  created_at: z.string().datetime(),// ISO datetime string
  updated_at: z.string().datetime(),
  user_create: z.string(),
  user_update: z.string(),
  table_qrcode: z.any().nullable(),
  payment_request: z.any().nullable(),
  sort_no: z.number(),
  group: z.any().nullable(),        // hiện null; nếu có shape cụ thể thì thay thế
});

/** ---- Top-level response ---- */
export const TableListResponseSchema = z.object({
  content: z.array(TableSchema),
  pageable: PageableSchema,
  total_elements: z.number(),
  total_pages: z.number(),
  last: z.boolean(),
  sort: SortSchema,
  size: z.number(),
  number: z.number(),
  first: z.boolean(),
  number_of_elements: z.number(),
  empty: z.boolean(),
});

export type Store = z.infer<typeof StoreSchema>;
export type TableItem = z.infer<typeof TableSchema>;
export type TableListResponse = z.infer<typeof TableListResponseSchema>;

/** ---- Usage example ---- */
// const data: unknown = await api.fetchTables(...);
// const parsed = TableListResponseSchema.parse(data);
