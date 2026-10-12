import { useCallback, useRef, useState } from "react";
import { Alert, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import CustomButton from "../components/CustomButton";
import EmojiPicker from "../components/EmojiPicker";
import IntensitySlider from "../components/IntensitySlider";
import ScreenHeader from "../components/ScreenHeader";
import CategorySelector from "../components/aroma/CategorySelector";
import MoodSelector from "../components/aroma/MoodSelector";
import VisibilitySelector from "../components/aroma/VisibilitySelector";
import InputField from "../form-elements-and-validation/InputField";

import useAromaForm from "../hooks/useAromaForm";
import { styles } from "../styles/screens/addAromaStyles";
import {
  aromaLimits,
  validateDescription,
  validateName,
} from "../utils/validation";

export default function AddAromaScreen({
  theme,
  onAdd,
  existingNames,
  enableAnimations,
}) {
  const insets = useSafeAreaInsets();
  const pendingSave = useRef(false);
  const [isSaving, setIsSaving] = useState(false);

  const validateAromaName = useCallback(
    (v) => validateName(v, existingNames),
    [existingNames],
  );

  const { fields, setters, canSubmit, reset, buildPayload } =
    useAromaForm(existingNames);

  async function handleAdd() {
    if (!canSubmit || pendingSave.current) return;
    pendingSave.current = true;
    setIsSaving(true);

    try {
      await onAdd(buildPayload());
      reset();
    } catch {
      Alert.alert("Error", "Failed to save aroma. Please try again.");
    } finally {
      pendingSave.current = false;
      setIsSaving(false);
    }
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.bg }]}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 12 }]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <ScreenHeader
        title="New Aroma Note"
        subtitle="Create your own signature scent"
        theme={theme}
      />

      <InputField
        label="Aroma Name"
        value={fields.name}
        onChangeText={setters.setName}
        placeholder="e.g. Ocean Breeze"
        theme={theme}
        maxLength={aromaLimits.name}
        validation={validateAromaName}
        autoCapitalize="words"
      />

      <InputField
        label="Description"
        value={fields.description}
        onChangeText={setters.setDescription}
        placeholder="Describe the aroma, its character, and feeling..."
        theme={theme}
        multiline
        maxLength={aromaLimits.description}
        validation={validateDescription}
      />

      <CategorySelector
        selectedCategory={fields.selectedCategory}
        onSelect={setters.setSelectedCategory}
        theme={theme}
      />

      <EmojiPicker
        selectedCategory={fields.selectedCategory}
        selectedEmoji={fields.selectedEmoji}
        onSelectEmoji={setters.setSelectedEmoji}
        theme={theme}
        enableAnimations={enableAnimations}
      />

      <MoodSelector
        selectedMood={fields.selectedMood}
        onSelect={setters.setSelectedMood}
        theme={theme}
      />

      <IntensitySlider
        value={fields.intensity}
        onChange={setters.setIntensity}
        theme={theme}
        enableAnimations={enableAnimations}
      />

      <VisibilitySelector
        visibility={fields.visibility}
        onSelect={setters.setVisibility}
        theme={theme}
      />

      <View style={styles.buttonContainer}>
        <CustomButton
          title={isSaving ? "Saving aroma…" : "Add Aroma"}
          onPress={handleAdd}
          theme={theme}
          disabled={!canSubmit || isSaving}
          enableAnimations={enableAnimations}
        />
      </View>
    </ScrollView>
  );
}
