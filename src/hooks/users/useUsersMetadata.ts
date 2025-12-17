import { useState, useEffect } from "react";
import { Role, Gender, MembershipSummary } from "@/src/interfaces";
import { UserService } from "@/src/services/users";

export const useUsersMetadata = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [genders, setGenders] = useState<Gender[]>([]);
  const [memberships, setMemberships] = useState<MembershipSummary[]>([]);
  const [isLoadingUsersMetadata, setIsLoadingUsersMetadata] = useState(true);

  useEffect(() => {
    const fetchMetadata = async () => {
      setIsLoadingUsersMetadata(true);
      try {
        const { roles, genders, memberships } =
          await UserService.getUsersMetadata();

        setRoles(roles);
        setGenders(genders);
        setMemberships(memberships);
      } catch (error) {
        console.error("Error cargando metadata de usuarios:", error);
      } finally {
        setIsLoadingUsersMetadata(false);
      }
    };

    fetchMetadata();
  }, []);

  return {
    roles,
    genders,
    memberships,
    isLoadingUsersMetadata,
  };
};
