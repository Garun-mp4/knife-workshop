import { NextResponse, type NextRequest } from "next/server";

type AuthUser = { id: string; email: string; name: string; role: string };
type ApiResponse<T> = { success: true; data: T } | { success: false; error: { message: string } };

const STAFF_ROLES = new Set(["OWNER", "ADMIN", "MANAGER"]);

function apiBase() {
  return process.env.INTERNAL_API_URL || process.env.API_URL || "http://localhost:8080/api";
}

function notFound() {
  return new NextResponse(null, { status: 404 });
}

async function readUser(response: Response): Promise<AuthUser | null> {
  if (!response.ok) return null;
  const json = (await response.json()) as ApiResponse<AuthUser | { user: AuthUser }>;
  if (!json.success) return null;
  return "user" in json.data ? json.data.user : json.data;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname.includes("/_next") || pathname.includes("/favicon")) return NextResponse.next();
  const cookie = request.headers.get("cookie") ?? "";
  const me = await fetch(`${apiBase()}/auth/me`, { headers: { cookie }, cache: "no-store" });
  let user = await readUser(me);
  let setCookie = me.headers.get("set-cookie");

  if (!user && me.status === 401 && request.cookies.has("refresh_token")) {
    const refreshed = await fetch(`${apiBase()}/auth/refresh`, { method: "POST", headers: { cookie }, cache: "no-store" });
    user = await readUser(refreshed);
    setCookie = refreshed.headers.get("set-cookie");
  }

  if (!user || !STAFF_ROLES.has(user.role)) return notFound();
  const next = NextResponse.next();
  if (setCookie) next.headers.append("set-cookie", setCookie);
  return next;
}

export const config = { matcher: ["/:path*"] };
