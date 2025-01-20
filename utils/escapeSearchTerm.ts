export function escapeSearchTerm(searchTerm: string | null): string | null {
  if (!searchTerm || searchTerm.trim() === "") {
    return null;
  }

  let escapedTerm = searchTerm.trim();
  escapedTerm = escapedTerm.replace(/\\/g, "\\\\");
  escapedTerm = escapedTerm.replace(/%/g, "\\%");
  escapedTerm = escapedTerm.replace(/_/g, "\\_");

  return `%${escapedTerm}%`;
}
