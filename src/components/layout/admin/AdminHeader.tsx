"use client";

import Image from "next/image";
import Link from "next/link";
import { useAdminMenu } from "@/src/hooks/admin";
import { AdminNav } from "./AdminNav";
import { AdminMenuContainer } from "./AdminMenuContainer";

export function AdminHeader() {
  const { menuItems, canManageRequests } = useAdminMenu();

  return (
    <header className="fixed space-x-3 left-0 top-0 z-50 min-h-16 w-full bg-premium-background bg-opacity-90 text-premium-textPrimary shadow-md dark:bg-premium-secondaryDark dark:text-premium-textPrimary flex items-center justify-between py-1 px-4">
      <Link
        href="/admin"
        className="flex flex-col items-center text-center transition-colors duration-300"
      >
        <div className="flex items-center justify-start w-[100px] h-[40px]">
          <Image
            src="/images/logo.webp"
            alt="Logo de EdifiK"
            title="Panel de administración"
            width={80}
            height={35}
            loading="lazy"
            className="w-auto h-auto max-w-[100px] max-h-[40px] bg-gray-800 p-1 rounded-md shadow-md dark:bg-transparent transition duration-300"
          />
        </div>
        <span>Admin Panel</span>
      </Link>

      <AdminNav items={menuItems} />

      <div className="flex items-center justify-end space-x-4">
        <AdminMenuContainer
          menuItems={menuItems}
          canManageRequests={canManageRequests}
        />
      </div>
    </header>
  );
}
