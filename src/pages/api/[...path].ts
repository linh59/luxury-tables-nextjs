import { NextApiRequest, NextApiResponse } from "next";
import httpProxy from 'http-proxy';

export const config = {
  api: { bodyParser: false, externalResolver: true },
};


const proxy = httpProxy.createProxyServer();

export default function handler(req: NextApiRequest, res: NextApiResponse) {

  req.headers.cookie = '';
  // process.env.NEXT_PUBLIC_API_ENDPOINT

  const target = 'https://staging-api.swa-pay.com';


  proxy.web(req, res, {
    target: target,
    changeOrigin: true,
    selfHandleResponse: false,

  });

}