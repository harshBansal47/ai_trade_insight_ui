import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const PROTECTED = ["/dashboard", "/history", "/pricing", "/settings", "/profile"];

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const isAuthenticated = !!req.nextauth.token;

    // Logged-in users can't visit /auth
    if (isAuthenticated && pathname.startsWith("/auth")) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        if (PROTECTED.some((p) => pathname.startsWith(p))) return !!token;
        return true;
      },
    },
    pages: { signIn: "/auth" },
  }
);

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public|api/health).*)"],
};