import { NextResponse } from 'next/server'
import type { JwtPayload } from 'jsonwebtoken'
import jwt from 'jsonwebtoken'
import envConfig from '../../../../../config'
const looksJwt = (s: unknown) =>
    typeof s === 'string' && /^\S+\.\S+\.\S+$/.test(s)

/** Tìm chuỗi có vẻ là JWT ở deep-nested object */
function findTokenDeep(obj: any): string | undefined {
    if (!obj || typeof obj !== 'object') return undefined
    for (const [k, v] of Object.entries(obj)) {
        if (typeof v === 'string' && looksJwt(v) && /(token|jwt|access)/i.test(k)) {
            return v
        }
        if (typeof v === 'object') {
            const t = findTokenDeep(v)
            if (t) return t
        }
    }
    return undefined
}

export async function POST(req: Request) {
    try {
        const body = await req.json()

        const beUrl = `${envConfig.NEXT_PUBLIC_API_ENDPOINT.replace(/\/$/, '')}/v1/console/login`
        const r = await fetch(beUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify(body),
            cache: 'no-store'
        })

        const text = await r.text()
        let payload: any
        try { payload = text ? JSON.parse(text) : {} } catch { payload = { raw: text } }

        if (!r.ok) {
            // Trả nguyên lỗi từ BE để thấy đúng cấu trúc
            return NextResponse.json(payload, { status: r.status })
        }

        // 1) Ưu tiên header Authorization: Bearer <jwt>
        const authHeader = r.headers.get('authorization') || r.headers.get('Authorization') || ''
        const tokenFromHeader = authHeader.toLowerCase().startsWith('bearer ')
            ? authHeader.split(' ')[1]
            : undefined

        // 2) Các ứng viên phổ biến
        const candidates = [
            payload?.data?.token,
            payload?.data?.accessToken,
            payload?.token,
            payload?.accessToken,
            payload?.jwt,
            payload?.id_token,
            tokenFromHeader
        ].filter(Boolean) as string[]

        // 3) Chọn ứng viên có dạng JWT, nếu chưa có thì quét sâu
        let token = candidates.find(looksJwt)
        if (!token) token = findTokenDeep(payload)

        if (!token) {
            return NextResponse.json(
                {
                    message: 'Token not found',
                    // Debug để bạn xem nhanh BE trả gì mà không lộ toàn bộ dữ liệu
                    debug: {
                        topLevelKeys: payload && typeof payload === 'object' ? Object.keys(payload) : null,
                        dataKeys:
                            payload?.data && typeof payload.data === 'object'
                                ? Object.keys(payload.data)
                                : null,
                        sample:
                            typeof payload === 'string' ? payload.slice(0, 300) : undefined
                    }
                },
                { status: 400 }
            )
        }

        const decoded = jwt.decode(token) as JwtPayload | null
        const res = NextResponse.json(payload)

        res.cookies.set('accessToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            ...(decoded?.exp ? { expires: new Date(decoded.exp * 1000) } : { maxAge: 60 * 60 * 24 })
        })
        console.log(token)
        

        return res
    } catch (err) {
        console.error('Login route error:', err)
        return NextResponse.json({ message: 'Internal error' }, { status: 500 })
    }
}
