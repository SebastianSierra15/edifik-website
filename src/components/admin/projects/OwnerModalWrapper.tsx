"use client";

import dynamic from "next/dynamic";
import type { ProjectOwner } from "@/src/interfaces";

const OwnerModal = dynamic(
  () => import("@/src/components/realEstate").then((mod) => mod.OwnerModal),
  {
    ssr: false,
  }
);

interface OwnerModalWrapperProps {
  isOpen: boolean;
  owner: ProjectOwner | null;
  onClose: () => void;
}

export function OwnerModalWrapper({
  isOpen,
  owner,
  onClose,
}: OwnerModalWrapperProps) {
  return (
    <OwnerModal
      show={isOpen}
      flag={!!owner}
      onClose={onClose}
      onSubmit={(e) => e.preventDefault()}
      handleChange={() => {}}
      user={
        owner || {
          id: 0,
          names: "",
          lastnames: "",
          email: "",
          phoneNumber: "",
        }
      }
    />
  );
}
