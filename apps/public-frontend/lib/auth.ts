"use client";

import type { ApiResponse, AuthUser } from "@knife/shared";

const clientBase =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== "undefined" && window.location.port === "3000" ? "http://localhost:8080/api" : "/api");

async function readResponse<T>(res: Response): Promise<T> {
  const json = (await res.json()) as ApiResponse<T>;
  if (!res.ok || !json.success) throw new Error(!json.success ? json.error.message : `HTTP ${res.status}`);
  return json.data;
}

async function send<T>(path: string, method: string, body?: unknown) {
  return readResponse<T>(
    await fetch(`${clientBase}${path}`, {
      method,
      credentials: "include",
      headers: body ? { "content-type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined
    })
  );
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const me = await fetch(`${clientBase}/auth/me`, { credentials: "include", cache: "no-store" });
  if (me.ok) return readResponse<AuthUser>(me);
  if (me.status !== 401) return null;
  try {
    const refreshed = await send<{ user: AuthUser }>("/auth/refresh", "POST");
    return refreshed.user;
  } catch {
    return null;
  }
}

export async function loginUser(payload: { email: string; password: string }) {
  const result = await send<{ user: AuthUser }>("/auth/login", "POST", payload);
  window.dispatchEvent(new CustomEvent("auth-changed"));
  return result.user;
}

export async function registerUser(payload: { name: string; email: string; password: string }) {
  const result = await send<{ user: AuthUser }>("/auth/register", "POST", payload);
  window.dispatchEvent(new CustomEvent("auth-changed"));
  return result.user;
}

export async function logoutUser() {
  await send<{ ok: true }>("/auth/logout", "POST");
  window.dispatchEvent(new CustomEvent("auth-changed"));
}

export function userInitials(user: Pick<AuthUser, "name" | "email">) {
  const source = user.name.trim() || user.email;
  const parts = source.split(/\s+/).filter(Boolean);
  return (parts.length > 1 ? `${parts[0][0]}${parts[1][0]}` : source.slice(0, 2)).toUpperCase();
}
