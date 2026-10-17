import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn, ReduceMotion } from "react-native-reanimated";
import { useTheme } from "../hooks/useTheme";
import { useScentPhoto } from "./useScentPhoto";

interface ScentImageProps {
  subject: string;
  title: string;
  emoji: string;
  height: number;
  imageUri?: string;
  thumbnail?: boolean;
}

const photoEntrance = FadeIn.duration(280).reduceMotion(ReduceMotion.System);

export function ScentImage({
  subject,
  title,
  emoji,
  height,
  imageUri,
  thumbnail = false,
}: ScentImageProps) {
  const { theme, enableAnimations } = useTheme();
  const { data: photo, isPending } = useScentPhoto(subject, !imageUri);
  const uri = imageUri || photo?.uri;
  const [failedUri, setFailedUri] = useState<string | null>(null);
  return (
    <View
      style={{
        width: "100%",
        backgroundColor: theme.accentLight,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {!uri || failedUri === uri ? (
        <View style={[styles.placeholder, { height }]}>
          <Text
            accessibilityLabel={title}
            style={{ fontSize: thumbnail ? 24 : 48 }}
          >
            {emoji}
          </Text>
          {!thumbnail && (
            <Text style={{ color: theme.textSecondary }}>
              {isPending && !imageUri
                ? "Finding ingredient photo…"
                : "Ingredient photo unavailable"}
            </Text>
          )}
        </View>
      ) : (
        <Animated.Image
          key={uri}
          entering={enableAnimations ? photoEntrance : undefined}
          accessibilityLabel={`${title} ingredient photo`}
          source={{ uri }}
          resizeMode="cover"
          style={{ width: "100%", height }}
          onError={() => setFailedUri(uri)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  placeholder: { alignItems: "center", justifyContent: "center" },
});
