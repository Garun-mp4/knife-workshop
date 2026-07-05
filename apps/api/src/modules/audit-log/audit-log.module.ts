import { Module } from "@nestjs/common";
import { AuditLogService } from "./audit-log.service";
import { AuditLogController } from "./audit-log.controller";
import { JwtModule } from "@nestjs/jwt";
@Module({ imports: [JwtModule.register({})], providers: [AuditLogService], controllers: [AuditLogController], exports: [AuditLogService] })
export class AuditLogModule {}
