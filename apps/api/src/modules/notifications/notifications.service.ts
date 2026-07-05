import { InjectQueue } from "@nestjs/bullmq";
import { Injectable } from "@nestjs/common";
import { Queue } from "bullmq";
@Injectable()
export class NotificationsService {
  constructor(@InjectQueue("notifications") private readonly queue: Queue) {}
  async newLead(lead: any) {
    if (!process.env.SMTP_HOST && !process.env.TELEGRAM_BOT_TOKEN) return { skipped: true };
    await this.queue.add("new-lead", lead, { attempts: 3, backoff: { type: "exponential", delay: 5000 } });
    return { queued: true };
  }
}
