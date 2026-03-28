import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import { env } from "../config/env";

class TokenService {
  // Generate refresh token with JWT ID (JTI)
  generateRefeshToken(
    userId: string,
    deviceName: string,
    ipAddress: string,
    userAgent: string,
  ) {
    const jti = crypto.randomUUID();
    const expiresIn = parseInt(env.REFRESH_TOKEN_EXPIRES_IN);

    const payload = {
      userId,
      jti,
      type: "refresh",
    };

    const token = jwt.sign(JSON.stringify(payload), env.REFRESH_TOKEN_SECRET, {
      expiresIn,
      issuer: env.REFRESH_TOKEN_ISSUER,
      audience: env.REFRESH_TOKEN_AUDIENCE,
      algorithm: "ES256",
    });

    return {
      token,
      jti,
      expiresIn,
    };
  }
}

export const tokenService = new TokenService()
