import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { styles } from "../../styles/screens/loginStyles";

export default function AuthInput({
  label,
  icon,
  value,
  onChangeText,
  placeholder,
  error,
  theme,
  editable = true,
  secureTextEntry = false,
  autoCapitalize = "none",
  autoCorrect = false,
  keyboardType = "default",
}) {
  return (
    <View style={styles.inputGroup}>
      <Text style={[styles.label, { color: theme.text }]}>{label}</Text>

      <View
        style={[
          styles.inputWrapper,
          {
            backgroundColor: theme.bg,
            borderColor: error ? theme.error : theme.border,
          },
        ]}
      >
        <Text style={styles.inputIcon}>{icon}</Text>

        <TextInput
          style={[styles.input, { color: theme.text }]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.textSecondary + "99"}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          editable={editable}
        />

        {value.length > 0 && (
          <TouchableOpacity onPress={() => onChangeText("")} style={styles.clearBtn} disabled={!editable}>
            <Text style={{ color: theme.textSecondary, fontSize: 16 }}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
