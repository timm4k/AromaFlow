import { StyleSheet, Text, View } from "react-native";

import { typography } from "../styles/typography";

const sectionHeaderStyles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 8,
  },
});

export default function SectionHeader({ title, theme }) {
  return (
    <View style={sectionHeaderStyles.wrapper}>
      <Text
        style={[
          typography.sectionLabel,
          sectionHeaderStyles.title,
          { color: theme.text },
        ]}
      >
        {title}
      </Text>
    </View>
  );
}
