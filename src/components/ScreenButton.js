import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ScreenButton({ label, active, onPress, theme }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[
        styles.button,
        {
          backgroundColor: active ? theme.accent : "transparent",

          borderColor: active ? theme.accent : theme.accentDim,
        },
      ]}
    >
      <View style={styles.content}>
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          style={[
            styles.label,
            {
              color: active ? "#FFFFFF" : theme.accent,
            },
          ]}
        >
          {label}
        </Text>

        {active && <Text style={styles.indicator}>•</Text>}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",

    paddingHorizontal: 18,
    paddingVertical: 18,

    borderRadius: 18,
    borderWidth: 1.5,
  },

  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  label: {
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 22,
    paddingTop: 2,

    letterSpacing: 0.2,
  },

  indicator: {
    marginLeft: 6,

    fontSize: 10,
    color: "#FFFFFF",
  },
});
