import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { Permission } from "./lib/definitios";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const protectedRoutes: Record<string, string[] | null> = {
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

    "/usuario": null,
    "/usuario/perfil": null,
    "/usuario/mis-propiedades": ["Gestionar propiedades propias"],
    "/usuario/subir-propiedad": ["Gestionar propiedades propias"],

    "/login": null,
    "/login/register": null,
    "/login/forget-password": null,
  };

  const matchedRoute = Object.keys(protectedRoutes)
    .sort((a, b) => b.length - a.length)
    .find((route) => pathname.startsWith(route));

  if (!matchedRoute) {
    return NextResponse.next();
  }

  const requiredPermissions = protectedRoutes[matchedRoute];

  const token = await getToken({ req, secret: process.env.AUTH_SECRET });

  const userPermissions = token?.permissions as Permission[];

  const adminPermissions = [
    "Gestionar proyectos",
    "Gestionar propiedades",
    "Gestionar usuarios",
    "Gestionar roles",
    "Gestionar membresias",
    "Gestionar solicitudes",
  ];

  const isAdmin = adminPermissions.some((perm) =>
    userPermissions?.some((p) => p.name === perm)
  );

  if (
    (pathname === "/login" ||
      pathname === "/login/register" ||
      pathname === "/login/forget-password") &&
    token
  ) {
    const redirectUrl = isAdmin ? "/admin" : "/";
    return NextResponse.redirect(new URL(redirectUrl, req.url));
  }

  if (!token && !pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (!requiredPermissions) {
    return NextResponse.next();
  }

  if (!userPermissions?.length) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
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
  matcher: ["/admin/:path*", "/usuario/:path*", "/login/:path*"],
};
