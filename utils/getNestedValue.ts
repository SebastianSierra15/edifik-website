export function getNestedValue<T>(item: T, path: string): any {
  return path.split(".").reduce((acc: any, key) => acc && acc[key], item);
}
