import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "../../styles/screens/addAromaStyles";

export default function VisibilitySelector({ visibility, onSelect, theme }) {
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionLabel, { color: theme.text }]}>
        Visibility
      </Text>

      <View style={styles.visibilityRow}>
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => onSelect("private")}
          style={[
            styles.visibilityPill,
            {
              backgroundColor:
                visibility === "private"
                  ? theme.accent
                  : theme.accentLight,
              borderColor:
                visibility === "private" ? theme.accent : "transparent",
            },
          ]}
        >
          <Text style={styles.visibilityIcon}>🔒</Text>

          <Text
            style={[
              styles.visibilityText,
              {
                color:
                  visibility === "private"
                    ? theme.white
                    : theme.accent,
                fontWeight: visibility === "private" ? "700" : "600",
              },
            ]}
          >
            Private
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => onSelect("public")}
          style={[
            styles.visibilityPill,
            {
              backgroundColor:
                visibility === "public"
                  ? theme.accent
                  : theme.accentLight,
              borderColor:
                visibility === "public" ? theme.accent : "transparent",
            },
          ]}
        >
          <Text style={styles.visibilityIcon}>🌍</Text>

          <Text
            style={[
              styles.visibilityText,
              {
                color:
                  visibility === "public" ? theme.white : theme.accent,
                fontWeight: visibility === "public" ? "700" : "600",
              },
            ]}
          >
            Public
          </Text>
        </TouchableOpacity>
      </View>

      <Text
        style={[
          styles.visibilityHint,
          { color: theme.textSecondary },
        ]}
      >
        {visibility === "public"
          ? "Everyone can see this aroma in Community"
          : "Only you can see this aroma"}
      </Text>
    </View>
  );
}
