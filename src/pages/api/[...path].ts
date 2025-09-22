import { NextApiRequest, NextApiResponse } from "next";
import httpProxy from 'http-proxy';
import Cookies from 'cookies';
export const config = {
  api: { bodyParser: false, externalResolver: true },
};


const proxy = httpProxy.createProxyServer();

export default function handler(req: NextApiRequest, res: NextApiResponse) {

  return new Promise<void>((resolve) => {
    // convert cookies to header authentication
    const newCookie = new Cookies(req, res);
    const accessToken = newCookie.get('accessToken');
    if (accessToken) {
      req.headers.authorization = `${accessToken}`;
    }
    // don't forward cookies to the target server
    req.headers.cookie = '';


    const target = process.env.NEXT_PUBLIC_API;


    proxy.web(req, res, {
      target: target,
      changeOrigin: true,
      selfHandleResponse: false,

    });

    proxy.once('proxyRes', () => resolve());
    proxy.once('error', (err) => {
      console.error('Proxy error:', err);
      res.status(500).json({ error: 'Proxy error' });
      resolve();
    })
  })
}