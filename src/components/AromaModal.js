import { useEffect, useRef } from "react";
import {
  Animated,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { shadows } from "../styles/shadows";
import { borderRadius } from "../styles/spacing";
import { typography } from "../styles/typography";

export default function AromaModal({
  visible,
  aroma,
  onClose,
  theme,
  enableAnimations,
  currentUser,
}) {
  if (!aroma) return null;

  const dots = Array.from(
    { length: 5 },
    (_, i) => i < (aroma.intensity || 0),
  );

  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const sheetTranslate = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    if (visible) {
      const dur = enableAnimations ? 300 : 0;

      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: dur,
          useNativeDriver: true,
        }),
        Animated.timing(sheetTranslate, {
          toValue: 0,
          duration: dur,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      overlayOpacity.setValue(0);
      sheetTranslate.setValue(300);
    }
  }, [visible, enableAnimations]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Animated.View
        style={[
          styles.overlay,
          {
            backgroundColor: theme.overlay,
            opacity: overlayOpacity,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.sheet,
            {
              backgroundColor: theme.card,
              shadowColor: theme.shadow,
              transform: [{ translateY: sheetTranslate }],
            },
            shadows.modal,
          ]}
        >
          <TouchableOpacity
            onPress={onClose}
            activeOpacity={0.7}
            style={styles.closeButton}
          >
            <Text
              style={[
                styles.closeText,
                {
                  color: theme.textSecondary,
                },
              ]}
            >
              ✕
            </Text>
          </TouchableOpacity>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View
              style={[
                styles.emojiBox,
                {
                  backgroundColor: theme.bg,
                },
              ]}
            >
              <Text style={styles.emoji}>{aroma.emoji || ""}</Text>
            </View>

            <Text
              style={[
                styles.title,
                {
                  color: theme.text,
                  fontSize: 28 * theme.fontScale,
                },
              ]}
            >
              {aroma.title || ""}
            </Text>

            <View
              style={[
                styles.badge,
                {
                  backgroundColor: theme.accentLight,
                },
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  {
                    color: theme.accent,
                    fontSize: 13 * theme.fontScale,
                  },
                ]}
              >
                {aroma.category || ""}
              </Text>
            </View>

            <View style={styles.intensityRow}>
              <Text
                style={[
                  styles.intensityLabel,
                  {
                    color: theme.textSecondary,
                    fontSize: 13 * theme.fontScale,
                  },
                ]}
              >
                Intensity
              </Text>

              <View style={styles.dots}>
                {dots.map((filled, i) => (
                  <View
                    key={i}
                    style={[
                      styles.dot,
                      {
                        backgroundColor: filled
                          ? theme.accent
                          : theme.accentLight,
                      },
                    ]}
                  />
                ))}
              </View>
            </View>

            <View
              style={[
                styles.divider,
                {
                  backgroundColor: theme.border,
                },
              ]}
            />

            <Text
              style={[
                styles.description,
                {
                  color: theme.textSecondary,
                  fontSize: 15 * theme.fontScale,
                  lineHeight: 23 * theme.fontScale,
                },
              ]}
            >
              {aroma.fullDescription || ""}
            </Text>

            <View style={styles.detailRow}>
              <Text
                style={[
                  styles.detailLabel,
                  {
                    color: theme.text,
                    fontSize: 13 * theme.fontScale,
                  },
                ]}
              >
                Origin
              </Text>

              <Text
                style={[
                  styles.detailValue,
                  {
                    color: theme.textSecondary,
                    fontSize: 15 * theme.fontScale,
                    lineHeight: 21 * theme.fontScale,
                  },
                ]}
              >
                {aroma.origin || ""}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text
                style={[
                  styles.detailLabel,
                  {
                    color: theme.text,
                    fontSize: 13 * theme.fontScale,
                  },
                ]}
              >
                Best for
              </Text>

              <Text
                style={[
                  styles.detailValue,
                  {
                    color: theme.textSecondary,
                    fontSize: 15 * theme.fontScale,
                    lineHeight: 21 * theme.fontScale,
                  },
                ]}
              >
                {aroma.recommendedUsage || ""}
              </Text>
            </View>

            <View
              style={[
                styles.moodBox,
                {
                  backgroundColor: theme.accentLight,
                },
              ]}
            >
              <Text style={styles.moodIcon}>✨</Text>

              <Text
                style={[
                  styles.moodText,
                  {
                    color: theme.accent,
                    fontSize: 15 * theme.fontScale,
                  },
                ]}
              >
                {aroma.mood || ""}
              </Text>
            </View>

            {aroma.isCustom && (
              <View style={styles.customSection}>
                <View
                  style={[
                    styles.createdByBadge,
                    { backgroundColor: theme.accentLight },
                  ]}
                >
                  <Text style={styles.createdByIcon}>🖋️</Text>

                  <Text
                    style={[
                      styles.createdByText,
                      {
                        color: theme.accent,
                        fontSize: 12 * theme.fontScale,
                      },
                    ]}
                  >
                    {currentUser && aroma.ownerId === currentUser.id
                      ? "Created by You"
                      : `Created by ${aroma.ownerName || "Unknown"}`}
                  </Text>
                </View>

                {aroma.createdAt && (
                  <Text
                    style={[
                      styles.createdDate,
                      {
                        color: theme.textSecondary,
                        fontSize: 11 * theme.fontScale,
                      },
                    ]}
                  >
                    {new Date(aroma.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </Text>
                )}
              </View>
            )}
          </ScrollView>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },

  sheet: {
    maxHeight: "85%",
    paddingTop: 20,
    paddingBottom: 36,
    paddingHorizontal: 24,
    borderTopLeftRadius: borderRadius.xxl,
    borderTopRightRadius: borderRadius.xxl,
  },

  closeButton: {
    alignSelf: "flex-end",
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },

  closeText: {
    fontWeight: "700",
  },

  emojiBox: {
    width: 84,
    height: 84,
    borderRadius: borderRadius.xl,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 14,
  },

  emoji: {
    fontSize: 42,
  },

  title: {
    ...typography.screenTitle,
    textAlign: "center",
    marginBottom: 10,
  },

  badge: {
    alignSelf: "center",
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: borderRadius.sm + 4,
    marginBottom: 14,
  },

  badgeText: {
    fontSize: 13,
    fontWeight: "700",
  },

  intensityRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },

  intensityLabel: {
    fontSize: 13,
    fontWeight: "600",
    marginRight: 10,
  },

  dots: {
    flexDirection: "row",
  },

  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },

  divider: {
    height: 1,
    marginBottom: 18,
  },

  description: {
    fontSize: 15,
    lineHeight: 23,
    marginBottom: 18,
  },

  detailRow: {
    marginBottom: 16,
  },

  detailLabel: {
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    marginBottom: 4,
  },

  detailValue: {
    fontSize: 15,
    lineHeight: 21,
  },

  moodBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 14,
    borderRadius: borderRadius.md,
    marginTop: 6,
  },

  moodIcon: {
    fontSize: 18,
    marginRight: 8,
  },

  moodText: {
    fontSize: 15,
    fontWeight: "700",
  },

  customSection: {
    alignItems: "center",
    marginTop: 18,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "transparent",
  },

  createdByBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: borderRadius.md,
    marginBottom: 8,
  },

  createdByIcon: {
    fontSize: 14,
    marginRight: 6,
  },

  createdByText: {
    fontWeight: "700",
    letterSpacing: 0.2,
  },

  createdDate: {
    fontWeight: "500",
    opacity: 0.6,
    letterSpacing: 0.1,
  },
});
