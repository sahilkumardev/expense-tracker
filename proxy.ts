import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = ["/", "/auth/login", "/auth/register", "/dashboard"];
const PROTECTED_ROUTES = ["/"];

function matchesRoute(pathname: string, route: string): boolean {
  return pathname === route || pathname.startsWith(`${route}/`);
}

export default async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    matchesRoute(pathname, route),
  );
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    matchesRoute(pathname, route),
  );

  const authCookieNames = [
    "better-auth.session_token",
    "better-auth-session_token",
    "__Secure-better-auth.session_token",
    "__Secure-better-auth-session_token",
  ];

  const isAuthenticated = authCookieNames.some(
    (cookieName) => request.cookies.get(cookieName)?.value,
  );

  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (
    isPublicRoute &&
    isAuthenticated &&
    (pathname === "/" ||
      pathname === "/auth/login" ||
      pathname === "/auth/register")
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
