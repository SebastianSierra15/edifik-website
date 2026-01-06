export function formatDateForMySQL(date?: string | Date | null): string | null {
  if (!date) return null;

  const validDate = date instanceof Date ? date : new Date(date);
  if (isNaN(validDate.getTime())) {
    return null;
  }

  const year = validDate.getFullYear();
  const month = String(validDate.getMonth() + 1).padStart(2, "0");
  const day = String(validDate.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
