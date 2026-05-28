import { Text, TouchableOpacity, View } from "react-native";
import { addCategories } from "../../utils/constants";
import { styles } from "../../styles/screens/addAromaStyles";

export default function CategorySelector({ selectedCategory, onSelect, theme }) {
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionLabel, { color: theme.text }]}>
        Category
      </Text>

      <View style={styles.pillsRow}>
        {addCategories.map((cat) => {
          const active = selectedCategory === cat;

          return (
            <TouchableOpacity
              key={cat}
              activeOpacity={0.75}
              onPress={() => onSelect(cat)}
              style={[
                styles.pill,
                {
                  backgroundColor: active
                    ? theme.accent
                    : theme.accentLight,
                  borderColor: active ? theme.accent : "transparent",
                  shadowColor: active ? theme.accent : "transparent",
                  shadowOpacity: active ? 0.3 : 0,
                },
              ]}
            >
              <Text
                style={[
                  styles.pillText,
                  {
                    color: active ? theme.white : theme.accent,
                    fontWeight: active ? "700" : "600",
                    fontSize: 13 * theme.fontScale,
                  },
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {!selectedCategory && (
        <Text style={[styles.hint, { color: theme.textSecondary }]}>
          Please select a category
        </Text>
      )}
    </View>
  );
}
