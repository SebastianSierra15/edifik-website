import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { Permission } from "./lib/definitios";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const protectedRoutes: Record<string, string[]> = {
    "/admin": [
      "Gestionar proyectos",
      "Gestionar propiedades",
      "Gestionar usuarios",
      "Gestionar roles",
      "Gestionar membresias",
      "Gestionar solicitudes",
    ],
    "/admin/proyectos": ["Gestionar proyectos"],
    "/admin/propiedades": ["Gestionar propiedades"],
    "/admin/usuarios": ["Gestionar usuarios"],
    "/admin/roles": ["Gestionar roles"],
    "/admin/membresias": ["Gestionar membresias"],
    "/admin/solicitudes": ["Gestionar solicitudes"],
  };

  const matchedRoute = Object.keys(protectedRoutes)
    .sort((a, b) => b.length - a.length)
    .find((route) => pathname.startsWith(route));

  if (!matchedRoute) {
    return NextResponse.next();
  }

  const requiredPermissions = protectedRoutes[matchedRoute];

  const token = await getToken({
    req: req,
    secret: process.env.AUTH_SECRET,
  });

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const userPermissions = token?.permissions as Permission[];

  if (
    (pathname.startsWith("/login") && token) ||
    !userPermissions ||
    userPermissions.length === 0
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  const hasPermission = requiredPermissions.some((perm) =>
    userPermissions?.some((userPerm) => userPerm.name === perm)
  );

  if (!hasPermission) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};
