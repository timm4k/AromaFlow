import { Alert, Linking, Pressable, Text } from "react-native";
import { useScentPhoto } from "./useScentPhoto";
import { useTheme } from "../hooks/useTheme";
import { spacing } from "../styles/spacing";

interface ScentPhotoCreditProps {
  subject: string;
  title: string;
}

export function ScentPhotoCredit({ subject, title }: ScentPhotoCreditProps) {
  const { data: photo } = useScentPhoto(subject);
  const { theme } = useTheme();
  if (!photo) return null;
  return (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel={`Photo source for ${title}: ${photo.author}, ${photo.license}`}
      onPress={async () => {
        try {
          await Linking.openURL(photo.sourceUrl);
        } catch {
          Alert.alert("Source unavailable", "Could not open the photo source");
        }
      }}
      style={({ pressed }) => [
        { paddingVertical: spacing.md },
        pressed && { opacity: 0.8 },
      ]}
    >
      <Text
        style={{ color: theme.textSecondary, fontSize: 12, lineHeight: 18 }}
      >
        Photo source ↗ · Wikimedia Commons{"\n"}
        {photo.author} · {photo.license}
      </Text>
    </Pressable>
  );
}
