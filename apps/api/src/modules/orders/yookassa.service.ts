import { BadRequestException, Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";

type YooKassaPayment = {
  id: string;
  status: string;
  confirmation?: { confirmation_url?: string };
  amount?: { value: string; currency: string };
  metadata?: Record<string, string>;
};

@Injectable()
export class YooKassaService {
  private endpoint = process.env.YOOKASSA_API_URL ?? "https://api.yookassa.ru/v3";

  private credentials() {
    const shopId = process.env.YOOKASSA_SHOP_ID;
    const secretKey = process.env.YOOKASSA_SECRET_KEY;
    if (!shopId || !secretKey) throw new BadRequestException("ЮKassa не настроена: задайте YOOKASSA_SHOP_ID и YOOKASSA_SECRET_KEY");
    return Buffer.from(`${shopId}:${secretKey}`).toString("base64");
  }

  private async request<T>(path: string, init: RequestInit = {}) {
    const response = await fetch(`${this.endpoint}${path}`, {
      ...init,
      headers: {
        authorization: `Basic ${this.credentials()}`,
        "content-type": "application/json",
        ...(init.headers ?? {})
      }
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const description = typeof data.description === "string" ? data.description : `HTTP ${response.status}`;
      throw new BadRequestException(`ЮKassa: ${description}`);
    }
    return data as T;
  }

  createPayment(input: { orderId: string; amount: string; returnUrl: string; description: string }) {
    return this.request<YooKassaPayment>("/payments", {
      method: "POST",
      headers: { "Idempotence-Key": randomUUID() },
      body: JSON.stringify({
        amount: { value: input.amount, currency: "RUB" },
        capture: true,
        confirmation: { type: "redirect", return_url: input.returnUrl },
        description: input.description.slice(0, 128),
        metadata: { order_id: input.orderId }
      })
    });
  }

  fetchPayment(paymentId: string) {
    return this.request<YooKassaPayment>(`/payments/${paymentId}`);
  }
}
