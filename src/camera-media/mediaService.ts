import * as FileSystem from "expo-file-system/legacy";
import * as ImageManipulator from "expo-image-manipulator";
import { MAX_SHARED_IMAGE_LENGTH, SHARED_IMAGE_PREFIX } from "./sharedImage";

const AVATAR_FILE_NAME = "avatar.jpg";
const PHOTO_WIDTH = 500;
const JPEG_COMPRESSION = 0.7;

export const AVATAR_PATH = FileSystem.documentDirectory
  ? `${FileSystem.documentDirectory}${AVATAR_FILE_NAME}`
  : null;

export function getAvatarPath(profileId?: string): string {
  if (!FileSystem.documentDirectory || !AVATAR_PATH)
    throw new Error("Local avatar storage requires Android or iOS");
  if (!profileId) return AVATAR_PATH;
  const directory = encodeURIComponent(profileId).replace(/\./g, "%2E");
  return `${FileSystem.documentDirectory}profiles/${directory}/${AVATAR_FILE_NAME}`;
}

async function transformPhoto(uri: string, base64 = false) {
  return ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: PHOTO_WIDTH } }],
    {
      compress: JPEG_COMPRESSION,
      format: ImageManipulator.SaveFormat.JPEG,
      base64,
    },
  );
}

export async function optimizePhoto(uri: string): Promise<string> {
  const result = await transformPhoto(uri);
  return result.uri;
}

export async function encodeSharedPhoto(uri: string): Promise<string> {
  const result = await transformPhoto(uri, true);
  if (!result.base64) throw new Error("Could not encode the selected photo");
  const encoded = `${SHARED_IMAGE_PREFIX}${result.base64}`;
  if (encoded.length > MAX_SHARED_IMAGE_LENGTH)
    throw new Error(
      "The optimized photo is too large to share — choose another image",
    );
  return encoded;
}

async function recoverPhoto(path: string) {
  const file = await FileSystem.getInfoAsync(path);
  if (!file.exists) {
    const backup = `${path}.backup`;
    const previous = await FileSystem.getInfoAsync(backup);
    if (previous.exists) await FileSystem.moveAsync({ from: backup, to: path });
  }
}

export async function savePhotoPermanently(
  tempUri: string,
  profileId?: string,
): Promise<string> {
  const destination = getAvatarPath(profileId);
  if (tempUri === destination) return destination;
  const source = await FileSystem.getInfoAsync(tempUri);
  if (!source.exists)
    throw new Error("The selected photo is no longer available");
  const directory = destination.slice(0, destination.lastIndexOf("/") + 1);
  await FileSystem.makeDirectoryAsync(directory, { intermediates: true });
  await recoverPhoto(destination);
  const pending = `${destination}.pending`;
  const backup = `${destination}.backup`;
  await FileSystem.deleteAsync(pending, { idempotent: true });
  try {
    await FileSystem.copyAsync({ from: tempUri, to: pending });
  } catch (error) {
    await FileSystem.deleteAsync(pending, { idempotent: true });
    throw error;
  }
  const previous = await FileSystem.getInfoAsync(destination);
  if (previous.exists) {
    await FileSystem.deleteAsync(backup, { idempotent: true });
    await FileSystem.moveAsync({ from: destination, to: backup });
  }
  try {
    await FileSystem.moveAsync({ from: pending, to: destination });
  } catch (error) {
    if (previous.exists)
      await FileSystem.moveAsync({ from: backup, to: destination });
    await FileSystem.deleteAsync(pending, { idempotent: true });
    throw error;
  }
  await FileSystem.deleteAsync(backup, { idempotent: true });
  return destination;
}

export async function getSavedPhoto(
  profileId?: string,
): Promise<string | null> {
  if (!AVATAR_PATH) return null;
  const path = getAvatarPath(profileId);
  await recoverPhoto(path);
  const file = await FileSystem.getInfoAsync(path);
  return file.exists ? `${path}?t=${Date.now()}` : null;
}

export async function deleteSavedPhoto(profileId?: string): Promise<void> {
  const path = getAvatarPath(profileId);
  for (const file of [path, `${path}.backup`, `${path}.pending`]) {
    await FileSystem.deleteAsync(file, { idempotent: true });
  }
}
