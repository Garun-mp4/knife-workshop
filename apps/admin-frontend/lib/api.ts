import type { ApiResponse } from "@knife/shared";
const browserBase = process.env.NEXT_PUBLIC_API_URL || "/api";
const serverBase = process.env.INTERNAL_API_URL || process.env.API_URL || "http://localhost:8080/api";
function base(){ return typeof window === "undefined" ? serverBase : browserBase; }
async function unwrap<T>(res: Response): Promise<T> { const json = (await res.json()) as ApiResponse<T>; if (!res.ok || !json.success) throw new Error(!json.success ? json.error.message : `HTTP ${res.status}`); return json.data; }
export async function apiGet<T>(path: string, init?: RequestInit) { return unwrap<T>(await fetch(`${base()}${path}`, { credentials: "include", cache: "no-store", ...init })); }
export async function apiSend<T>(path: string, method: string, body?: unknown) { return unwrap<T>(await fetch(`${base()}${path}`, { method, credentials: "include", headers: body instanceof FormData ? undefined : { "content-type": "application/json" }, body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined })); }
