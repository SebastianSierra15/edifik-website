import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { withPath } from "@/lib/middleware/withPath";
import { isAdmin, AppJWT } from "./src/shared";
import { Permission } from "./src/modules/auth";
import { PROTECTED_ROUTES } from "./src/config";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const matchedRoute = Object.keys(PROTECTED_ROUTES)
    .sort((a, b) => b.length - a.length)
    .find((route) => pathname.startsWith(route));

  if (!matchedRoute) {
    return NextResponse.next();
  }

  const routeConfig = PROTECTED_ROUTES[matchedRoute];

  const token = (await getToken({
    req,
    secret: process.env.AUTH_SECRET,
  })) as AppJWT | null;

  const roleId = Number(token?.role);
  const membershipId = Number(token?.membershipId);

  const userPermissions = (token?.permissions ?? []).map(
    (p: any) => p.name as Permission
  );

  const userIsAdmin = isAdmin(userPermissions);

  /**
   * NO autenticado
   */
  if (!token && !pathname.startsWith("/login")) {
    return withPath(
      NextResponse.redirect(new URL("/login", req.url)),
      pathname
    );
  }

  /**
   * Usuario logueado intentando ir a login
   */
  if (pathname.startsWith("/login") && token) {
    return withPath(
      NextResponse.redirect(new URL(userIsAdmin ? "/admin" : "/", req.url)),
      pathname
    );
  }

  /**
   * Membresías solo para rol específico
   */
  if (pathname === "/membresias" && roleId !== 2) {
    return withPath(
      NextResponse.redirect(new URL("/unauthorized", req.url)),
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
  matcher: ["/admin/:path*", "/usuario/:path*", "/login/:path*", "/membresias"],
};
