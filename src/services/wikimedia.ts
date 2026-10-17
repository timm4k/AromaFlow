import { Platform } from "react-native";

export const wikimediaHeaders: Record<string, string> =
  Platform.OS === "web"
    ? {}
    : { "User-Agent": "AromaFlow/1.0 (+https://github.com/timm4k/AromaFlow)" };
