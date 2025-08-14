import z from 'zod'
import { SortDirOptionValues, StoreStatusAPI } from '../../constants/type'

export const StoreSchema = z.object({
  id: z.string(),
  store_name: z.string(),
  status: z.enum(StoreStatusAPI),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format').optional().or(z.literal('')),
  create_date: z.iso.datetime(),
})

export type StoreType = z.TypeOf<typeof StoreSchema>

export const StoreAddFormSchema = z.object({
  store_name: z.string().min(1, 'Store name is required'),
  avatar: z.string().optional(),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format').optional().or(z.literal('')),
})

export type StoreAddFormType = z.TypeOf<typeof StoreAddFormSchema>


export const StoreListRes = z.object({
  data: z.array(StoreSchema),
  last: z.boolean(),
  page_no: z.number(),
  page_size: z.number(),
  total_elements: z.number(),
  total_pages: z.number(),
})

export type StoreListResType = z.TypeOf<typeof StoreListRes>



export const StoreParamsSchema= z.object({
  status: z.enum(StoreStatusAPI).optional(),
  stores: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  // sort
  sort_by: z.string().optional(),               
  sort_dir: z.enum(SortDirOptionValues).optional(),

  // paging
  page_no: z.number().optional(),               
  page_size: z.number().optional(),            
})

export type StoreParamsType = z.TypeOf<typeof StoreParamsSchema>