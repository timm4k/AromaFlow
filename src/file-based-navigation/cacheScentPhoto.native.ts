import * as FileSystem from "expo-file-system/legacy";
import { wikimediaHeaders } from "../services/wikimedia";
import { querySettings } from "./querySettings";

function photoKey(uri: string) {
  let hash = 2166136261;
  for (let index = 0; index < uri.length; index++)
    hash = Math.imul(hash ^ uri.charCodeAt(index), 16777619);
  return `${(hash >>> 0).toString(16)}-${uri.length}`;
}

export async function cacheScentPhoto(uri: string): Promise<string> {
  if (!FileSystem.cacheDirectory) throw new Error("Photo cache is unavailable");
  const directory = `${FileSystem.cacheDirectory}scent-photos/`;
  const destination = `${directory}${photoKey(uri)}.image`;
  const existing = await FileSystem.getInfoAsync(destination);
  if (
    existing.exists &&
    existing.size > 0 &&
    Date.now() - existing.modificationTime * 1000 <
      querySettings.photoCacheDuration
  )
    return destination;

  await FileSystem.makeDirectoryAsync(directory, { intermediates: true });
  const temporary = `${destination}.${Date.now()}-${Math.random().toString(36).slice(2)}.download`;
  try {
    const result = await FileSystem.downloadAsync(uri, temporary, {
      headers: {
        ...wikimediaHeaders,
        Accept: "image/jpeg,image/png,image/webp",
      },
      cache: true,
    });
    const contentType =
      result.mimeType ??
      Object.entries(result.headers).find(
        ([name]) => name.toLowerCase() === "content-type",
      )?.[1];
    if (
      result.status < 200 ||
      result.status >= 300 ||
      !contentType?.match(/^image\/(jpeg|png|webp)(?:;|$)/i)
    )
      throw new Error(`Photo download failed (HTTP ${result.status})`);
    const downloaded = await FileSystem.getInfoAsync(temporary);
    if (!downloaded.exists || downloaded.size === 0)
      throw new Error("The photo download was empty");
    await FileSystem.copyAsync({ from: temporary, to: destination });
    return destination;
  } finally {
    await FileSystem.deleteAsync(temporary, { idempotent: true });
  }
}
