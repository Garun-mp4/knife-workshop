import { Controller, Get, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../common/jwt-auth.guard";
import { StaffOnly } from "../../common/roles.decorator";
import { RolesGuard } from "../../common/roles.guard";
import { AuditLogService } from "./audit-log.service";
@Controller("admin/audit-log")
@UseGuards(JwtAuthGuard, RolesGuard)
@StaffOnly()
export class AuditLogController { constructor(private readonly service: AuditLogService) {} @Get() list() { return this.service.list(); } }
