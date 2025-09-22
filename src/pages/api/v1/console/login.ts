import { NextApiRequest, NextApiResponse } from "next";
import httpProxy, { ProxyResCallback } from 'http-proxy';
import Cookies from 'cookies';
export const config = {
    api: { bodyParser: false, externalResolver: true },
};
const proxy = httpProxy.createProxyServer();
export default function loginHandler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(404).json({ message: "Method not allowed" });
    }
    return new Promise<void>((resolve) => {

        const onHandlerLoginResponse: ProxyResCallback = (proxyRes) => {
            let body = '';
            proxyRes.on('data', function (chunk: Buffer) {
                body += chunk;
                console.log('Body:', body);

            });

            proxyRes.on('end', function () {
                const statusCode = proxyRes.statusCode || 500;
                let data: any = null;
                try {
                    data = body ? JSON.parse(body) : null;
                } catch {
                    data = null;
                }
                const token = data?.token ?? data?.accessToken;

                if (statusCode === 200 || token) {
                    // Set cookie
                    const newCookie = new Cookies(req, res);
                    const isProduction = process.env.NODE_ENV !== 'development';
                    newCookie.set('accessToken', token, {
                        httpOnly: true,
                        secure: isProduction,
                        sameSite: 'lax',
                    })

                    res.status(200).json({ message: 'Login successful' });
                    
                    return resolve();

                }
                res.status(statusCode).json(data || { message: proxyRes.statusMessage || 'Error' });
               return resolve();

            });

        };

        proxy.once('proxyRes', onHandlerLoginResponse);
        proxy.once('error', (err) => {
            console.error('Proxy error:', err);
            res.status(500).json({ error: 'Proxy error' });
            resolve();
        })
        proxy.web(req, res, {
            target: process.env.NEXT_PUBLIC_API,
            changeOrigin: true,
            selfHandleResponse: true
        });
    });
}