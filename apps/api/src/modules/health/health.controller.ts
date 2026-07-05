import { Controller, Get } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { StorageService } from "../storage/storage.service";
import Redis from "ioredis";
@Controller("health")
export class HealthController {
  constructor(private readonly prisma: PrismaService, private readonly storage: StorageService) {}
  @Get() async all() { return { ok: true, service: "api", time: new Date().toISOString() }; }
  @Get("db") async db() { await this.prisma.$queryRaw`SELECT 1`; return { ok: true }; }
  @Get("redis") async redis() { const r = new Redis(process.env.REDIS_URL ?? "redis://redis:6379"); const pong = await r.ping(); await r.quit(); return { ok: pong === "PONG" }; }
  @Get("storage") async storageHealth() { return { ok: true, bucket: this.storage.bucket }; }
}
