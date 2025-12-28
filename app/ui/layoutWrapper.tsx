"use client";

import { usePathname } from "next/navigation";
import Header from "./header/header";
import Footer from "./footer/footer";
import AdminHeader from "../../src/components/layout/admin/AdminHeader";
import AdminFooter from "../../src/components/layout/admin/AdminFooter";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isAuthRoute =
    pathname.startsWith("/auth") || pathname.startsWith("/login");
  const isAdmin = pathname.startsWith("/admin");

  return (
    <>
      {!isAuthRoute && isAdmin && <AdminHeader />}
      {!isAuthRoute && !isAdmin && <Header />}

      {children}

      {!isAuthRoute && isAdmin && <AdminFooter />}
      {!isAuthRoute && !isAdmin && <Footer />}
    </>
  );
}
