import { useState } from "react";
import { Linking, Text } from "react-native";
import { useTheme } from "../../hooks/useTheme";
import { styles } from "../styles";
import { MapAction, MapNotice } from "./MapNotice";

export function LocationDenied() {
  const { theme } = useTheme();
  const [error, setError] = useState<string | null>(null);
  const openSettings = async () => {
    setError(null);
    try {
      await Linking.openSettings();
    } catch {
      setError(
        "Could not open Settings — enable location access in your device settings manually",
      );
    }
  };
  return (
    <MapNotice
      icon="🔒"
      title="Location access disabled"
      message="Enable foreground location access in your device settings, then return to AromaFlow"
    >
      <MapAction title="Open Settings" onPress={() => void openSettings()} />
      {error && (
        <Text
          accessibilityRole="alert"
          style={[styles.message, { color: theme.error }]}
        >
          {error}
        </Text>
      )}
    </MapNotice>
  );
}
