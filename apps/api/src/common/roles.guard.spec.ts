import { ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { RolesGuard } from "./roles.guard";

function context(user: unknown) {
  return {
    getHandler: jest.fn(),
    getClass: jest.fn(),
    switchToHttp: () => ({ getRequest: () => ({ user }) })
  } as any;
}

describe("RolesGuard", () => {
  it("allows active staff users", async () => {
    const reflector = { getAllAndOverride: jest.fn().mockReturnValue(["OWNER", "ADMIN", "MANAGER"]) } as unknown as Reflector;
    const prisma = { user: { findUnique: jest.fn().mockResolvedValue({ id: "a1", email: "admin@example.com", name: "Admin", role: "ADMIN", isActive: true }) } };

    await expect(new RolesGuard(reflector, prisma as any).canActivate(context({ id: "a1" }))).resolves.toBe(true);
  });

  it("rejects CUSTOMER users from staff routes", async () => {
    const reflector = { getAllAndOverride: jest.fn().mockReturnValue(["OWNER", "ADMIN", "MANAGER"]) } as unknown as Reflector;
    const prisma = { user: { findUnique: jest.fn().mockResolvedValue({ id: "u1", email: "user@example.com", name: "User", role: "CUSTOMER", isActive: true }) } };

    await expect(new RolesGuard(reflector, prisma as any).canActivate(context({ id: "u1" }))).rejects.toBeInstanceOf(ForbiddenException);
  });
});
