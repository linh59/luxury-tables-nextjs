import z from 'zod'
import { Role } from '../../../constants/type'

export const LoginBody = z
  .object({
    email: z.string().min(1, { message: 'required' }).email({
      message: 'invalidEmail'
    }),
    password: z.string().min(6, 'minmaxPassword').max(100, 'minmaxPassword')
  })
  .strict()

export type LoginBodyType = z.TypeOf<typeof LoginBody>

export const LoginRes = z.object({
  data: z.object({
    id: z.number(),
    token: z.string(),
    email: z.string(),
    user_role: z.enum([Role.Admin, Role.Employee]),
    // refreshToken: z.string(),
  }),
  message: z.string()
})

export type LoginResType = z.TypeOf<typeof LoginRes>

export const LoginEmployeeBody = z
  .object({
    username: z.string().trim().min(1, 'required'),
    password: z.string().min(6, 'minmaxPassword').max(100, 'minmaxPassword')
  })
  .strict()

export type LoginEmployeeBodyType = z.TypeOf<typeof LoginEmployeeBody>


export const RefreshTokenBody = z
  .object({
    refreshToken: z.string()
  })
  .strict()

export type RefreshTokenBodyType = z.TypeOf<typeof RefreshTokenBody>

export const RefreshTokenRes = z.object({
  data: z.object({
    accessToken: z.string(),
    refreshToken: z.string()
  }),
  message: z.string()
})

export type RefreshTokenResType = z.TypeOf<typeof RefreshTokenRes>

export const LogoutBody = z
  .object({
    refreshToken: z.string()
  })
  .strict()

export type LogoutBodyType = z.TypeOf<typeof LogoutBody>

export const LoginGoogleQuery = z.object({
  code: z.string()
})

export type LoginGoogleQueryType = z.TypeOf<typeof LoginGoogleQuery>
