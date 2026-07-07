import {
  leadStatusLabel,
  leadTypeLabel,
  orderStatusLabel,
  paymentStatusLabel,
  statusLabel,
  type LeadStatus,
  type LeadType,
  type OrderStatus,
  type PaymentStatus,
  type ProductStatus
} from "@knife/shared";

export const productStatusOptions: ProductStatus[] = [
  "DRAFT",
  "IN_STOCK",
  "RESERVED",
  "MADE_TO_ORDER",
  "SOLD",
  "HIDDEN",
  "COMING_SOON",
  "ARCHIVED"
];

export const orderStatusOptions: OrderStatus[] = [
  "PENDING_PAYMENT",
  "PAID",
  "CONFIRMED",
  "READY",
  "SHIPPED",
  "COMPLETED",
  "CANCELLED",
  "PAYMENT_FAILED"
];

export const leadStatusOptions: LeadStatus[] = [
  "NEW",
  "IN_PROGRESS",
  "CONTACTED",
  "WAITING_PAYMENT",
  "ACCEPTED",
  "IN_PRODUCTION",
  "READY",
  "SHIPPED",
  "CLOSED",
  "CANCELLED"
];

export const pageStatusLabel: Record<string, string> = {
  PUBLISHED: "Опубликована",
  DRAFT: "Черновик",
  HIDDEN: "Скрыта"
};

export function productStatusText(status?: ProductStatus | string | null) {
  return status && status in statusLabel ? statusLabel[status as ProductStatus] : "Не указан";
}

export function leadTypeText(type?: LeadType | string | null) {
  return type && type in leadTypeLabel ? leadTypeLabel[type as LeadType] : "Не указан";
}

export function leadStatusText(status?: LeadStatus | string | null) {
  return status && status in leadStatusLabel ? leadStatusLabel[status as LeadStatus] : "Не указан";
}

export function orderStatusText(status?: OrderStatus | string | null) {
  return status && status in orderStatusLabel ? orderStatusLabel[status as OrderStatus] : "Не указан";
}

export function paymentStatusText(status?: PaymentStatus | string | null) {
  return status && status in paymentStatusLabel ? paymentStatusLabel[status as PaymentStatus] : "Не указан";
}

export function pageStatusText(status?: string | null) {
  return status ? (pageStatusLabel[status] ?? status) : "Не указан";
}

export function formatDateTime(value?: string | Date | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

export function formatPrice(value?: string | number | null, prefix?: string | null) {
  if (value === null || value === undefined || value === "") return "—";
  const numeric = Number(value);
  const rendered = Number.isFinite(numeric)
    ? new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 }).format(numeric)
    : `${value} ₽`;
  return prefix ? `${prefix} ${rendered}` : rendered;
}
