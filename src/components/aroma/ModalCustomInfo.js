import { Text, View } from "react-native";
import { StyleSheet } from "react-native";
import { borderRadius } from "../../styles/spacing";

export default function ModalCustomInfo({ aroma, currentUser, theme }) {
  if (!aroma.isCustom) return null;

  return (
    <View style={styles.customSection}>
      <View style={[styles.createdByBadge, { backgroundColor: theme.accentLight }]}>
        <Text style={styles.createdByIcon}>🖋️</Text>
        <Text style={[styles.createdByText, { color: theme.accent, fontSize: 12 * theme.fontScale }]}>
          {currentUser && aroma.ownerId === currentUser.uid
            ? "Created by You"
            : `Created by ${aroma.ownerName || "Unknown"}`}
        </Text>
      </View>

      {aroma.createdAt && (
        <Text style={[styles.createdDate, { color: theme.textSecondary, fontSize: 11 * theme.fontScale }]}>
          {new Date(aroma.createdAt).toLocaleDateString("en-US", {
            year: "numeric", month: "long", day: "numeric",
          })}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  customSection: {
    alignItems: "center", marginTop: 18, paddingTop: 16, borderTopWidth: 1, borderTopColor: "transparent",
  },
  createdByBadge: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: borderRadius.md, marginBottom: 8,
  },
  createdByIcon: { fontSize: 14, marginRight: 6 },
  createdByText: { fontWeight: "700", letterSpacing: 0.2 },
  createdDate: { fontWeight: "500", opacity: 0.6, letterSpacing: 0.1 },
});
