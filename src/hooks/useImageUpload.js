import { useState } from "react";
import { Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { updateAroma } from "../firebase/aromaService";

export default function useImageUpload(aroma, setAroma) {
  const [previewUri, setPreviewUri] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  async function pickImage() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission needed", "Gallery access is required to attach images.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.8,
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (result.canceled) return;

    setPreviewUri(result.assets[0].uri);
    setShowConfirm(true);
  }

  async function confirmImage() {
    setShowConfirm(false);
    if (!previewUri) return;

    try {
      await updateAroma(aroma.id, { imageUri: previewUri });
      setAroma((prev) => ({ ...prev, imageUri: previewUri }));
      setPreviewUri(null);
    } catch (e) {
      setPreviewUri(null);
      Alert.alert("Error", "Failed to save image. Try again.");
    }
  }

  function cancelImage() {
    setShowConfirm(false);
    setPreviewUri(null);
  }

  async function removeImage() {
    try {
      await updateAroma(aroma.id, { imageUri: "" });
      setAroma((prev) => ({ ...prev, imageUri: "" }));
    } catch (e) {
      console.warn("Failed to remove image", e);
    }
  }

  return {
    previewUri,
    showConfirm,
    pickImage,
    confirmImage,
    cancelImage,
    removeImage,
  };
}
