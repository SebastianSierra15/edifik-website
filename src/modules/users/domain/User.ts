import { Role, Membership, Gender } from "@/src/interfaces/catalog";

export interface UsersMetadata {
  roles: Role[];
  genders: Gender[];
  memberships: Membership[];
}
