export const SHARED_IMAGE_PREFIX = "data:image/jpeg;base64,";
export const MAX_SHARED_IMAGE_LENGTH = 256 * 1024;

export function getSharedImageUri(value: unknown): string {
  if (typeof value !== "string") return "";
  if (/^https:\/\/\S+$/.test(value)) return value;
  if (
    value.startsWith(SHARED_IMAGE_PREFIX) &&
    value.length <= MAX_SHARED_IMAGE_LENGTH &&
    /^[A-Za-z0-9+/]+={0,2}$/.test(value.slice(SHARED_IMAGE_PREFIX.length))
  )
    return value;
  return "";
}
