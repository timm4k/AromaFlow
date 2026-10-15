import { useRouter } from "expo-router";
import { FlatList, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ScreenHeader from "../components/ScreenHeader";
import { useTheme } from "../hooks/useTheme";
import { spacing } from "../styles/spacing";
import { inspirations } from "./guideArticles";
import GuideCard from "./GuideCard";

export default function GuideLibraryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme, enableAnimations } = useTheme();
  return (
    <View
      style={{ flex: 1, backgroundColor: theme.bg, paddingTop: insets.top }}
    >
      <Pressable
        accessibilityRole="button"
        onPress={() =>
          router.canGoBack() ? router.back() : router.replace("/inspiration")
        }
        style={({ pressed }) => [
          { padding: spacing.md },
          pressed && { opacity: 0.8 },
        ]}
      >
        <Text style={{ color: theme.accent }}>← Back to scent reading</Text>
      </Pressable>
      <ScreenHeader
        title="AromaFlow guides"
        subtitle="Our collection of scent notes and practical reading"
        theme={theme}
        style={{}}
      />
      <FlatList
        data={inspirations}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingTop: spacing.md,
          paddingBottom: insets.bottom + spacing.xl,
        }}
        renderItem={({ item, index }) => (
          <GuideCard
            item={item}
            index={index}
            theme={theme}
            enableAnimations={enableAnimations}
          />
        )}
      />
    </View>
  );
}
