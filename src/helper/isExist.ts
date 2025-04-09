export default function isExist<T>(value: T | undefined | null): boolean {
  if (value === undefined || value === null) return false;
  return true;
}
