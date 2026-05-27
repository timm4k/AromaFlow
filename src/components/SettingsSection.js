import { StyleSheet, View } from "react-native";
import { shadows } from "../styles/shadows";

const sectionStyles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    borderRadius: 18,
  },
});

export default function SettingsSection({ children, theme }) {
  return (
    <View
      style={[
        sectionStyles.container,
        { backgroundColor: theme.card, shadowColor: theme.shadow },
        shadows.section,
      ]}
    >
      {children}
    </View>
  );
}
