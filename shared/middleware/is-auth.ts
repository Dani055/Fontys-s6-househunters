import { RequestHandler } from 'express';
import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { AccessToken } from 'shared/interfaces/jwtPayload'
import { ResponseError } from 'shared/responses/responseError';

export const isAuth : RequestHandler = async(req, res, next) => {
  const authHeaders = req.get('Authorization');
  if (!authHeaders) {
    return res.status(401)
      .json({ message: 'Not authenticated.' })
  }
  const publicKey = process.env.PUBLIC_KEY.replace(/\\n/g, '\n');
  const token = authHeaders.split(' ')[1];

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, publicKey) as AccessToken
    if(!decodedToken.sub){
      throw new ResponseError(401, "How did we get here?")
    }
    req.userId = decodedToken.sub.toString();
    req.userRoles = decodedToken.roles;
    req.email = decodedToken.email;
    
    next();
  } catch (error) {
    let newError;
    if(error instanceof JsonWebTokenError || error instanceof TokenExpiredError || error instanceof ResponseError){
      newError =  new ResponseError(401, error.message)
    }
    else{
      newError = new ResponseError(401, 'Error validating JWT')
    }
    next(newError)
  }
};
