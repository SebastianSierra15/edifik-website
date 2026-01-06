"use client";

import { useEffect } from "react";

export function useBodyOverflow(isOpen: boolean): void {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);
}
