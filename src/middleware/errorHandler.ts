import {Request,Response, NextFunction} from "express";
import {AppError} from "../utils/AppError";

export async function errorHandler(err: Error, req : Request, res: Response, next:NextFunction) {
    if(err instanceof AppError) return res.status(err.status).json(err.message);

    console.log(err);
    res.status(500).json({message: 'Internal error'});


}