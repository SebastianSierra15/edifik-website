import { useState, useEffect } from "react";
import { Role, Gender, MembershipSummary } from "@/src/interfaces";
import {
  fetchUsersMetadata,
  getCachedUsersMetadata,
} from "@/src/hooks/admin/metadata/adminMetadataCache";

export const useUsersMetadata = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [genders, setGenders] = useState<Gender[]>([]);
  const [memberships, setMemberships] = useState<MembershipSummary[]>([]);
  const [isLoadingUsersMetadata, setIsLoadingUsersMetadata] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const cached = getCachedUsersMetadata();

    if (cached) {
      setRoles(cached.roles);
      setGenders(cached.genders);
      setMemberships(cached.memberships);
      setIsLoadingUsersMetadata(false);
      return () => {
        isMounted = false;
      };
    }

    setIsLoadingUsersMetadata(true);

    fetchUsersMetadata()
      .then(({ roles, genders, memberships }) => {
        if (!isMounted) return;
        setRoles(roles);
        setGenders(genders);
        setMemberships(memberships);
      })
      .catch((error) => {
        if (!isMounted) return;
        console.error("Error cargando metadata de usuarios:", error);
      })
      .finally(() => {
        if (!isMounted) return;
        setIsLoadingUsersMetadata(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    roles,
    genders,
    memberships,
    isLoadingUsersMetadata,
  };
};
