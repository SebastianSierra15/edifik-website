"use client";

import { useEffect, useState } from "react";
import { CircleCheck, TriangleAlert, CircleX, Info, X } from "lucide-react";

export interface AlertProps {
  type: "success" | "warning" | "error" | "info";
  message: string;
  duration?: number; // milliseconds
  onClose?: () => void;
}

export function Alert({ type, message, duration = 3000, onClose }: AlertProps) {
  const [isVisible, setIsVisible] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const styles = (() => {
    switch (type) {
      case "success":
        return {
          bg: "bg-green-100",
          text: "text-green-800",
          icon: <CircleCheck className="h-5 w-5 text-green-600" />,
        };
      case "warning":
        return {
          bg: "bg-yellow-100",
          text: "text-yellow-800",
          icon: <TriangleAlert className="h-5 w-5 text-yellow-600" />,
        };
      case "error":
        return {
          bg: "bg-red-100",
          text: "text-red-800",
          icon: <CircleX className="h-5 w-5 text-red-600" />,
        };
      case "info":
        return {
          bg: "bg-blue-100",
          text: "text-blue-800",
          icon: <Info className="h-5 w-5 text-blue-600" />,
        };
    }
  })();

  return (
    <div
      className={`fixed top-5 left-1/2 z-50 -translate-x-1/2 rounded-lg px-4 py-3 shadow-lg flex items-center space-x-3 ${styles.bg} ${styles.text}`}
    >
      {styles.icon}
      <span className="text-sm font-medium">{message}</span>
      <button
        type="button"
        onClick={() => setIsVisible(false)}
        className="focus:outline-none"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}
