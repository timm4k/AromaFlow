import { useEffect, useRef } from "react";
import { Animated, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ConfirmationModal({
  visible,
  title,
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  theme,
  destructive = true,
  enableAnimations,
}) {
  const dialogScale = useRef(new Animated.Value(0.9)).current;
  const dialogOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      const dur = enableAnimations ? 250 : 0;
      Animated.parallel([
        Animated.spring(dialogScale, {
          toValue: 1,
          friction: 7,
          tension: 80,
          useNativeDriver: true,
        }),
        Animated.timing(dialogOpacity, {
          toValue: 1,
          duration: dur,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      dialogScale.setValue(0.9);
      dialogOpacity.setValue(0);
    }
  }, [visible, enableAnimations]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType={enableAnimations ? "fade" : "none"}
      onRequestClose={onCancel}
    >
      <View style={[styles.overlay, { backgroundColor: theme.overlay }]}>
        <Animated.View
          style={[
            styles.dialog,
            { backgroundColor: theme.card, opacity: dialogOpacity, transform: [{ scale: dialogScale }] },
          ]}
        >
          <Text style={[styles.title, { color: theme.text, fontSize: 18 * theme.fontScale }]}>
            {title}
          </Text>

          {message && (
            <Text
              style={[styles.message, { color: theme.textSecondary, fontSize: 14 * theme.fontScale, lineHeight: 20 * theme.fontScale }]}
            >
              {message}
            </Text>
          )}

          <View style={styles.actions}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onCancel}
              style={[
                styles.button,
                styles.cancelButton,
                { borderColor: theme.border },
              ]}
            >
              <Text
                style={[
                  styles.buttonText,
                  { color: theme.textSecondary, fontSize: 15 * theme.fontScale },
                ]}
              >
                {cancelText}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onConfirm}
              style={[
                styles.button,
                {
                  backgroundColor: destructive ? "#E85D75" : theme.accent,
                },
              ]}
            >
              <Text style={[styles.buttonText, styles.confirmText, { fontSize: 15 * theme.fontScale }]}>
                {confirmText}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },

  dialog: {
    width: "100%",
    maxWidth: 340,
    borderRadius: 24,
    padding: 24,
    alignItems: "center",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },

  message: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
    opacity: 0.7,
  },

  actions: {
    flexDirection: "row",
    gap: 10,
    width: "100%",
  },

  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  cancelButton: {
    borderWidth: 1.5,
  },

  buttonText: {
    fontSize: 15,
    fontWeight: "600",
  },

  confirmText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});
