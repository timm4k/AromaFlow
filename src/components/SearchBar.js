import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function SearchBar({ query, onChange, theme }) {
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
          shadowColor: theme.shadow,
        },
      ]}
    >
      <Text style={styles.icon}>🔍</Text>

      <TextInput
        value={query}
        onChangeText={onChange}
        placeholder="Search aromas..."
        placeholderTextColor={theme.textSecondary}
        autoCapitalize="none"
        autoCorrect={false}
        style={[styles.input, { color: theme.text, fontSize: 15 * theme.fontScale }]}
      />

      {query.length > 0 && (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => onChange("")}
          style={styles.clearButton}
        >
          <Text style={styles.clear}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 52,

    flexDirection: "row",
    alignItems: "center",

    marginHorizontal: 16,
    marginBottom: 10,

    paddingHorizontal: 14,

    borderRadius: 18,
    borderWidth: 1,

    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.06,
    shadowRadius: 8,

    elevation: 2,
  },

  icon: {
    fontSize: 16,
    opacity: 0.55,

    marginRight: 10,
  },

  input: {
    flex: 1,

    fontWeight: "500",

    paddingVertical: 12,
  },

  clearButton: {
    paddingLeft: 8,
    paddingVertical: 4,
  },

  clear: {
    fontSize: 16,
    opacity: 0.45,
  },
});
