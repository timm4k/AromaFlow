import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { borderRadius, spacing } from "../../styles/spacing";

export default function ConfirmModal({ visible, title, message, confirmText, cancelText, onConfirm, onCancel }) {
  const { theme } = useTheme();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          {title && <Text style={[styles.title, { color: theme.text }]}>{title}</Text>}

          {message && <Text style={[styles.message, { color: theme.textSecondary }]}>{message}</Text>}

          <View style={styles.actions}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onCancel}
              style={[styles.btn, styles.cancelBtn, { borderColor: theme.border }]}
            >
              <Text style={[styles.btnText, { color: theme.textSecondary }]}>
                {cancelText || "Cancel"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={onConfirm}
              style={[styles.btn, styles.confirmBtn, { backgroundColor: theme.accent }]}
            >
              <Text style={[styles.btnText, { color: theme.white }]}>
                {confirmText || "Confirm"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  card: {
    width: "100%",
    maxWidth: 340,
    borderRadius: borderRadius.xxl,
    padding: spacing.lg,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: spacing.sm,
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500",
    opacity: 0.7,
    marginBottom: spacing.lg,
  },
  actions: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  btn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelBtn: {
    borderWidth: 1.5,
  },
  confirmBtn: {},
  btnText: {
    fontSize: 15,
    fontWeight: "700",
  },
});
