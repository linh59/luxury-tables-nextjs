import z from 'zod'
import { Role } from '../../constants/type'

export const AccountSchema = z.object({
  id: z.number(),
  display_name: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  email: z.email('Invalid email format'),
  role: z.enum([Role.Admin, Role.Employee]),
  avatar: z.string().nullable(),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format').optional().or(z.literal('')),
})

export type AccountType = z.TypeOf<typeof AccountSchema>

export const AccountUpdateFormSchema = z.object({
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  email: z.email('Invalid email format'),
  // role: z.enum([Role.Admin, Role.Employee]),
  avatar: z.string().optional(),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format').optional().or(z.literal('')),
})

export type AccountUpdateFormSchemaType = z.TypeOf<typeof AccountUpdateFormSchema>


export const AccountListRes = z.object({
  data: z.array(AccountSchema),
  message: z.string()
})

export type AccountListResType = z.TypeOf<typeof AccountListRes>

export const AccountRes = z
  .object({
    data: AccountSchema,
    message: z.string()
  })
  .strict()

export type AccountResType = z.TypeOf<typeof AccountRes>


export const AccountIdParam = z.object({
  id: z.coerce.number()
})

export type AccountIdParamType = z.TypeOf<typeof AccountIdParam>


export const PasswordSchema = z.object({
  password: z.string().min(1, 'Current password is required'),
  new_password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/(?=.*[a-z])/, 'Password must contain at least one lowercase letter')
    .regex(/(?=.*[A-Z])/, 'Password must contain at least one uppercase letter')
    .regex(/(?=.*\d)/, 'Password must contain at least one number'),
  re_new_password: z.string(),
}).refine((data) => data.new_password === data.re_new_password, {
  message: "Passwords don't match",
  path: ["confirmNewPassword"],
}).refine((data) => data.re_new_password !== data.password, {
  message: "New password must be different from current password",
  path: ["newPassword"],
});

export type PasswordFormDataType = z.infer<typeof PasswordSchema>;

export const PasswordFormDataRes = z
  .object({
    code: z.string(),
    message: z.string()
  })
  .strict()

export type PasswordFormDataResType = z.TypeOf<typeof PasswordFormDataRes>

