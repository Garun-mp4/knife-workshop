import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { LeadStatus } from "@prisma/client";
import { JwtAuthGuard } from "../../common/jwt-auth.guard";
import { StaffOnly } from "../../common/roles.decorator";
import { RolesGuard } from "../../common/roles.guard";
import { CreateLeadDto, UpdateLeadDto } from "./dto/lead.dto";
import { LeadsService } from "./leads.service";
@Controller("public/leads")
export class PublicLeadsController { constructor(private readonly service: LeadsService) {} @Throttle({ default: { ttl: 60_000, limit: 3 } }) @Post() create(@Body() dto: CreateLeadDto) { return this.service.create(dto); } }
@Controller("admin/leads")
@UseGuards(JwtAuthGuard, RolesGuard)
@StaffOnly()
export class LeadsController {
  constructor(private readonly service: LeadsService) {}
  @Get() list() { return this.service.list(); }
  @Get(":id") get(@Param("id") id: string) { return this.service.find(id); }
  @Patch(":id") update(@Param("id") id: string, @Body() dto: UpdateLeadDto) { return this.service.update(id, dto); }
  @Patch(":id/status") status(@Param("id") id: string, @Body() body: { status: LeadStatus }) { return this.service.update(id, { status: body.status }); }
  @Delete(":id") delete(@Param("id") id: string) { return this.service.delete(id); }
}
