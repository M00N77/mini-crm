import crypto from "crypto";
import * as service from "../services/auth";
import { Request, Response } from "express";
import { AppError } from "../utils/AppError";

const refreshCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export async function registerUser(req: Request, res: Response) {
  const { email, password, name } = req.body;
  const result = await service.registerUser(email, password, name);

  const { refreshToken, ...resultWithoutRefresh } = result;
  res.cookie("token", refreshToken, refreshCookieOptions);
  return res.status(201).send(resultWithoutRefresh);
}

export async function loginUser(req: Request, res: Response) {
  const { email, password } = req.body;
  const result = await service.loginUser(email, password);

  const { refreshToken, ...resultWithoutRefresh } = result;
  res.cookie("token", refreshToken, refreshCookieOptions);

  return res.status(200).send(resultWithoutRefresh);
}

export async function refreshUser(req: Request, res: Response) {
  const oldRefresh = req.cookies.token;
  const result = await service.rotateRefreshToken(oldRefresh);
  if (!result) throw new AppError("Invalid refresh token", 401);

  const { refreshToken, ...resultWithoutRefresh } = result;
  res.cookie("token", refreshToken, refreshCookieOptions);

  return res.status(200).send(resultWithoutRefresh);
}

export async function logoutUser(req: Request, res: Response) {
  await service.logoutUser(req.cookies.token);

  res.clearCookie("token", { path: "/" });
  return res.status(200).json({ message: "User logged out" });
}

export async function changePassword(req: Request, res: Response) {
  const { userId } = req.user;
  const password = req.body.newPassword;
  await service.changePassword(userId, password);

  return res.status(200).json({ message: "Password changed successfully" });
}

export async function googleAuth(req: Request, res: Response) {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CALLBACK_URL) {
    throw new Error("Google OAuth credentials are not configured in .env");
  }

  const state = crypto.randomBytes(32).toString("hex");
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: process.env.GOOGLE_CALLBACK_URL,
    state: state,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "consent",
  });

  res.cookie("oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 10 * 60 * 1000,
    path: "/",
  });

  const endpoint =
    process.env.oauth2Endpoint ||
    "https://accounts.google.com/o/oauth2/v2/auth";
  const authUrl = `${endpoint}?${params.toString()}`;
  return res.redirect(authUrl);
}

export async function googleCallback(req: Request, res: Response) {
  const { code, state, error } = req.query;
  const savedState = req.cookies.oauth_state;

  res.clearCookie("oauth_state", { path: "/" });

  const clientDashboardUrl =
    process.env.CLIENT_REDIRECT_URL || "http://localhost:3001/dashboard";
  const clientLoginUrl = clientDashboardUrl.replace("/dashboard", "/login");

  if (error || !code || typeof code !== "string") {
    return res.redirect(`${clientLoginUrl}?error=oauth_denied`);
  }

  if (!state || state !== savedState) {
    return res.redirect(`${clientLoginUrl}?error=invalid_state`);
  }

  // 1. Обмениваем authorization code на access_token Google
  const tokenParams = new URLSearchParams({
    code: code,
    client_id: process.env.GOOGLE_CLIENT_ID || "",
    client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
    redirect_uri: process.env.GOOGLE_CALLBACK_URL || "",
    grant_type: "authorization_code",
  });

  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: tokenParams.toString(),
  });

  if (!tokenResponse.ok) {
    const errorBody = await tokenResponse.text();
    console.error("Google token exchange failed:", errorBody);
    return res.redirect(`${clientLoginUrl}?error=token_exchange_failed`);
  }

  const tokenData = (await tokenResponse.json()) as {
    access_token?: string;
    id_token?: string;
  };

  if (!tokenData.access_token) {
    return res.redirect(`${clientLoginUrl}?error=no_access_token`);
  }

  // 2. Запрашиваем профиль пользователя у Google UserInfo API
  const userResponse = await fetch(
    "https://www.googleapis.com/oauth2/v3/userinfo",
    {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    },
  );

  if (!userResponse.ok) {
    return res.redirect(`${clientLoginUrl}?error=user_info_failed`);
  }

  const googleProfile = (await userResponse.json()) as {
    sub: string;
    email: string;
    name?: string;
    picture?: string;
    email_verified?: boolean;
  };

  if (!googleProfile.email || !googleProfile.sub) {
    return res.redirect(`${clientLoginUrl}?error=no_email_provided`);
  }

  // 3. Авторизуем или создаем пользователя в БД и генерируем сессионные токены
  const result = await service.loginOrRegisterGoogleUser({
    googleSub: googleProfile.sub,
    email: googleProfile.email,
    name: googleProfile.name || googleProfile.email.split("@")[0],
    emailVerified: googleProfile.email_verified !== false,
  });

  // 4. Устанавливаем refreshToken в HttpOnly cookie
  res.cookie("token", result.refreshToken, refreshCookieOptions);

  // 5. Перенаправляем пользователя в Dashboard
  return res.redirect(clientDashboardUrl);
}
