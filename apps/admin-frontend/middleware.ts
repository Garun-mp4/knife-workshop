import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname.endsWith("/login") || pathname.includes("/_next") || pathname.includes("/favicon")) return NextResponse.next();
  const hasToken = request.cookies.has("access_token");
  if (!hasToken) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };
