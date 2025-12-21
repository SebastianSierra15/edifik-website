export const NameValidationTarget = {
  Role: "role",
  User: "user",
  Project: "project",
  Membership: "membership",
} as const;

export type NameValidationTarget =
  (typeof NameValidationTarget)[keyof typeof NameValidationTarget];

export interface CheckNameResponse {
  total: number;
}
