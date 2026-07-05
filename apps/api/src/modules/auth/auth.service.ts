import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import type { JwtSignOptions } from "@nestjs/jwt";
import * as argon2 from "argon2";
import { Response } from "express";
import { PrismaService } from "../../prisma/prisma.service";

type JwtExpiresIn = JwtSignOptions["expiresIn"];

function jwtExpiresIn(value: string | undefined, fallback: JwtExpiresIn): JwtExpiresIn {
  return (value ?? fallback) as JwtExpiresIn;
}

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService, private readonly jwt: JwtService) {}

  async login(email: string, password: string, response: Response) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !user.isActive || !(await argon2.verify(user.passwordHash, password))) {
      throw new UnauthorizedException("Неверный email или пароль");
    }
    const payload = { id: user.id, email: user.email, role: user.role, name: user.name };
    const accessToken = await this.jwt.signAsync(payload, { secret: process.env.JWT_ACCESS_SECRET, expiresIn: jwtExpiresIn(process.env.JWT_ACCESS_EXPIRES_IN, "15m") });
    const refreshToken = await this.jwt.signAsync(payload, { secret: process.env.JWT_REFRESH_SECRET, expiresIn: jwtExpiresIn(process.env.JWT_REFRESH_EXPIRES_IN, "30d") });
    const secure = process.env.COOKIE_SECURE === "true";
    response.cookie("access_token", accessToken, { httpOnly: true, sameSite: "lax", secure, path: "/" });
    response.cookie("refresh_token", refreshToken, { httpOnly: true, sameSite: "lax", secure, path: "/api/auth" });
    return { user: payload };
  }

  async refresh(refreshToken: string | undefined, response: Response) {
    if (!refreshToken) throw new UnauthorizedException("Refresh token отсутствует");
    try {
      const payload = await this.jwt.verifyAsync(refreshToken, { secret: process.env.JWT_REFRESH_SECRET });
      const user = await this.prisma.user.findUnique({ where: { id: payload.id } });
      if (!user?.isActive) throw new UnauthorizedException("Пользователь не найден");
      const next = { id: user.id, email: user.email, role: user.role, name: user.name };
      const accessToken = await this.jwt.signAsync(next, { secret: process.env.JWT_ACCESS_SECRET, expiresIn: jwtExpiresIn(process.env.JWT_ACCESS_EXPIRES_IN, "15m") });
      response.cookie("access_token", accessToken, { httpOnly: true, sameSite: "lax", secure: process.env.COOKIE_SECURE === "true", path: "/" });
      return { user: next };
    } catch {
      throw new UnauthorizedException("Refresh token недействителен");
    }
  }

  logout(response: Response) {
    response.clearCookie("access_token", { path: "/" });
    response.clearCookie("refresh_token", { path: "/api/auth" });
    return { ok: true };
  }
}
