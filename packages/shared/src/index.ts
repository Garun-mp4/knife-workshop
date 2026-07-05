export const PRODUCT_PUBLIC_STATUSES = ["IN_STOCK", "MADE_TO_ORDER", "SOLD", "COMING_SOON"] as const;
export const PRODUCT_PRIVATE_STATUSES = ["DRAFT", "HIDDEN", "ARCHIVED"] as const;

export type ProductStatus =
  | "DRAFT"
  | "IN_STOCK"
  | "MADE_TO_ORDER"
  | "SOLD"
  | "HIDDEN"
  | "COMING_SOON"
  | "ARCHIVED";

export type LeadType =
  | "PRODUCT_ORDER"
  | "SIMILAR_ORDER"
  | "CUSTOM_ORDER"
  | "GENERAL_QUESTION";

export type LeadStatus =
  | "NEW"
  | "IN_PROGRESS"
  | "CONTACTED"
  | "WAITING_PAYMENT"
  | "ACCEPTED"
  | "IN_PRODUCTION"
  | "READY"
  | "SHIPPED"
  | "CLOSED"
  | "CANCELLED";

export type UserRole = "CUSTOMER" | "OWNER" | "ADMIN" | "MANAGER";
export type AuthUser = { id: string; email: string; name: string; role: UserRole };

export function isStaffRole(role: UserRole): boolean {
  return role === "OWNER" || role === "ADMIN" || role === "MANAGER";
}

export type ApiSuccess<T> = { success: true; data: T };
export type ApiFailure = { success: false; error: { code: string; message: string; details?: unknown[] } };
export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

export type ProductImageDto = {
  id: string;
  alt?: string | null;
  isMain: boolean;
  sortOrder: number;
  originalName: string;
  largeUrl?: string | null;
  mediumUrl?: string | null;
  thumbUrl?: string | null;
  placeholderUrl?: string | null;
  width?: number | null;
  height?: number | null;
};

export type ProductDto = {
  id: string;
  title: string;
  slug: string;
  shortDescription?: string | null;
  description?: string | null;
  price?: string | null;
  oldPrice?: string | null;
  pricePrefix?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  status: ProductStatus;
  category?: { id: string; name: string; slug: string } | null;
  purpose?: string | null;
  steel?: string | null;
  bladeLengthMm?: number | null;
  totalLengthMm?: number | null;
  spineThicknessMm?: string | null;
  handleMaterial?: string | null;
  sheathMaterial?: string | null;
  weightGrams?: number | null;
  hardnessHrc?: string | null;
  equipment?: string | null;
  productionTimeDays?: number | null;
  engravingAvailable: boolean;
  certificateText?: string | null;
  certificateFileUrl?: string | null;
  isFeatured: boolean;
  images: ProductImageDto[];
};

export const statusLabel: Record<ProductStatus, string> = {
  DRAFT: "Черновик",
  IN_STOCK: "В наличии",
  MADE_TO_ORDER: "Под заказ",
  SOLD: "Продан",
  HIDDEN: "Скрыт",
  COMING_SOON: "Скоро",
  ARCHIVED: "Архив"
};

export const leadTypeLabel: Record<LeadType, string> = {
  PRODUCT_ORDER: "Заказ товара",
  SIMILAR_ORDER: "Заказать похожий",
  CUSTOM_ORDER: "Индивидуальный заказ",
  GENERAL_QUESTION: "Общий вопрос"
};

export function productCta(status: ProductStatus): string {
  switch (status) {
    case "IN_STOCK": return "Заказать";
    case "MADE_TO_ORDER": return "Заказать изготовление";
    case "SOLD": return "Заказать похожий";
    case "COMING_SOON": return "Узнать о поступлении";
    default: return "Подробнее";
  }
}
