import { Body, Controller, Get, Patch, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../common/jwt-auth.guard";
import { StaffOnly } from "../../common/roles.decorator";
import { RolesGuard } from "../../common/roles.guard";
import { SettingsService } from "./settings.service";
@Controller("public/settings")
export class PublicSettingsController { constructor(private readonly service: SettingsService) {} @Get() all() { return this.service.all(); } }
@Controller("admin/settings")
@UseGuards(JwtAuthGuard, RolesGuard)
@StaffOnly()
export class SettingsController { constructor(private readonly service: SettingsService) {} @Get() all() { return this.service.all(); } @Patch() patch(@Body() body: Record<string, unknown>) { return this.service.patch(body); } }
