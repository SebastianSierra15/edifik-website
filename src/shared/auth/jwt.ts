export interface AppJWT {
  role?: string;
  membershipId?: string;
  permissions?: { name: string }[];
}
