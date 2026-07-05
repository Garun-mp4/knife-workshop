import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}
  async all() { const rows = await this.prisma.siteSetting.findMany(); return Object.fromEntries(rows.map((r) => [r.key, r.value])); }
  async patch(settings: Record<string, unknown>) {
    await Promise.all(Object.entries(settings).map(([key, value]) => this.prisma.siteSetting.upsert({ where: { key }, update: { value: value as any }, create: { key, value: value as any } })));
    return this.all();
  }
}
