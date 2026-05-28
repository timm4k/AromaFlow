import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../config/firebase";

export function uploadAromaImage(aromaId, uri, onProgress, onError) {
  const imageRef = ref(storage, `aromas/${aromaId}/image.jpg`);

  return new Promise((resolve, reject) => {
    let blob;

    fetch(uri)
      .then((res) => res.blob())
      .then((b) => {
        blob = b;

        const task = uploadBytesResumable(imageRef, blob);

        task.on(
          "state_changed",
          (snapshot) => {
            const progress =
              snapshot.bytesTransferred / snapshot.totalBytes;
            onProgress?.(progress);
          },
          (error) => {
            blob?.close?.();
            onError?.(error);
            reject(error);
          },
          async () => {
            blob.close?.();
            const url = await getDownloadURL(task.snapshot.ref);
            resolve(url);
          },
        );
      })
      .catch((error) => {
        blob?.close?.();
        reject(error);
      });
  });
}

export async function deleteAromaImage(aromaId) {
  const imageRef = ref(storage, `aromas/${aromaId}/image.jpg`);

  try {
    await deleteObject(imageRef);
  } catch (e) {
    if (e.code === "storage/object-not-found") return;

    throw e;
  }
}

export async function getAromaImageUrl(aromaId) {
  const imageRef = ref(storage, `aromas/${aromaId}/image.jpg`);

  try {
    return await getDownloadURL(imageRef);
  } catch {
    return null;
  }
}
