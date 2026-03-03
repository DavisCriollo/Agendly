import jwt from 'jsonwebtoken';
import { envs } from './envs';

export interface JwtPayload {
  userId: string;
  businessId: string;
  email: string;
  role: string;
}

export class JwtAdapter {
  static async generateToken(payload: JwtPayload): Promise<string> {
    return new Promise((resolve, reject) => {
      jwt.sign(
        payload,
        envs.JWT_SEED,
        { expiresIn: envs.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] },
        (err, token) => {
          if (err) reject(err);
          resolve(token!);
        }
      );
    });
  }

  static async verifyToken(token: string): Promise<JwtPayload | null> {
    return new Promise((resolve) => {
      jwt.verify(token, envs.JWT_SEED, (err, decoded) => {
        if (err) {
          resolve(null);
          return;
        }
        resolve(decoded as JwtPayload);
      });
    });
  }
}
