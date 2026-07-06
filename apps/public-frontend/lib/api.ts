import type { ApiResponse, ProductDto } from "@knife/shared";

const serverBase = process.env.INTERNAL_API_URL || process.env.API_URL || "http://localhost:8080/api";
const clientBase =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== "undefined" && window.location.port === "3000" ? "http://localhost:8080/api" : "/api");

async function unwrap<T>(res: Response): Promise<T> {
  const json = (await res.json()) as ApiResponse<T>;
  if (!res.ok || !json.success) throw new Error(!json.success ? json.error.message : `HTTP ${res.status}`);
  return json.data;
}
export async function apiGet<T>(path: string, init?: RequestInit) { return unwrap<T>(await fetch(`${serverBase}${path}`, { ...init, next: { revalidate: 60, ...(init as any)?.next } })); }
export async function apiPost<T>(path: string, body: unknown) { return unwrap<T>(await fetch(`${clientBase}${path}`, { method: "POST", credentials: "include", headers: { "content-type": "application/json" }, body: JSON.stringify(body) })); }
export type ProductList = { items: ProductDto[]; meta: { page: number; limit: number; total: number; pages: number } };
