import { useCallback, useEffect, useRef } from "react";
import {
  Animated, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { shadows } from "../styles/shadows";
import { borderRadius } from "../styles/spacing";
import ModalAromaContent from "./aroma/ModalAromaContent";
import ModalCustomInfo from "./aroma/ModalCustomInfo";

export default function AromaModal({
  visible, aroma, onClose, theme, enableAnimations, currentUser,
}) {
  const navigation = useNavigation();
  if (!aroma) return null;

  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const sheetTranslate = useRef(new Animated.Value(300)).current;
  const sheetScale = useRef(new Animated.Value(0.95)).current;
  const closing = useRef(false);

  useEffect(() => {
    if (visible) {
      closing.current = false;
      const dur = enableAnimations ? 300 : 0;
      Animated.parallel([
        Animated.timing(overlayOpacity, { toValue: 1, duration: dur, useNativeDriver: true }),
        Animated.timing(sheetTranslate, { toValue: 0, duration: dur, useNativeDriver: true }),
        Animated.spring(sheetScale, { toValue: 1, friction: 8, useNativeDriver: true }),
      ]).start();
    } else if (!closing.current) {
      overlayOpacity.setValue(0);
      sheetTranslate.setValue(300);
      sheetScale.setValue(0.95);
    }
  }, [visible, enableAnimations]);

  const handleClose = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    const dur = enableAnimations ? 200 : 0;
    Animated.parallel([
      Animated.timing(overlayOpacity, { toValue: 0, duration: dur, useNativeDriver: true }),
      Animated.timing(sheetTranslate, { toValue: 300, duration: dur, useNativeDriver: true }),
      Animated.timing(sheetScale, { toValue: 0.95, duration: dur, useNativeDriver: true }),
    ]).start(() => {
      onClose();
    });
  }, [enableAnimations, overlayOpacity, sheetTranslate, sheetScale, onClose]);

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={handleClose}>
      <Animated.View style={[styles.overlay, { backgroundColor: theme.overlay, opacity: overlayOpacity }]}>
        <Animated.View
          style={[styles.sheet, { backgroundColor: theme.card, shadowColor: theme.shadow, transform: [{ translateY: sheetTranslate }, { scale: sheetScale }] }, shadows.modal]}
        >
          <TouchableOpacity onPress={handleClose} activeOpacity={0.7} style={styles.closeButton}>
            <Text style={[styles.closeText, { color: theme.textSecondary }]}>✕</Text>
          </TouchableOpacity>

          <ScrollView showsVerticalScrollIndicator={false}>
            <ModalAromaContent aroma={aroma} theme={theme} />

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => {
                handleClose();
                navigation.navigate("AromaDetails", { aromaId: aroma.id });
              }}
              style={[styles.viewDetailsBtn, { backgroundColor: theme.accent }]}
            >
              <Text style={styles.viewDetailsText}>View Details</Text>
            </TouchableOpacity>

            <ModalCustomInfo aroma={aroma} currentUser={currentUser} theme={theme} />
          </ScrollView>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: "flex-end" },
  sheet: {
    maxHeight: "85%", paddingTop: 20, paddingBottom: 36, paddingHorizontal: 24,
    borderTopLeftRadius: borderRadius.xxl, borderTopRightRadius: borderRadius.xxl,
  },
  closeButton: {
    alignSelf: "flex-end", width: 36, height: 36,
    justifyContent: "center", alignItems: "center", marginBottom: 6,
  },
  closeText: { fontWeight: "700" },
  viewDetailsBtn: {
    paddingVertical: 12, borderRadius: 16,
    alignItems: "center", justifyContent: "center", marginTop: 16,
  },
  viewDetailsText: { color: "#FFFFFF", fontSize: 15, fontWeight: "700", letterSpacing: 0.3 },
});
