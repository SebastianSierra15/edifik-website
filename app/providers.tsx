"use client";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import { LoadingProvider, ModalAlertProvider } from "@/src/providers";

export function Providers({
  children,
  session,
}: {
  children: React.ReactNode;
  session?: Session | null;
}) {
  return (
    <SessionProvider session={session}>
      <LoadingProvider>
        <ModalAlertProvider>{children}</ModalAlertProvider>
      </LoadingProvider>
    </SessionProvider>
  );
}
