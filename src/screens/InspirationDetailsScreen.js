import { Alert, Linking, ScrollView, Share, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";
import { spacing } from "../styles/spacing";
import { borderRadius } from "../styles/spacing";
import { shadows } from "../styles/shadows";

export default function InspirationDetailsScreen({ route, navigation }) {
  const { inspiration } = route.params;
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  async function handleShare() {
    try {
      await Share.share({
        message: `${inspiration.emoji} ${inspiration.title}\n\n${inspiration.subtitle}\n\n${inspiration.content.slice(0, 200)}…`,
        title: inspiration.title,
      });
    } catch {
    }
  }

  async function handleOpenSource() {
    const url = inspiration.sourceUrl;

    if (!url) return;

    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert("Link Unavailable", "This source page could not be opened.");
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.md, backgroundColor: theme.bg }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.7}>
          <Text style={[styles.backArrow, { color: theme.accent }]}>←</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleShare} style={styles.shareBtn} activeOpacity={0.7}>
          <Text style={{ fontSize: 20 }}>📤</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + spacing.xl }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroSection}>
          <View style={[styles.emojiCircle, { backgroundColor: theme.accentLight }]}>
            <Text style={styles.heroEmoji}>{inspiration.emoji}</Text>
          </View>

          <Text style={[styles.title, { color: theme.text }]}>{inspiration.title}</Text>

          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            {inspiration.subtitle}
          </Text>

          <View style={styles.metaRow}>
            {inspiration.category && (
              <View style={[styles.badge, { backgroundColor: theme.accentLight }]}>
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
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleOpenSource}
              style={[styles.sourceBtn, { backgroundColor: theme.accentLight, borderColor: theme.accent }]}
            >
              <Text style={[styles.sourceBtnText, { color: theme.accent }]}>
                🔗 Open Source Article
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.contentSection}>
          <Text style={[styles.body, { color: theme.text }]}>
            {inspiration.content}
          </Text>

          {inspiration.tips && inspiration.tips.length > 0 && (
            <View style={[styles.tipsCard, { backgroundColor: theme.card, shadowColor: theme.shadow }, shadows.modal]}>
              <Text style={[styles.tipsTitle, { color: theme.text }]}>
                💡 Practical Tips
              </Text>

              {inspiration.tips.map((tip, index) => (
                <View key={index} style={styles.tipRow}>
                  <Text style={[styles.tipBullet, { color: theme.accent }]}>•</Text>

                  <Text style={[styles.tipText, { color: theme.textSecondary }]}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  backBtn: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  backArrow: {
    fontSize: 28,
    fontWeight: "600",
  },
  shareBtn: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  heroSection: {
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
  emojiCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  heroEmoji: {
    fontSize: 48,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
    opacity: 0.7,
    marginBottom: spacing.md,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 50,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: "600",
  },
  meta: {
    fontSize: 13,
    fontWeight: "500",
    opacity: 0.6,
  },
  sourceBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
  },
  sourceBtnText: {
    fontSize: 14,
    fontWeight: "700",
  },
  contentSection: {
    paddingHorizontal: spacing.lg,
  },
  body: {
    fontSize: 16,
    lineHeight: 26,
    fontWeight: "400",
    marginBottom: spacing.xl,
  },
  tipsCard: {
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    marginBottom: spacing.xl,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: spacing.md,
  },
  tipRow: {
    flexDirection: "row",
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  tipBullet: {
    fontSize: 16,
    fontWeight: "700",
    width: 12,
  },
  tipText: {
    fontSize: 15,
    lineHeight: 22,
    flex: 1,
  },
});
