import { useCallback, useEffect, useRef, useState } from "react";
import { Alert } from "react-native";
import { selectPhoto } from "./mediaPicker";
import {
  deleteSavedPhoto,
  getSavedPhoto,
  optimizePhoto,
  savePhotoPermanently,
} from "./mediaService";

export function useProfilePhoto(profileId?: string) {
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const busy = useRef(true);
  const lifecycle = useRef({ version: 0, active: false });

  useEffect(() => {
    const session = lifecycle.current;
    const version = ++session.version;
    session.active = true;
    busy.current = true;
    async function loadExistingPhoto() {
      setIsLoading(true);
      setPhotoUri(null);
      try {
        const saved = await getSavedPhoto(profileId);
        if (session.active && session.version === version) setPhotoUri(saved);
      } catch {
        if (session.active && session.version === version)
          Alert.alert(
            "Photo unavailable",
            "Could not restore your local avatar",
          );
      } finally {
        if (session.active && session.version === version) {
          busy.current = false;
          setIsLoading(false);
        }
      }
    }
    void loadExistingPhoto();
    return () => {
      session.active = false;
      session.version++;
    };
  }, [profileId]);

  const runAction = useCallback(
    async (
      action: () => Promise<string | null | undefined>,
      failureMessage: string,
    ) => {
      const session = lifecycle.current;
      if (busy.current || !session.active) return;
      busy.current = true;
      const version = session.version;
      setIsLoading(true);
      try {
        const uri = await action();
        if (session.active && session.version === version && uri !== undefined)
          setPhotoUri(uri);
      } catch {
        if (session.active && session.version === version)
          Alert.alert("Photo unavailable", failureMessage);
      } finally {
        if (session.active && session.version === version) {
          busy.current = false;
          setIsLoading(false);
        }
      }
    },
    [],
  );

  const choosePhoto = useCallback(
    (source: "gallery" | "camera") =>
      runAction(async () => {
        const sourceUri = await selectPhoto(source);
        if (!sourceUri) return undefined;
        const optimizedUri = await optimizePhoto(sourceUri);
        const savedUri = await savePhotoPermanently(optimizedUri, profileId);
        return `${savedUri}?t=${Date.now()}`;
      }, "Could not save the photo — check available storage and try again"),
    [profileId, runAction],
  );

  const pickFromGallery = useCallback(
    () => choosePhoto("gallery"),
    [choosePhoto],
  );
  const takeWithCamera = useCallback(
    () => choosePhoto("camera"),
    [choosePhoto],
  );
  const removePhoto = useCallback(
    () =>
      runAction(async () => {
        await deleteSavedPhoto(profileId);
        return null;
      }, "Could not remove the photo — please try again"),
    [profileId, runAction],
  );

  return { photoUri, isLoading, pickFromGallery, takeWithCamera, removePhoto };
}
