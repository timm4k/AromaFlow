import { forwardRef, useState } from "react";
import type { TextInputProps } from "react-native";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { getTheme } from "../styles/colors";
import { borderRadius, spacing } from "../styles/spacing";

import { fieldColors } from "./formColors";
const defaultTheme = getTheme(false, true, "medium");

export interface InputFieldProps extends TextInputProps {
  label: string;
  error?: string;
  onClear?: () => void;
  theme?: ReturnType<typeof getTheme>;
  validation?: (value: string) => { valid: boolean; message: string };
}

export const InputField = forwardRef<TextInput, InputFieldProps>(
  function InputField(
    {
      label,
      error,
      onClear,
      value = "",
      onChangeText,
      onFocus,
      onBlur,
      theme = defaultTheme,
      validation,
      style,
      multiline = false,
      maxLength,
      editable = true,
      placeholderTextColor = theme.textSecondary,
      ...rest
    },
    ref,
  ) {
    const [isFocused, setIsFocused] = useState(false);
    const [touched, setTouched] = useState(false);
    const validationResult = validation?.(value);
    const message =
      error ||
      (touched && validationResult && !validationResult.valid
        ? validationResult.message
        : undefined);

    return (
      <View style={styles.container}>
        <Text
          style={[
            styles.label,
            { color: theme.text, fontSize: 13 * theme.fontScale },
          ]}
        >
          {label}
        </Text>
        <View
          style={[
            styles.wrapper,
            {
              backgroundColor: theme.card,
              borderColor: message
                ? fieldColors.error
                : isFocused
                  ? fieldColors.focus
                  : theme.border,
              borderWidth: isFocused ? 2 : 1.5,
            },
          ]}
        >
          <TextInput
            {...rest}
            ref={ref}
            accessibilityLabel={rest.accessibilityLabel ?? label}
            aria-invalid={!!message}
            accessibilityHint={rest.accessibilityHint ?? message}
            value={value}
            onChangeText={onChangeText}
            editable={editable}
            multiline={multiline}
            maxLength={maxLength}
            placeholderTextColor={placeholderTextColor}
            numberOfLines={rest.numberOfLines ?? (multiline ? 4 : 1)}
            textAlignVertical={
              rest.textAlignVertical ?? (multiline ? "top" : "center")
            }
            style={[
              styles.input,
              multiline && styles.multiline,
              { color: theme.text, fontSize: 16 * theme.fontScale },
              style,
            ]}
            onFocus={(event) => {
              setIsFocused(true);
              onFocus?.(event);
            }}
            onBlur={(event) => {
              setIsFocused(false);
              setTouched(true);
              onBlur?.(event);
            }}
          />
          {value.length > 0 && onClear && editable && !rest.readOnly && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Clear ${label}`}
              hitSlop={8}
              onPress={onClear}
              style={({ pressed }) => [styles.clear, pressed && styles.pressed]}
            >
              <Text style={[styles.clearText, { color: theme.textSecondary }]}>
                ✕
              </Text>
            </Pressable>
          )}
        </View>
        {!!message && (
          <Text
            accessibilityRole="alert"
            accessibilityLiveRegion="polite"
            style={styles.error}
          >
            {message}
          </Text>
        )}
        {maxLength !== undefined && (
          <Text style={[styles.counter, { color: theme.textSecondary }]}>
            {value.length}/{maxLength}
          </Text>
        )}
      </View>
    );
  },
);

export default InputField;

const styles = StyleSheet.create({
  container: { marginBottom: 18 },
  label: { fontWeight: "700", letterSpacing: 0.5, marginBottom: spacing.sm },
  wrapper: {
    borderRadius: borderRadius.lg,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
  },
  input: {
    flex: 1,
    minWidth: 0,
    fontWeight: "500",
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    minHeight: 50,
  },
  multiline: { minHeight: 110 },
  clear: { padding: 12, marginRight: 4 },
  clearText: { fontSize: 18 },
  pressed: { opacity: 0.5 },
  error: { color: fieldColors.error, fontSize: 13, marginTop: 6 },
  counter: { fontSize: 11, textAlign: "right", marginTop: 4 },
});
