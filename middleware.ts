import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { withPath } from "@/lib/withPath";
import { isAdmin, AppJWT } from "./src/shared";
import { Permission } from "./src/modules/auth";
import { PROTECTED_ROUTES } from "./src/config/protectedRoutes";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/login")) {
    const redirectUrl = req.nextUrl.clone();
    let targetPath = pathname.replace(/^\/login/, "/auth");

    if (targetPath === "/auth") {
      targetPath = "/auth/login";
    }

    if (targetPath.startsWith("/auth/forget-password")) {
      targetPath = "/auth/forgot-password";
    }

    redirectUrl.pathname = targetPath;
    return withPath(NextResponse.redirect(redirectUrl), pathname);
  }

  const matchedRoute = Object.keys(PROTECTED_ROUTES)
    .sort((a, b) => b.length - a.length)
    .find((route) => pathname.startsWith(route));

  if (!matchedRoute) {
    return NextResponse.next();
  }

  const routeConfig = PROTECTED_ROUTES[matchedRoute];

  const hasSessionCookie = Boolean(
    req.cookies.get("__Secure-next-auth.session-token")?.value ??
      req.cookies.get("__Host-next-auth.session-token")?.value ??
      req.cookies.get("next-auth.session-token")?.value
  );

  if (!hasSessionCookie) {
    if (pathname.startsWith("/auth")) {
      return withPath(NextResponse.next(), pathname);
    }

    return withPath(
      NextResponse.redirect(new URL("/auth/login", req.url)),
      pathname
    );
  }

  const token = (await getToken({
    req,
    secret: process.env.AUTH_SECRET,
  })) as AppJWT | null;

  const membershipId = Number(token?.membershipId);

  const userPermissions = (token?.permissions ?? []).map(
    (p: any) => p.name as Permission
  );

  const userIsAdmin = isAdmin(userPermissions);

  /**
   * NO autenticado
   */
  if (!token && !pathname.startsWith("/auth")) {
    return withPath(
      NextResponse.redirect(new URL("/auth/login", req.url)),
      pathname
    );
  }

  /**
   * Usuario logueado intentando ir a login
   */
  if (pathname.startsWith("/auth") && token) {
    return withPath(
      NextResponse.redirect(new URL(userIsAdmin ? "/admin" : "/", req.url)),
      pathname
    );
  }

  /**
   * Subir propiedad requiere membresía
   */
  if (pathname === "/usuario/subir-propiedad" && token && !membershipId) {
    return withPath(
      NextResponse.redirect(new URL("/membresias", req.url)),
      pathname
    );
  }

  /**
   * Ruta sin permisos específicos
   */
  if (!routeConfig.permissions) {
    return withPath(NextResponse.next(), pathname);
  }

  /**
   * Sin permisos
   */
  if (!userPermissions.length) {
    return withPath(
      NextResponse.redirect(new URL("/unauthorized", req.url)),
      pathname
    );
  }

  const hasPermission = routeConfig.permissions.some((perm) =>
    userPermissions.includes(perm)
  );

  if (!hasPermission) {
    return withPath(
      NextResponse.redirect(new URL("/unauthorized", req.url)),
      pathname
    );
  }

  return withPath(NextResponse.next(), pathname);
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/usuario/:path*",
    "/auth/:path*",
    "/login/:path*",
  ],
};
