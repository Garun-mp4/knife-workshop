import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { NotificationsService } from "../notifications/notifications.service";
import { CreateLeadDto, UpdateLeadDto } from "./dto/lead.dto";
@Injectable()
export class LeadsService {
  constructor(private readonly prisma: PrismaService, private readonly notifications: NotificationsService) {}
  async create(dto: CreateLeadDto) {
    if (!dto.consent) throw new BadRequestException("Нужно согласие на обработку персональных данных");
    if (!dto.phone && !dto.email && !dto.messenger) throw new BadRequestException("Укажите телефон, email или мессенджер");
    const { consent, ...data } = dto;
    const lead = await this.prisma.lead.create({ data });
    await this.notifications.newLead(lead).catch(() => undefined);
    return lead;
  }
  list() { return this.prisma.lead.findMany({ include: { product: true }, orderBy: { createdAt: "desc" } }); }
  async find(id: string) { const lead = await this.prisma.lead.findUnique({ where: { id }, include: { product: true } }); if (!lead) throw new NotFoundException("Заявка не найдена"); return lead; }
  async update(id: string, dto: UpdateLeadDto) { await this.find(id); return this.prisma.lead.update({ where: { id }, data: dto }); }
  async delete(id: string) { await this.find(id); return this.prisma.lead.delete({ where: { id } }); }
}
