export interface UpdateUserInput {
  id: string;
  names: string;
  lastnames: string;
  email: string;
  phoneNumber?: string | null;
  genderId: number;
  roleId: number;
  membershipId?: string;
  state: boolean;
  updatedBy: string;
}
