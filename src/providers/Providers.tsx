"use client";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import { useDarkMode } from "@/src/hooks/ui";
import { LoadingProvider } from "./LoadingProvider";
import { ModalAlertProvider } from "./ModalAlertProvider";

export function Providers({
  children,
  session,
}: {
  children: React.ReactNode;
  session?: Session | null;
}) {
  useDarkMode();

  return (
    <SessionProvider session={session}>
      <LoadingProvider>
        <ModalAlertProvider>{children}</ModalAlertProvider>
      </LoadingProvider>
    </SessionProvider>
  );
}
