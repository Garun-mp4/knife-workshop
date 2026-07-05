import { Body, Controller, Get, Patch, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../common/jwt-auth.guard";
import { RolesGuard } from "../../common/roles.guard";
import { SettingsService } from "./settings.service";
@Controller("public/settings")
export class PublicSettingsController { constructor(private readonly service: SettingsService) {} @Get() all() { return this.service.all(); } }
@Controller("admin/settings")
@UseGuards(JwtAuthGuard, RolesGuard)
export class SettingsController { constructor(private readonly service: SettingsService) {} @Get() all() { return this.service.all(); } @Patch() patch(@Body() body: Record<string, unknown>) { return this.service.patch(body); } }
