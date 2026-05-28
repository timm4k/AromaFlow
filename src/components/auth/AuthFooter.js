import { Text, TouchableOpacity } from "react-native";
import { spacing } from "../../styles/spacing";

export default function AuthFooter({ theme, label, actionLabel, onAction }) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onAction}
      style={{ marginTop: spacing.md, alignItems: "center" }}
    >
      <Text
        style={{
          fontSize: 15,
          fontWeight: "500",
          opacity: 0.7,
          textAlign: "center",
          color: theme.textSecondary,
        }}
      >
        {label}{" "}
        <Text style={{ color: theme.accent, fontWeight: "700" }}>
          {actionLabel}
        </Text>
      </Text>
    </TouchableOpacity>
  );
}
