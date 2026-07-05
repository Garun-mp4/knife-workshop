import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PrismaService } from "../prisma/prisma.service";
import { ROLES_KEY } from "./roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector, private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [context.getHandler(), context.getClass()]);
    if (!roles?.length) return true;
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user?.id) throw new ForbiddenException("Недостаточно прав");
    const current = await this.prisma.user.findUnique({
      where: { id: user.id },
      select: { id: true, email: true, name: true, role: true, isActive: true }
    });
    if (current?.isActive && roles.includes(current.role)) {
      request.user = { id: current.id, email: current.email, role: current.role, name: current.name };
      return true;
    }
    throw new ForbiddenException("Недостаточно прав");
  }
}
