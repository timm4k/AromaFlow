import { useCallback } from "react";
import { Alert, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import CustomButton from "../components/CustomButton";
import EmojiPicker from "../components/EmojiPicker";
import InputField from "../components/InputField";
import IntensitySlider from "../components/IntensitySlider";
import ScreenHeader from "../components/ScreenHeader";
import CategorySelector from "../components/aroma/CategorySelector";
import MoodSelector from "../components/aroma/MoodSelector";
import VisibilitySelector from "../components/aroma/VisibilitySelector";

import { validateDescription, validateName } from "../utils/validation";
import useAromaForm from "../hooks/useAromaForm";
import { styles } from "../styles/screens/addAromaStyles";

export default function AddAromaScreen({
  theme,
  onAdd,
  existingNames,
  enableAnimations,
}) {
  const insets = useSafeAreaInsets();

  const validateAromaName = useCallback(
    (v) => validateName(v, existingNames),
    [existingNames],
  );

  const {
    fields,
    setters,
    canSubmit,
    reset,
    buildPayload,
  } = useAromaForm(existingNames);

  async function handleAdd() {
    if (!canSubmit) return;

    try {
      await onAdd(buildPayload());
      reset();
    } catch (e) {
      Alert.alert("Error", "Failed to save aroma. Please try again.");
    }
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.bg }]}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 12 },
      ]}
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
        maxLength={24}
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
        maxLength={220}
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
          title="Add Aroma"
          onPress={handleAdd}
          theme={theme}
          disabled={!canSubmit}
          enableAnimations={enableAnimations}
        />
      </View>
    </ScrollView>
  );
}
