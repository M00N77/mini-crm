import * as serviceAuth from '../services/auth'
import {Request,Response} from "express";

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

export async function refreshUser(req: Request, res: Response)  {
    const { refreshToken } = req.body;

    const result = await serviceAuth.rotateRefreshToken(refreshToken);

    return res.status(201).send(result);
}
