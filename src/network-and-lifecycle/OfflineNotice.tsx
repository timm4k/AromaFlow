import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { useTheme } from "../hooks/useTheme";
import { spacing } from "../styles/spacing";

export function OfflineNotice() {
  const [isOffline, setIsOffline] = useState(false);
  const { theme } = useTheme();
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) =>
      setIsOffline(
        state.isConnected === false || state.isInternetReachable === false,
      ),
    );
    return () => unsubscribe();
  }, []);
  if (!isOffline) return null;
  return (
    <View
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      style={{
        backgroundColor: theme.error,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
      }}
    >
      <Text
        style={{ color: theme.white, textAlign: "center", fontWeight: "600" }}
      >
        ⚠ No internet connection
      </Text>
    </View>
  );
}
