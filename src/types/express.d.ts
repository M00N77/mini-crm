import {virificationToken} from "../middleware/auth";

declare global {
    namespace Express {
        interface Request {
            user?: {id: number, email: string};
        }
    }
}

export {}