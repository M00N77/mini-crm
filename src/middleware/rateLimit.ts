import {Request,Response, NextFunction} from "express";

const lastRequestMap = new Map<number, number>()

export function rateLimit(req: Request, res: Response, next: NextFunction) {
    const userId = Number(req.user.id)
    const currentDate = Date.now()
    const lastTimeRequest = lastRequestMap.get(userId);
    if(!lastTimeRequest){
        lastRequestMap.set(userId,currentDate)
        return next()
    }
    const isRateLimitOut = currentDate - lastTimeRequest > 30000

    if (!isRateLimitOut) return res.status(429).json({error: "Rate limit exceeded"})
    lastRequestMap.set(userId,currentDate)
    next()
}