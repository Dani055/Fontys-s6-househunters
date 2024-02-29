import { RequestHandler } from 'express';
import { ResponseError } from 'shared/responses/responseError';


export const requireEmailPassword: RequestHandler = (req, res, next) => {
    const { email, password } = req.body;
    if(!email){
        throw new ResponseError(400, "Invalid email")
    }
    else if(!password){
        throw new ResponseError(400, 'Missing password')
    }
    next();
};
