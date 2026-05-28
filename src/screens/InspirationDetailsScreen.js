import { Alert, Linking, ScrollView, Share, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../hooks/useTheme";
import { shadows } from "../styles/shadows";
import { styles } from "../styles/screens/inspirationDetailsStyles";

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
