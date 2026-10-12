import { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { shadows } from "../styles/shadows";
import { borderRadius } from "../styles/spacing";
import ModalAromaContent from "./aroma/ModalAromaContent";
import ModalCustomInfo from "./aroma/ModalCustomInfo";

export default function AromaModal({
  visible,
  aroma,
  onClose,
  theme,
  enableAnimations,
  currentUser,
}) {
  const router = useRouter();

  const [overlayOpacity] = useState(() => new Animated.Value(0));
  const [sheetTranslate] = useState(() => new Animated.Value(300));
  const [sheetScale] = useState(() => new Animated.Value(0.95));
  const closing = useRef(false);

  useEffect(() => {
    if (visible) {
      closing.current = false;
      const dur = enableAnimations ? 300 : 0;
      const animation = Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: dur,
          useNativeDriver: true,
        }),
        Animated.timing(sheetTranslate, {
          toValue: 0,
          duration: dur,
          useNativeDriver: true,
        }),
        Animated.spring(sheetScale, {
          toValue: 1,
          friction: 8,
          useNativeDriver: true,
        }),
      ]);
      animation.start();
      return () => animation.stop();
    } else if (!closing.current) {
      overlayOpacity.setValue(0);
      sheetTranslate.setValue(300);
      sheetScale.setValue(0.95);
    }
  }, [visible, enableAnimations, overlayOpacity, sheetTranslate, sheetScale]);

  const handleClose = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    const dur = enableAnimations ? 200 : 0;
    Animated.parallel([
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: dur,
        useNativeDriver: true,
      }),
      Animated.timing(sheetTranslate, {
        toValue: 300,
        duration: dur,
        useNativeDriver: true,
      }),
      Animated.timing(sheetScale, {
        toValue: 0.95,
        duration: dur,
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) onClose();
    });
  }, [enableAnimations, overlayOpacity, sheetTranslate, sheetScale, onClose]);

  if (!aroma) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <Animated.View
        style={[
          styles.overlay,
          { backgroundColor: theme.overlay, opacity: overlayOpacity },
        ]}
      >
        <Animated.View
          style={[
            styles.sheet,
            {
              backgroundColor: theme.card,
              shadowColor: theme.shadow,
              transform: [
                { translateY: sheetTranslate },
                { scale: sheetScale },
              ],
            },
            shadows.modal,
          ]}
        >
          <TouchableOpacity
            onPress={handleClose}
            activeOpacity={0.7}
            style={styles.closeButton}
          >
            <Text style={[styles.closeText, { color: theme.textSecondary }]}>
              ✕
            </Text>
          </TouchableOpacity>

          <ScrollView showsVerticalScrollIndicator={false}>
            <ModalAromaContent aroma={aroma} theme={theme} />

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => {
                handleClose();
                router.push({
                  pathname: "/aroma/[id]",
                  params: { id: aroma.id },
                });
              }}
              style={[styles.viewDetailsBtn, { backgroundColor: theme.accent }]}
            >
              <Text style={styles.viewDetailsText}>View Details</Text>
            </TouchableOpacity>

            <ModalCustomInfo
              aroma={aroma}
              currentUser={currentUser}
              theme={theme}
            />
          </ScrollView>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: "flex-end" },
  sheet: {
    maxHeight: "85%",
    paddingTop: 20,
    paddingBottom: 36,
    paddingHorizontal: 24,
    borderTopLeftRadius: borderRadius.xxl,
    borderTopRightRadius: borderRadius.xxl,
  },
  closeButton: {
    alignSelf: "flex-end",
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },
  closeText: { fontWeight: "700" },
  viewDetailsBtn: {
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  viewDetailsText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});
