import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as jwksRsa from 'jwks-rsa';
import { Payload } from 'src/authz/types';

/** Verifies Auth0 RS256 access tokens for socket connections (same rules as the HTTP JwtStrategy). */
@Injectable()
export class WsTokenVerifier {
  private readonly jwks = jwksRsa({
    jwksUri: `${process.env.AUTH0_ISSUER_URL}.well-known/jwks.json`,
    cache: true,
    rateLimit: true,
  });

  verify(token: string): Promise<Payload> {
    return new Promise((resolve, reject) => {
      jwt.verify(
        token,
        (header, callback) => {
          this.jwks.getSigningKey(header.kid, (err, key) => {
            if (err || !key) {
              callback(err ?? new Error('Signing key not found'));
              return;
            }
            callback(null, key.getPublicKey());
          });
        },
        {
          audience: process.env.AUTH0_AUDIENCE,
          issuer: process.env.AUTH0_ISSUER_URL,
          algorithms: ['RS256'],
        },
        (err, decoded) => {
          if (err || !decoded || typeof decoded === 'string') {
            reject(err ?? new Error('Invalid token'));
            return;
          }
          resolve(decoded as Payload);
        },
      );
    });
  }
}
