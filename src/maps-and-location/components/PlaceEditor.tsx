import { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  Pressable,
  View,
} from "react-native";
import { useTheme } from "../../hooks/useTheme";
import { placeExamples, placeIcons, placeTitleLimit } from "../placeOptions";
import { styles } from "../styles";
import type { PlacePin } from "../types/map";
import { MapAction } from "./MapNotice";

interface PlaceEditorProps {
  pin: PlacePin;
  busy: boolean;
  error: string | null;
  onConfirm: (pin: PlacePin) => void;
  onRemove: () => void;
  onClose: () => void;
}

export function PlaceEditor({
  pin,
  busy,
  error,
  onConfirm,
  onRemove,
  onClose,
}: PlaceEditorProps) {
  const { theme } = useTheme();
  const [title, setTitle] = useState(pin.title);
  const [icon, setIcon] = useState(pin.icon);
  const confirm = (saved: boolean) =>
    onConfirm({ ...pin, title: title.trim(), icon, saved });

  return (
    <Modal
      transparent
      animationType="slide"
      onRequestClose={busy ? undefined : onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={[styles.editorBackdrop, { backgroundColor: theme.overlay }]}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          style={[styles.editor, { backgroundColor: theme.card }]}
          contentContainerStyle={styles.editorContent}
        >
          <Text style={[styles.heading, { color: theme.text }]}>
            Your scent place
          </Text>
          <Text style={[styles.message, { color: theme.textSecondary }]}>
            Choose an example or write where you discovered a scent
          </Text>
          <View style={styles.options}>
            {placeExamples.map((example) => (
              <MapAction
                key={example.title}
                title={`${example.icon} ${example.title}`}
                disabled={busy}
                onPress={() => {
                  setTitle(example.title);
                  setIcon(example.icon);
                }}
              />
            ))}
          </View>
          <Text style={[styles.actionText, { color: theme.text }]}>
            Place name
          </Text>
          <TextInput
            accessibilityLabel="Place name"
            value={title}
            onChangeText={setTitle}
            maxLength={placeTitleLimit}
            editable={!busy}
            placeholder="For example, Rose Garden or my favourite perfume shop"
            placeholderTextColor={theme.textSecondary}
            style={[
              styles.placeInput,
              { color: theme.text, borderColor: theme.border },
            ]}
          />
          <Text style={[styles.actionText, { color: theme.text }]}>
            Choose an icon
          </Text>
          <View style={styles.options}>
            {placeIcons.map((option) => (
              <Pressable
                key={option}
                accessibilityRole="radio"
                accessibilityLabel={`Place icon ${option}`}
                accessibilityState={{
                  checked: icon === option,
                  disabled: busy,
                }}
                disabled={busy}
                onPress={() => setIcon(option)}
                style={({ pressed }) => [
                  styles.iconOption,
                  {
                    borderColor: icon === option ? theme.accent : theme.border,
                  },
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.locationIcon}>{option}</Text>
              </Pressable>
            ))}
          </View>
          <Text style={[styles.caption, { color: theme.textSecondary }]}>
            Keep temporary: disappears when you leave this screen
            {"\n"}Save for myself: stays on this device for your account,
            including after restarting
          </Text>
          {error && (
            <Text
              accessibilityRole="alert"
              style={[styles.caption, { color: theme.error }]}
            >
              {error}
            </Text>
          )}
          <MapAction
            title={busy ? "Saving…" : "Save for myself"}
            onPress={() => confirm(true)}
            disabled={busy || !title.trim()}
          />
          <MapAction
            title="Keep temporary"
            onPress={() => confirm(false)}
            disabled={busy || !title.trim()}
          />
          <MapAction title="Delete place" onPress={onRemove} disabled={busy} />
          <MapAction title="Close" onPress={onClose} disabled={busy} />
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}
