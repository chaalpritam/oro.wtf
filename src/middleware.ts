import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { NextRequestWithAuth } from "next-auth/middleware";

export default async function middleware(req: NextRequestWithAuth) {
  const token = await getToken({ req });
  const isAuthenticated = !!token;
  const isAuthPage =
    req.nextUrl.pathname.startsWith("/auth/signin") ||
    req.nextUrl.pathname.startsWith("/auth/signup");

  if (isAuthPage) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/app", req.url));
    }
    return NextResponse.next();
  }

  if (!isAuthenticated && req.nextUrl.pathname.startsWith("/app")) {
    return NextResponse.redirect(
      new URL(`/auth/signin?callbackUrl=${req.nextUrl.pathname}`, req.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/app/:path*", "/auth/signin", "/auth/signup"],
}; 