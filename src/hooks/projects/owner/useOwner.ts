"use client";

import { useCallback, useEffect, useState } from "react";
import type { ProjectOwner } from "@/src/interfaces";
import { ProjectOwnerService } from "@/src/services/projects";

export function useOwner(email: string) {
  const [owner, setOwner] = useState<ProjectOwner | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    if (!email?.trim()) {
      setOwner(null);
      setError("Debe proporcionar un email de usuario.");
      setIsLoadingUser(false);
      return;
    }

    setIsLoadingUser(true);
    setError(null);

    try {
      const data = await ProjectOwnerService.getOwnerByEmail(email.trim());
      setOwner(data.user ?? null);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "No se pudo recuperar el usuario."
      );
      setOwner(null);
    } finally {
      setIsLoadingUser(false);
    }
  }, [email]);

  useEffect(() => {
    void fetchUser();
  }, [fetchUser]);

  return { owner, isLoadingUser, error, refetchUser: fetchUser };
}
