import { StyleSheet, Text, View } from "react-native";

import { headerPadding } from "../styles/spacing";
import { typography } from "../styles/typography";

export default function ScreenHeader({ title, subtitle, theme, style }) {
  return (
    <View
      style={[
        styles.container,
        { paddingBottom: headerPadding.bottom },
        style,
      ]}
    >
      <Text style={[styles.title, { color: theme.text }]}>
        {title}
      </Text>

      {subtitle && (
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          {subtitle}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },

  title: {
    ...typography.screenTitle,
    marginBottom: 4,
  },

  subtitle: {
    ...typography.screenSubtitle,
  },
});
