import { useRef, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

export default function InputField({
  label,
  value,
  onChangeText,
  placeholder,
  theme,
  multiline = false,
  maxLength,
  validation,
  autoCapitalize = "sentences",
  keyboardType = "default",
}) {
  const [touched, setTouched] = useState(false);
  const inputRef = useRef(null);

  const result = validation ? validation(value) : { valid: true, message: "" };
  const showError = touched && !result.valid && result.message;

  return (
    <View style={styles.container}>
      {label ? (
        <Text style={[styles.label, { color: theme.text, fontSize: 13 * theme.fontScale }]}>{label}</Text>
      ) : null}

      <View
        style={[
          styles.inputWrapper,
          {
            backgroundColor: theme.card,
            borderColor: showError
              ? theme.error
              : touched && result.valid
                ? "#4CAF50"
                : theme.border,
          },
        ]}
      >
        <TextInput
          ref={inputRef}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.textSecondary + "99"}
            style={[
            styles.input,
            multiline && styles.multiline,
            { color: theme.text, fontSize: 16 * theme.fontScale },
          ]}
          multiline={multiline}
          numberOfLines={multiline ? 4 : 1}
          textAlignVertical={multiline ? "top" : "center"}
          maxLength={maxLength}
          autoCapitalize={autoCapitalize}
          keyboardType={keyboardType}
          onBlur={() => setTouched(true)}
        />
      </View>

      {showError && (
        <Text style={[styles.error, { color: theme.error, fontSize: 12 * theme.fontScale }]}>{result.message}</Text>
      )}

      {maxLength && (
        <Text style={[styles.counter, { color: theme.textSecondary, fontSize: 11 * theme.fontScale }]}>
          {value.length}/{maxLength}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 18,
  },

  label: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 8,
  },

  inputWrapper: {
    borderRadius: 16,
    borderWidth: 1.5,
    overflow: "hidden",
  },

  input: {
    fontSize: 16,
    fontWeight: "500",
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 50,
  },

  multiline: {
    minHeight: 100,
    paddingTop: 14,
  },

  error: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: 6,
    marginLeft: 4,
  },

  counter: {
    fontSize: 11,
    fontWeight: "500",
    textAlign: "right",
    marginTop: 4,
    marginRight: 4,
    opacity: 0.6,
  },
});
