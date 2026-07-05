import { AuthService } from "./auth.service";
import * as argon2 from "argon2";

jest.mock("argon2", () => ({
  hash: jest.fn(),
  verify: jest.fn()
}));

describe("AuthService", () => {
  const originalEnv = process.env;
  let prisma: any;
  let jwt: any;
  let response: any;

  beforeEach(() => {
    process.env = {
      ...originalEnv,
      ADMIN_EMAIL: "owner@example.com",
      ADMIN_EMAILS: "admin@example.com",
      JWT_ACCESS_SECRET: "access-secret",
      JWT_REFRESH_SECRET: "refresh-secret",
      JWT_ACCESS_EXPIRES_IN: "15m",
      JWT_REFRESH_EXPIRES_IN: "30d",
      COOKIE_DOMAIN: "localhost",
      COOKIE_SECURE: "false"
    };
    prisma = {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn()
      }
    };
    jwt = {
      signAsync: jest.fn().mockResolvedValueOnce("access").mockResolvedValueOnce("refresh"),
      verifyAsync: jest.fn()
    };
    response = { cookie: jest.fn(), clearCookie: jest.fn() };
    (argon2.hash as jest.Mock).mockResolvedValue("hashed");
    (argon2.verify as jest.Mock).mockResolvedValue(true);
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.resetAllMocks();
  });

  it("registers regular users as CUSTOMER and sets cookies", async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    prisma.user.create.mockResolvedValue({ id: "u1", email: "user@example.com", name: "User", role: "CUSTOMER" });

    const result = await new AuthService(prisma, jwt).register(" User ", " USER@EXAMPLE.COM ", "password123", response);

    expect(prisma.user.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ email: "user@example.com", name: "User", role: "CUSTOMER", passwordHash: "hashed" })
    }));
    expect(result.user.role).toBe("CUSTOMER");
    expect(response.cookie).toHaveBeenCalledTimes(2);
    expect(response.cookie.mock.calls[0][2]).toMatchObject({ httpOnly: true, sameSite: "lax", path: "/", maxAge: 900000 });
  });

  it("registers allowlisted emails as ADMIN", async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    prisma.user.create.mockResolvedValue({ id: "a1", email: "admin@example.com", name: "Admin", role: "ADMIN" });

    const result = await new AuthService(prisma, jwt).register("Admin", "admin@example.com", "password123", response);

    expect(result.user.role).toBe("ADMIN");
    expect(prisma.user.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ role: "ADMIN" })
    }));
  });

  it("rejects duplicate emails on registration", async () => {
    prisma.user.findUnique.mockResolvedValue({ id: "u1" });

    await expect(new AuthService(prisma, jwt).register("User", "user@example.com", "password123", response)).rejects.toThrow("Пользователь с таким email уже существует");
  });

  it("logs in users and writes session cookies", async () => {
    prisma.user.findUnique.mockResolvedValue({ id: "u1", email: "user@example.com", name: "User", role: "CUSTOMER", passwordHash: "hash", isActive: true });

    const result = await new AuthService(prisma, jwt).login("USER@EXAMPLE.COM", "password123", response);

    expect(argon2.verify).toHaveBeenCalledWith("hash", "password123");
    expect(result.user).toMatchObject({ id: "u1", email: "user@example.com", role: "CUSTOMER" });
    expect(response.cookie).toHaveBeenCalledTimes(2);
  });

  it("refreshes from a valid refresh token", async () => {
    jwt.verifyAsync.mockResolvedValue({ id: "u1" });
    prisma.user.findUnique.mockResolvedValue({ id: "u1", email: "user@example.com", name: "User", role: "CUSTOMER", isActive: true });

    const result = await new AuthService(prisma, jwt).refresh("refresh-token", response);

    expect(result.user.id).toBe("u1");
    expect(response.cookie).toHaveBeenCalledTimes(2);
  });

  it("returns the current active user from the database", async () => {
    prisma.user.findUnique.mockResolvedValue({ id: "u1", email: "user@example.com", name: "User", role: "CUSTOMER", isActive: true });

    await expect(new AuthService(prisma, jwt).me("u1")).resolves.toMatchObject({ id: "u1", role: "CUSTOMER" });
  });
});
