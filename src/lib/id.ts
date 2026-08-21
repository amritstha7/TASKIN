/** Non-cryptographic unique-enough id for client-generated storage object names. */
export function generateId(prefix?: string): string {
  const id = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
  return prefix ? `${prefix}-${id}` : id;
}
