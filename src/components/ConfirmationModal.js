import { useEffect, useState } from "react";
import {
  Animated,
  Modal,
  StyleSheet,
  Text,
  Pressable,
  ScrollView,
  View,
} from "react-native";

import { shadows } from "../styles/shadows";
import { borderRadius, spacing } from "../styles/spacing";

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
  showCancel = true,
}) {
  const [dialogScale] = useState(() => new Animated.Value(0.9));
  const [dialogOpacity] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      if (!enableAnimations) {
        dialogScale.setValue(1);
        dialogOpacity.setValue(1);
        return;
      }

      const animation = Animated.parallel([
        Animated.spring(dialogScale, {
          toValue: 1,
          friction: 7,
          tension: 80,
          useNativeDriver: true,
        }),
        Animated.timing(dialogOpacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]);
      animation.start();
      return () => animation.stop();
    } else {
      dialogScale.setValue(0.9);
      dialogOpacity.setValue(0);
    }
  }, [visible, enableAnimations, dialogScale, dialogOpacity]);

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
            {
              backgroundColor: theme.card,
              shadowColor: theme.shadow,
              opacity: dialogOpacity,
              transform: [{ scale: dialogScale }],
            },
            shadows.modal,
          ]}
        >
          <Text
            style={[
              styles.title,
              {
                color: theme.text,
                fontSize: 18 * theme.fontScale,
              },
            ]}
          >
            {title}
          </Text>

          {message && (
            <ScrollView style={styles.messageScroll}>
              <Text
                style={[
                  styles.message,
                  {
                    color: theme.textSecondary,
                    fontSize: 14 * theme.fontScale,
                    lineHeight: 20 * theme.fontScale,
                  },
                ]}
              >
                {message}
              </Text>
            </ScrollView>
          )}

          <View style={styles.actions}>
            {showCancel && (
              <Pressable
                accessibilityRole="button"
                onPress={onCancel}
                style={({ pressed }) => [
                  styles.button,
                  styles.cancelButton,
                  { borderColor: theme.border },
                  pressed && styles.pressed,
                ]}
              >
                <Text
                  style={[
                    styles.buttonText,
                    {
                      color: theme.textSecondary,
                      fontSize: 15 * theme.fontScale,
                    },
                  ]}
                >
                  {cancelText}
                </Text>
              </Pressable>
            )}

            <Pressable
              accessibilityRole="button"
              onPress={onConfirm}
              style={({ pressed }) => [
                styles.button,
                {
                  backgroundColor: destructive ? theme.error : theme.accent,
                },
                pressed && styles.pressed,
              ]}
            >
              <Text
                style={[
                  styles.buttonText,
                  styles.confirmText,
                  {
                    color: theme.white,
                    fontSize: 15 * theme.fontScale,
                  },
                ]}
              >
                {confirmText}
              </Text>
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  pressed: { opacity: 0.65 },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },

  dialog: {
    width: "100%",
    maxHeight: "90%",
    maxWidth: 340,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    alignItems: "center",
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: spacing.sm,
  },

  message: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: spacing.lg,
    opacity: 0.7,
  },
  messageScroll: { flexShrink: 1, width: "100%" },

  actions: {
    flexDirection: "row",
    gap: 10,
    width: "100%",
  },

  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: borderRadius.md,
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
    fontWeight: "700",
  },
});
