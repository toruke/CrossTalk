import { NextRequest, NextResponse } from "next/server";

const publicRoutes = ["/", "/sign-in", "/sign-up", "/api/auth"];
const adminRoutes = ["/admin"];
const profRoutes = ["/dashboard", "/students", "/modules", "/qcm", "/calendar", "/messages"];
const eleveRoutes = ["/dashboard", "/modules", "/qcm", "/calendar", "/messages"];
const parentRoutes = ["/dashboard", "/messages"];

function isPublicRoute(pathname: string) {
  return publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // Check for session cookie
  const sessionCookie = request.cookies.get("better-auth.session_token");
  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
