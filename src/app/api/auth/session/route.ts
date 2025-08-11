import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { JwtPayload } from 'jsonwebtoken'
import jwt from 'jsonwebtoken'

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get('accessToken')?.value

  if (!token) return NextResponse.json({ authenticated: false }, { status: 200 })

  const decoded = jwt.decode(token) as JwtPayload | null
  if (!decoded) return NextResponse.json({ authenticated: false }, { status: 200 })

  const { exp, iat, ...claims } = decoded as any
  return NextResponse.json({ authenticated: true, exp, iat, user: claims }, { status: 200 })
}