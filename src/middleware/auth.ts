import {Request,Response,NextFunction} from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-prod';

export async function verificationToken(req: Request, res: Response, next: NextFunction){
    const {authorization} = req.headers;

    try {
        const token = authorization?.split(' ')[1] ;
        if (!token) return res.status(401).json({ error: 'No token provided' });
        const secretKey = JWT_SECRET;
        const decode = jwt.verify(token, secretKey) as { id: number; email: string };
        req.user = decode;
        next()
    } catch(e){
        console.error(e);
        res.status(401).json({ error: 'Invalid or expired token' });
    }
}

