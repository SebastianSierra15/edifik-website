export type HeaderType =
  | "string"
  | "number"
  | "boolean"
  | "date"
  | "array"
  | "status";

export interface StatusMapping {
  label: string;
  className: string;
}

export interface Header<T> {
  label: string;
  key: keyof T | string;
  type: HeaderType;
  subKey?: string;
  statusMapping?: Record<string, StatusMapping>;
}
