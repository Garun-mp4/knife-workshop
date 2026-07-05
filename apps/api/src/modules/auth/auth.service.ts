import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import type { JwtSignOptions } from "@nestjs/jwt";
import type { UserRole } from "@prisma/client";
import * as argon2 from "argon2";
import type { CookieOptions, Response } from "express";
import { PrismaService } from "../../prisma/prisma.service";

type JwtExpiresIn = JwtSignOptions["expiresIn"];
type AuthUser = { id: string; email: string; role: UserRole; name: string };

function jwtExpiresIn(value: string | undefined, fallback: JwtExpiresIn): JwtExpiresIn {
  return (value ?? fallback) as JwtExpiresIn;
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function adminEmails() {
  return new Set(
    [process.env.ADMIN_EMAIL, ...(process.env.ADMIN_EMAILS ?? "").split(",")]
      .filter(Boolean)
      .map((email) => normalizeEmail(email as string))
  );
}

function isAdminEmail(email: string) {
  return adminEmails().has(normalizeEmail(email));
}

function durationMs(value: string | undefined, fallback: string) {
  const source = value ?? fallback;
  const match = /^(\d+)(ms|s|m|h|d)?$/.exec(source.trim());
  if (!match) return undefined;
  const amount = Number(match[1]);
  const unit = match[2] ?? "ms";
  const multipliers: Record<string, number> = { ms: 1, s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 };
  return amount * multipliers[unit];
}

function cookieDomain() {
  const domain = process.env.COOKIE_DOMAIN?.trim();
  if (!domain || domain === "localhost" || domain === "127.0.0.1" || domain === "::1") return undefined;
  return domain.includes(".") ? domain : undefined;
}

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService, private readonly jwt: JwtService) {}

  private authPayload(user: AuthUser): AuthUser {
    return { id: user.id, email: user.email, role: user.role, name: user.name };
  }

  private async setSessionCookies(user: AuthUser, response: Response) {
    const payload = this.authPayload(user);
    const accessToken = await this.jwt.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: jwtExpiresIn(process.env.JWT_ACCESS_EXPIRES_IN, "15m")
    });
    const refreshToken = await this.jwt.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: jwtExpiresIn(process.env.JWT_REFRESH_EXPIRES_IN, "30d")
    });
    const secure = process.env.COOKIE_SECURE === "true";
    const shared: CookieOptions = { httpOnly: true, sameSite: "lax", secure, domain: cookieDomain() };
    response.cookie("access_token", accessToken, {
      ...shared,
      path: "/",
      maxAge: durationMs(process.env.JWT_ACCESS_EXPIRES_IN, "15m")
    });
    response.cookie("refresh_token", refreshToken, {
      ...shared,
      path: "/api/auth",
      maxAge: durationMs(process.env.JWT_REFRESH_EXPIRES_IN, "30d")
    });
    return payload;
  }

  private clearSessionCookies(response: Response) {
    const options: CookieOptions = { domain: cookieDomain() };
    response.clearCookie("access_token", { ...options, path: "/" });
    response.clearCookie("refresh_token", { ...options, path: "/api/auth" });
  }

  async register(name: string, emailValue: string, password: string, response: Response) {
    const email = normalizeEmail(emailValue);
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) throw new ConflictException("Пользователь с таким email уже существует");
    const role: UserRole = isAdminEmail(email) ? "ADMIN" : "CUSTOMER";
    const user = await this.prisma.user.create({
      data: { email, name: name.trim(), role, passwordHash: await argon2.hash(password) },
      select: { id: true, email: true, name: true, role: true }
    });
    const payload = await this.setSessionCookies(user, response);
    return { user: payload };
  }

  async login(email: string, password: string, response: Response) {
    const user = await this.prisma.user.findUnique({ where: { email: normalizeEmail(email) } });
    if (!user || !user.isActive || !(await argon2.verify(user.passwordHash, password))) {
      throw new UnauthorizedException("Неверный email или пароль");
    }
    const role = isAdminEmail(user.email) && user.role === "CUSTOMER" ? "ADMIN" : user.role;
    const nextUser = role === user.role
      ? user
      : await this.prisma.user.update({ where: { id: user.id }, data: { role }, select: { id: true, email: true, name: true, role: true, passwordHash: true, isActive: true, createdAt: true, updatedAt: true } });
    const payload = await this.setSessionCookies(nextUser, response);
    return { user: payload };
  }

  async refresh(refreshToken: string | undefined, response: Response) {
    if (!refreshToken) throw new UnauthorizedException("Refresh token отсутствует");
    try {
      const payload = await this.jwt.verifyAsync(refreshToken, { secret: process.env.JWT_REFRESH_SECRET });
      const user = await this.prisma.user.findUnique({
        where: { id: payload.id },
        select: { id: true, email: true, name: true, role: true, isActive: true }
      });
      if (!user?.isActive) throw new UnauthorizedException("Пользователь не найден");
      const next = await this.setSessionCookies(user, response);
      return { user: next };
    } catch {
      this.clearSessionCookies(response);
      throw new UnauthorizedException("Refresh token недействителен");
    }
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, role: true, isActive: true }
    });
    if (!user?.isActive) throw new UnauthorizedException("Пользователь не найден");
    return this.authPayload(user);
  }

  logout(response: Response) {
    this.clearSessionCookies(response);
    return { ok: true };
  }
}
