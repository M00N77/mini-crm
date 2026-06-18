import {Request,Response,NextFunction} from "express";
import jwt from "jsonwebtoken";

declare  global {
    namespace Express {
        interface Request {
            user?: {id: number, email: string};
        }
    }
}

export async function virificationToken(req: Request, res: Response, next: NextFunction){
    const {authorization} = req.headers;

    try {
        const token = authorization?.split(' ')[1] || null;
        const secretKey = process.env.JWT_SECRET || 'dev-secret-change-in-prod';
        const decode = await jwt.verify(token, secretKey);
        req.user = decode;
        next()
    } catch(e){
        res.status(401).send({error: e});
    }








}