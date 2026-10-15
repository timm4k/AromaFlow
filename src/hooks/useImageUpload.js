import { useEffect, useRef, useState } from "react";
import { Alert } from "react-native";
import { updateAroma } from "../firebase/aromaService";
import { selectPhoto } from "../camera-media/mediaPicker";
import { encodeSharedPhoto } from "../camera-media/mediaService";

export default function useImageUpload(aroma, setAroma) {
  const [previewUri, setPreviewUri] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const session = useRef({ active: false, busy: false });

  useEffect(() => {
    const current = session.current;
    current.active = true;
    return () => {
      current.active = false;
    };
  }, []);

  async function pickImage() {
    const current = session.current;
    if (!current.active || current.busy) return;
    current.busy = true;
    try {
      const uri = await selectPhoto("gallery", [4, 3]);
      if (!uri || !current.active) return;
      setPreviewUri(uri);
      setShowConfirm(true);
    } catch {
      if (current.active)
        Alert.alert(
          "Gallery unavailable",
          "Could not open your photos — please try again",
        );
    } finally {
      current.busy = false;
    }
  }

  async function persistImage(sourceUri) {
    const current = session.current;
    if (!current.active || current.busy || !aroma?.id) return;
    current.busy = true;
    setShowConfirm(false);
    setIsSaving(true);

    try {
      const imageUri = sourceUri ? await encodeSharedPhoto(sourceUri) : "";
      await updateAroma(aroma.id, { imageUri });
      if (current.active) {
        setAroma((prev) => ({ ...prev, imageUri }));
        setPreviewUri(null);
      }
    } catch (error) {
      if (current.active) {
        setPreviewUri(null);
        Alert.alert(
          "Photo not saved",
          error instanceof Error
            ? error.message
            : "Check your connection and try again",
        );
      }
    } finally {
      current.busy = false;
      if (current.active) setIsSaving(false);
    }
  }

  function confirmImage() {
    if (previewUri) return persistImage(previewUri);
  }

  function cancelImage() {
    if (session.current.busy) return;
    setShowConfirm(false);
    setPreviewUri(null);
  }

  function removeImage() {
    return persistImage(null);
  }

  return {
    previewUri,
    showConfirm,
    isSaving,
    pickImage,
    confirmImage,
    cancelImage,
    removeImage,
  };
}
