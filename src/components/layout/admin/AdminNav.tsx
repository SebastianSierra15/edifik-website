import Link from "next/link";
import clsx from "clsx";
import { AdminMenuItem } from "@/src/hooks/admin";

export function AdminNav({ items }: { items: AdminMenuItem[] }) {
  return (
    <nav
      className="flex-1 justify-center space-x-6 items-center min-h-9 hidden md:flex"
      aria-label="Navegación de administrador"
    >
      {items.map(({ path, label, isActive }) => (
        <Link
          key={path}
          href={path}
          className={clsx(
            "group relative transition-colors duration-300",
            isActive
              ? "text-premium-primary dark:text-premium-primaryLight font-semibold"
              : "text-premium-textPrimary dark:text-premium-textSecondary hover:text-premium-primary dark:hover:text-premium-primaryLight"
          )}
        >
          {label}
          <span
            className={clsx(
              "absolute bottom-0 left-0 h-[2px] bg-premium-primary transition-all duration-300 dark:bg-premium-primaryLight",
              isActive ? "w-full" : "w-0 group-hover:w-full"
            )}
          />
        </Link>
      ))}
    </nav>
  );
}
