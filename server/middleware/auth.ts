import {Request,Response,NextFunction} from "express";
import jwt from "jsonwebtoken";
import {TokenPayload} from '../types/types'
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-prod';

export async function verificationAccessToken(req: Request, res: Response, next: NextFunction){
    const {authorization} = req.headers;

    try {
        const token = authorization?.split(' ')[1] ;
        if (!token) return res.status(401).json({ error: 'No token provided' });
        const secretKey = JWT_SECRET;
        const decode = jwt.verify(token, secretKey) as TokenPayload;
        req.user = decode;
        next()
    } catch{
        res.status(401).json({ error: 'Invalid or expired token' });
    }
}

export async function verificationRefreshToken(req: Request, res: Response, next: NextFunction){
    try{
        const {token} = req.cookies;
        if (!token) return res.status(401).json({ error: 'No token provided' });

        const decode = jwt.verify(token,JWT_SECRET) as TokenPayload;
        req.user = decode
        next()
    } catch{
        res.status(401).json({ error: 'Invalid or expired token' });
    }
}