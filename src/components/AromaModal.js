import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function AromaModal({ visible, aroma, onClose, theme }) {
  if (!aroma) return null;

  const dots = Array.from({ length: 5 }, (_, i) => i < (aroma.intensity || 0));

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View
        style={[
          styles.overlay,
          {
            backgroundColor: theme.overlay,
          },
        ]}
      >
        <View
          style={[
            styles.sheet,
            {
              backgroundColor: theme.card,
            },
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
                  },
                ]}
              >
                {aroma.mood || ""}
              </Text>
            </View>
          </ScrollView>
        </View>
      </View>
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

    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
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
    fontSize: 18,
    fontWeight: "700",
  },

  emojiBox: {
    width: 84,
    height: 84,

    borderRadius: 24,

    justifyContent: "center",
    alignItems: "center",

    alignSelf: "center",

    marginBottom: 14,
  },

  emoji: {
    fontSize: 42,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",

    textAlign: "center",

    marginBottom: 10,
  },

  badge: {
    alignSelf: "center",

    paddingHorizontal: 14,
    paddingVertical: 5,

    borderRadius: 12,

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

    borderRadius: 16,

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
});
