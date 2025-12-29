"use client";

import { useEffect, useState } from "react";

export function useIsLgUp(): boolean {
  const [isLgUp, setIsLgUp] = useState<boolean>(false);

  useEffect(() => {
    const checkScreen = () => {
      const nextValue = window.innerWidth >= 1024;
      setIsLgUp((prev) => (prev === nextValue ? prev : nextValue));
    };

    checkScreen();
    window.addEventListener("resize", checkScreen);

    return () => {
      window.removeEventListener("resize", checkScreen);
    };
  }, []);

  return isLgUp;
}
