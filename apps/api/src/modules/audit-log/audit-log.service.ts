import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
@Injectable()
export class AuditLogService {
  constructor(private readonly prisma: PrismaService) {}
  log(data: { userId?: string; action: string; entity: string; entityId?: string; metadata?: unknown; ip?: string; userAgent?: string }) {
    return this.prisma.auditLog.create({ data: { ...data, metadata: data.metadata as any } });
  }
  list() { return this.prisma.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 200, include: { user: true } }); }
}
