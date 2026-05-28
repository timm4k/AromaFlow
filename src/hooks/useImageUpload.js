import { useState } from "react";
import { Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { uploadAromaImage, deleteAromaImage } from "../firebase/storageService";
import { updateAroma } from "../firebase/aromaService";

export default function useImageUpload(aroma, setAroma) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  async function pickAndUpload() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permission needed", "Gallery access is required to attach images.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.8,
      allowsEditing: true,
    });

    if (result.canceled) return;

    const uri = result.assets[0].uri;

    setUploading(true);
    setUploadProgress(0);

    try {
      const url = await uploadAromaImage(aroma.id, uri, (progress) => {
        setUploadProgress(progress);
      });

      await updateAroma(aroma.id, { imageUrl: url });
      setAroma((prev) => ({ ...prev, imageUrl: url }));
    } catch (e) {
      Alert.alert("Upload failed", "Could not upload image. Please try again.");
      console.warn("Image upload error", e);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  }

  async function removeImage() {
    try {
      await deleteAromaImage(aroma.id);
      await updateAroma(aroma.id, { imageUrl: "" });
      setAroma((prev) => ({ ...prev, imageUrl: "" }));
    } catch (e) {
      console.warn("Failed to remove image", e);
    }
  }

  return { uploading, uploadProgress, pickAndUpload, removeImage };
}
