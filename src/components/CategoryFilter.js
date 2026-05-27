import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function CategoryFilter({
  categories,
  selected,
  onSelect,
  theme,
}) {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {categories.map((cat) => {
          const active = selected === cat;

          return (
            <TouchableOpacity
              key={cat}
              activeOpacity={0.75}
              onPress={() => onSelect(cat)}
              style={[
                styles.pill,
                {
                  backgroundColor: active ? theme.accent : theme.accentLight,

                  borderColor: active ? theme.accent : "transparent",
                },
              ]}
            >
              <Text
                numberOfLines={1}
                style={[
                  styles.label,
                  {
                    color: active ? "#FFFFFF" : theme.accent,

                    fontWeight: active ? "700" : "600",
                  },
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },

  scrollContent: {
    paddingLeft: 16,
    paddingRight: 10,
  },

  pill: {
    minHeight: 42,

    justifyContent: "center",
    alignItems: "center",

    paddingHorizontal: 16,
    paddingVertical: 10,

    marginRight: 8,

    borderRadius: 14,
    borderWidth: 1.5,
  },

  label: {
    fontSize: 13,

    letterSpacing: 0.2,

    includeFontPadding: false,
    textAlignVertical: "center",
  },
});
