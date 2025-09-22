import { NextApiRequest, NextApiResponse } from "next";
import Cookies from 'cookies';

export default function loginHandler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(404).json({ message: "Method not allowed" });
    }
   
    const newCookie = new Cookies(req, res);
    newCookie.set('accessToken'); // xóa cookie

    res.status(200).json({ message: 'Logout successful' });
    return;
}