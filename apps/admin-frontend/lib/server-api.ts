import { cookies } from "next/headers";
import type { ApiResponse } from "@knife/shared";
const serverBase = process.env.INTERNAL_API_URL || process.env.API_URL || "http://localhost:8080/api";
async function unwrap<T>(res: Response): Promise<T> { const json = (await res.json()) as ApiResponse<T>; if (!res.ok || !json.success) throw new Error(!json.success ? json.error.message : `HTTP ${res.status}`); return json.data; }
export async function apiGetServer<T>(path: string) { const cookie = (await cookies()).toString(); return unwrap<T>(await fetch(`${serverBase}${path}`, { cache: "no-store", headers: { cookie } })); }
