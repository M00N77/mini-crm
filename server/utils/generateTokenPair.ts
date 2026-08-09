import { TokenPayload } from "../types/types";
import jwt from "jsonwebtoken";
import crypto from "crypto";

export class TokenService {
  static generateAccess(payload: TokenPayload, secret: string) {
    return jwt.sign(payload, secret, { expiresIn: "15m" });
  }

  static generatePair(payload: TokenPayload, secret: string) {
    const jti = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const accessToken = this.generateAccess(payload, secret);
    const refreshToken = jwt.sign({ ...payload, jti }, secret, {
      expiresIn: "7d",
    });

    const hashedRefreshToken = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    return { accessToken, refreshToken, hashedRefreshToken, expiresAt, jti };
  }
}