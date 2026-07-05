import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AuditLogModule } from "../audit-log/audit-log.module";

@Module({ imports: [JwtModule.register({}), AuditLogModule], controllers: [AuthController], providers: [AuthService], exports: [AuthService, JwtModule] })
export class AuthModule {}
