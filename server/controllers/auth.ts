import * as serviceAuth from '../services/auth'
import {Request,Response,NextFunction} from "express";

export async function registerUser(req: Request, res: Response)  {
    const {email,password,name} = req.body;
    const result = await serviceAuth.registerUser(email,password,name);

    res.status(201).send(result)
}

export async function loginUser(req: Request, res: Response)  {
    const {email,password} = req.body;
    const result = await serviceAuth.loginUser(email,password);

    return res.status(200).send(result)
}

export async function refreshUser(req: Request, res: Response,next: NextFunction)   {
    const { token } = req.cookies;
    const result = await serviceAuth.rotateRefreshToken(token);
    if(!result) return res.status(401).send('Invalid refresh token');

    res.status(200).send(result);
}
