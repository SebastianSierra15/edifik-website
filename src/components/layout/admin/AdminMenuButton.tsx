"use client";

import { Menu } from "lucide-react";

interface Props {
  open: boolean;
  onToggle: () => void;
}

export function AdminMenuButton({ open, onToggle }: Props) {
  return (
    <button
      onClick={onToggle}
      type="button"
      aria-haspopup="menu"
      aria-expanded={open}
      className="flex items-center justify-center p-2 rounded-md text-premium-secondary transition-all hover:text-premium-primary focus:outline-none dark:text-premium-textPrimary dark:hover:text-premium-primaryLight"
    >
      <Menu className="h-6 w-6 transition-transform duration-300 hover:scale-110" />
    </button>
  );
}
