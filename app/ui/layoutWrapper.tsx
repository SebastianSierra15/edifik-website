"use client";

import { usePathname } from "next/navigation";
import Header from "./header/header";
import Footer from "./footer/footer";
import AdminHeader from "./admin/adminHeader";
import AdminFooter from "./admin/adminFooter";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isLogin = pathname.startsWith("/login");
  const isAdmin = pathname.startsWith("/admin");

  return (
    <>
      {!isLogin && isAdmin && <AdminHeader />}
      {!isLogin && !isAdmin && <Header />}

      {children}

      {!isLogin && isAdmin && <AdminFooter />}
      {!isLogin && !isAdmin && <Footer />}
    </>
  );
}
