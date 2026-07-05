import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { PrismaClient } from "@prisma/client";
import { Queue, Worker } from "bullmq";
import nodemailer from "nodemailer";

const prisma = new PrismaClient();

function createRedisConnection() {
  const redisUrl = process.env.REDIS_URL;

  if (redisUrl) {
    const parsed = new URL(redisUrl);
    return {
      host: parsed.hostname,
      port: Number(parsed.port || 6379),
      username: parsed.username || undefined,
      password: parsed.password || undefined,
      maxRetriesPerRequest: null
    };
  }

  return {
    host: process.env.REDIS_HOST ?? "redis",
    port: Number(process.env.REDIS_PORT ?? 6379),
    maxRetriesPerRequest: null
  };
}

// Pass plain connection options to BullMQ instead of an ioredis instance.
// This avoids TypeScript conflicts when pnpm resolves different ioredis patch versions
// for direct dependencies and BullMQ's own transitive dependency.
const connection = createRedisConnection();
const bucket = process.env.S3_BUCKET ?? "knife-workshop-media";
const s3 = new S3Client({
  region: process.env.S3_REGION ?? "us-east-1",
  endpoint: process.env.S3_ENDPOINT ?? "http://minio:9000",
  forcePathStyle: (process.env.S3_FORCE_PATH_STYLE ?? "true") === "true",
  credentials: { accessKeyId: process.env.S3_ACCESS_KEY ?? "minioadmin", secretAccessKey: process.env.S3_SECRET_KEY ?? "minioadminpassword" }
});

async function deleteKey(key: string) {
  await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
}

const imageDeleteWorker = new Worker("image-delete", async (job) => {
  const image = await prisma.productImage.findUnique({ where: { id: job.data.imageId } });
  if (!image) return { skipped: true };
  const keys = [image.originalKey, image.largeKey, image.mediumKey, image.thumbKey, image.placeholderKey].filter(Boolean) as string[];
  await Promise.all(keys.map(deleteKey));
  await prisma.productImage.delete({ where: { id: image.id } });
  return { deleted: image.id };
}, { connection });

const mediaCleanupWorker = new Worker("media-cleanup", async () => {
  const pending = await prisma.productImage.findMany({ where: { pendingDelete: true }, take: 50 });
  const queue = new Queue("image-delete", { connection });
  try {
    for (const image of pending) await queue.add("delete-pending", { imageId: image.id }, { attempts: 5, backoff: { type: "exponential", delay: 5000 } });
    console.log(`[media-cleanup] queued ${pending.length} pending images`);
    return { queued: pending.length };
  } finally {
    await queue.close();
  }
}, { connection });

const notificationsWorker = new Worker("notifications", async (job) => {
  const lead = job.data;
  const text = `Новая заявка с сайта
Тип: ${lead.type}
Товар: ${lead.productId ?? "—"}
Имя: ${lead.name}
Телефон: ${lead.phone ?? "—"}
Email: ${lead.email ?? "—"}
Сообщение: ${lead.message ?? "—"}`;
  if (process.env.SMTP_HOST && process.env.SMTP_FROM) {
    const transporter = nodemailer.createTransport({ host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT ?? 587), auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD } : undefined });
    await transporter.sendMail({ from: process.env.SMTP_FROM, to: process.env.SMTP_FROM, subject: "Новая заявка с сайта", text });
  }
  if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
    await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ chat_id: process.env.TELEGRAM_CHAT_ID, text }) });
  }
  return { sent: true };
}, { connection });

async function scheduleCleanup() {
  const queue = new Queue("media-cleanup", { connection });
  try {
    await queue.upsertJobScheduler("cleanup-pending-images", { pattern: "*/30 * * * *" }, { name: "cleanup", data: {} });
  } finally {
    await queue.close();
  }
}

async function shutdown() {
  await Promise.allSettled([
    imageDeleteWorker.close(),
    mediaCleanupWorker.close(),
    notificationsWorker.close(),
    prisma.$disconnect()
  ]);
  process.exit(0);
}

scheduleCleanup().then(() => console.log("Knife worker is running"));
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
