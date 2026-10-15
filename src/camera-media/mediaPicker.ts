import * as ImagePicker from "expo-image-picker";
import { Alert, Linking } from "react-native";

type PhotoSource = "gallery" | "camera";
const PICKER_QUALITY = 0.8;

function showPermissionNotice(source: PhotoSource) {
  Alert.alert(
    "Permission needed",
    source === "camera"
      ? "Allow camera access in Settings to take a photo"
      : "Allow photo library access in Settings to choose a photo",
    [
      { text: "Cancel", style: "cancel" },
      {
        text: "Open Settings",
        onPress: () => {
          void Linking.openSettings().catch(() =>
            Alert.alert(
              "Settings unavailable",
              "Open app permissions in your device settings",
            ),
          );
        },
      },
    ],
  );
}

export async function selectPhoto(
  source: PhotoSource,
  aspect: [number, number] = [1, 1],
): Promise<string | null> {
  const permission = await (source === "camera"
    ? ImagePicker.requestCameraPermissionsAsync()
    : ImagePicker.requestMediaLibraryPermissionsAsync());
  if (permission.status !== "granted") {
    showPermissionNotice(source);
    return null;
  }
  const options: ImagePicker.ImagePickerOptions = {
    mediaTypes: ["images"],
    allowsEditing: true,
    aspect,
    quality: PICKER_QUALITY,
  };
  const result = await (source === "camera"
    ? ImagePicker.launchCameraAsync(options)
    : ImagePicker.launchImageLibraryAsync(options));
  return result.canceled ? null : (result.assets?.[0]?.uri ?? null);
}
