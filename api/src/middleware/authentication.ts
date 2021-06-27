import { NextFunction, Request, Response } from 'express';
import { admin } from '../config/firebase';

export const authEndpoint = async (req: Request, res: Response, next: NextFunction) => {
  const jwtHeader = req.headers['authorization'];
  //Error if the authorization header is not defined
  if(!jwtHeader){
    res.status(400).send({ message: "Provide a valid JWT token." });
    return;
  }
  //Error if JWT is incorrectly formatted
  const tokens = jwtHeader.split(' ');
  if(tokens.length !== 2) {
    res.status(400).send("Token format is invalid.");
    return;
  }

  const jwtToken = tokens[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(jwtToken);
    req.user = decodedToken;
  } catch (error) {
    req.user = null;
  }

  next();
}