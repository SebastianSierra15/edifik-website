import { Role, MembershipSummary, Gender } from "@/src/interfaces";

export interface UsersMetadata {
  roles: Role[];
  genders: Gender[];
  memberships: MembershipSummary[];
}
