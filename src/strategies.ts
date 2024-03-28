import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./types";



class JwtStrategy {
  secret: string;

  constructor() {
    this.secret = 'your-secret-key'; // Replace with your actual secret key
  }

  initialize(): void {
    // Any initialization logic for JWT strategy
  }

  authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
    const token: string | undefined = req.headers.authorization as string;

    if (!token) {
       res.status(401).json({ error: 'Unauthorized' });
    }
    else
    try {
      const decoded: JwtPayload | string = jwt.verify(token, this.secret);
      if (typeof decoded === 'object') {
        req.user = decoded as JwtPayload;
      } else {
        // Handle the case when decoded is a string
        throw new Error('Invalid token');
      }
      next();
    } catch (error) {
       res.status(401).json({ error: 'Invalid token' });
    }
  }
}

export default new JwtStrategy();
