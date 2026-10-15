import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Alert,
  Linking,
  Pressable,
  ScrollView,
  Share,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../hooks/useTheme";
import { shadows } from "../styles/shadows";
import { spacing } from "../styles/spacing";
import { inspirations } from "./guideArticles";
import { styles } from "./guideDetailsStyles";

export default function GuideDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const inspiration = inspirations.find(
    (item) => item.id === (Array.isArray(id) ? id[0] : id),
  );
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  async function handleShare() {
    try {
      await Share.share({
        message: `${inspiration.emoji} ${inspiration.title}\n\n${inspiration.subtitle}\n\n${inspiration.content.slice(0, 200)}…`,
        title: inspiration.title,
      });
    } catch {
      Alert.alert("Sharing Unavailable", "Could not share this article");
    }
  }

  async function handleOpenSource() {
    const url = inspiration.sourceUrl;

    if (!url) return;

    try {
      if (!(await Linking.canOpenURL(url))) throw new Error("Unsupported link");
      await Linking.openURL(url);
    } catch {
      Alert.alert("Link Unavailable", "This source page could not be opened");
    }
  }

  if (!inspiration) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: theme.bg, paddingTop: insets.top },
        ]}
      >
        <Text style={{ color: theme.text }}>Article not found</Text>
        <Pressable
          accessibilityRole="button"
          style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.8 }]}
          onPress={() =>
            router.canGoBack() ? router.back() : router.replace("/inspiration")
          }
        >
          <Text style={{ color: theme.accent }}>Back to inspiration</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <View
        style={[
          styles.header,
          { paddingTop: insets.top + spacing.md, backgroundColor: theme.bg },
        ]}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back to guides"
          style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.8 }]}
          onPress={() =>
            router.canGoBack() ? router.back() : router.replace("/inspiration")
          }
        >
          <Text style={[styles.backArrow, { color: theme.accent }]}>←</Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.shareBtn,
            pressed && { opacity: 0.8 },
          ]}
          accessibilityLabel="Share guide"
          onPress={handleShare}
        >
          <Text style={{ fontSize: 20 }}>📤</Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + spacing.xl }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroSection}>
          <View
            style={[styles.emojiCircle, { backgroundColor: theme.accentLight }]}
          >
            <Text style={styles.heroEmoji}>{inspiration.emoji}</Text>
          </View>

          <Text style={[styles.title, { color: theme.text }]}>
            {inspiration.title}
          </Text>

          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            {inspiration.subtitle}
          </Text>

          <View style={styles.metaRow}>
            {inspiration.category && (
              <View
                style={[styles.badge, { backgroundColor: theme.accentLight }]}
              >
                <Text style={[styles.badgeText, { color: theme.accent }]}>
                  {inspiration.category}
                </Text>
              </View>
            )}

            {inspiration.readTime && (
              <Text style={[styles.meta, { color: theme.textSecondary }]}>
                {inspiration.readTime} read
              </Text>
            )}

            {inspiration.date && (
              <Text style={[styles.meta, { color: theme.textSecondary }]}>
                {inspiration.date}
              </Text>
            )}
          </View>

          {inspiration.sourceUrl && (
            <Pressable
              accessibilityRole="link"
              onPress={handleOpenSource}
              style={({ pressed }) => [
                styles.sourceBtn,
                {
                  backgroundColor: theme.accentLight,
                  borderColor: theme.accent,
                },
                pressed && { opacity: 0.8 },
              ]}
            >
              <Text style={[styles.sourceBtnText, { color: theme.accent }]}>
                🔗 Open Source Article
              </Text>
            </Pressable>
          )}
        </View>

        <View style={styles.contentSection}>
          <Text style={[styles.body, { color: theme.text }]}>
            {inspiration.content}
          </Text>

          {inspiration.tips && inspiration.tips.length > 0 && (
            <View
              style={[
                styles.tipsCard,
                { backgroundColor: theme.card, shadowColor: theme.shadow },
                shadows.modal,
              ]}
            >
              <Text style={[styles.tipsTitle, { color: theme.text }]}>
                💡 Practical Tips
              </Text>

              {inspiration.tips.map((tip) => (
                <View key={tip} style={styles.tipRow}>
                  <Text style={[styles.tipBullet, { color: theme.accent }]}>
                    •
                  </Text>

                  <Text
                    style={[styles.tipText, { color: theme.textSecondary }]}
                  >
                    {tip}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
