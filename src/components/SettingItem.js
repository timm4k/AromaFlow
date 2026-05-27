import { StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";

export default function SettingItem({
  title,
  value,
  onToggle,
  type,
  options,
  theme,
}) {
  if (type === "options") {
    return (
      <View
        style={[
          styles.containerColumn,
          {
            borderBottomColor: theme.border,
          },
        ]}
      >
        <Text
          style={[
            styles.title,
            {
              color: theme.text,
              fontSize: 16 * theme.fontScale,
            },
          ]}
        >
          {title}
        </Text>

        <View style={styles.optionsRow}>
          {options.map((opt) => {
            const active = value === opt;

            return (
              <TouchableOpacity
                key={opt}
                activeOpacity={0.8}
                onPress={() => onToggle(opt)}
                style={[
                  styles.option,
                  {
                    backgroundColor: active ? theme.accent : theme.accentLight,

                    borderColor: active ? theme.accent : "transparent",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.optionText,
                    {
                      color: active ? "#FFFFFF" : theme.accent,

                      fontWeight: active ? "700" : "600",
                      fontSize: 13 * theme.fontScale,
                    },
                  ]}
                >
                  {opt}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        {
          borderBottomColor: theme.border,
        },
      ]}
    >
      <Text
        style={[
          styles.title,
          {
            color: theme.text,
            fontSize: 16 * theme.fontScale,
          },
        ]}
      >
        {title}
      </Text>

      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{
          false: theme.accentLight,
          true: theme.accentDim,
        }}
        thumbColor={value ? theme.accent : "#FFFFFF"}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 68,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    paddingHorizontal: 20,
    paddingVertical: 14,

    borderBottomWidth: 1,
  },

  containerColumn: {
    paddingHorizontal: 20,
    paddingVertical: 16,

    borderBottomWidth: 1,
  },

  title: {
    flex: 1,

    paddingRight: 16,

    fontSize: 16,
    fontWeight: "600",

    letterSpacing: -0.2,
  },

  optionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",

    marginTop: 14,
  },

  option: {
    paddingHorizontal: 14,
    paddingVertical: 8,

    borderRadius: 12,
    borderWidth: 1.5,

    marginRight: 8,
    marginBottom: 8,
  },

  optionText: {
    fontSize: 13,

    textTransform: "capitalize",

    letterSpacing: 0.2,
  },
});
