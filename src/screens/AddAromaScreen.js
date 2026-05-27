import { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import CustomButton from "../components/CustomButton";
import EmojiPicker from "../components/EmojiPicker";
import InputField from "../components/InputField";
import IntensitySlider from "../components/IntensitySlider";

import { addCategories, moods, moodIcons } from "../utils/constants";
import { formatName, validateDescription, validateName } from "../utils/validation";

export default function AddAromaScreen({ theme, onAdd, existingNames, enableAnimations }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedMood, setSelectedMood] = useState("");
  const [intensity, setIntensity] = useState(3);
  const [selectedEmoji, setSelectedEmoji] = useState("");

  const nameValidation = useMemo(() => validateName(name, existingNames), [name, existingNames]);
  const descValidation = useMemo(() => validateDescription(description), [description]);

  const canSubmit =
    nameValidation.valid &&
    descValidation.valid &&
    selectedCategory !== "" &&
    selectedMood !== "" &&
    intensity > 0 &&
    selectedEmoji !== "";

  function handleAdd() {
    if (!canSubmit) return;

    const shortDesc =
      description.trim().length > 100
        ? description.trim().slice(0, 100) + "..."
        : description.trim();

    onAdd({
      title: formatName(name),
      category: selectedCategory,
      intensity,
      emoji: selectedEmoji,
      shortDescription: shortDesc,
      fullDescription: description.trim(),
      origin: "Custom creation",
      recommendedUsage: `Best for ${selectedMood.toLowerCase()} moments`,
      mood: selectedMood,
    });

    setName("");
    setDescription("");
    setSelectedCategory("");
    setSelectedMood("");
    setIntensity(3);
    setSelectedEmoji("");
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.bg }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={[styles.screenTitle, { color: theme.text, fontSize: 28 * theme.fontScale }]}>
        New Aroma Note
      </Text>

      <Text style={[styles.screenSubtitle, { color: theme.textSecondary, fontSize: 14 * theme.fontScale }]}>
        Create your own signature scent
      </Text>

      <InputField
        label="Aroma Name"
        value={name}
        onChangeText={(text) => {
          if (text.length <= 24) setName(text);
        }}
        placeholder="e.g. Ocean Breeze"
        theme={theme}
        maxLength={24}
        validation={(v) => validateName(v, existingNames)}
        autoCapitalize="words"
      />

      <InputField
        label="Description"
        value={description}
        onChangeText={(text) => {
          if (text.length <= 220) setDescription(text);
        }}
        placeholder="Describe the aroma, its character, and feeling..."
        theme={theme}
        multiline
        maxLength={220}
        validation={validateDescription}
      />

      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: theme.text, fontSize: 13 * theme.fontScale }]}>
          Category
        </Text>

        <View style={styles.pillsRow}>
          {addCategories.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                activeOpacity={0.75}
                onPress={() => {
                  setSelectedCategory(cat);
                  setSelectedEmoji("");
                }}
                style={[
                  styles.pill,
                  {
                    backgroundColor: active ? theme.accent : theme.accentLight,
                    borderColor: active ? theme.accent : "transparent",
                    shadowColor: active ? theme.accent : "transparent",
                    shadowOpacity: active ? 0.3 : 0,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.pillText,
                    {
                      color: active ? "#FFFFFF" : theme.accent,
                      fontWeight: active ? "700" : "600",
                      fontSize: 13 * theme.fontScale,
                    },
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

          {!selectedCategory && (
          <Text style={[styles.hint, { color: theme.textSecondary, fontSize: 12 * theme.fontScale }]}>
            Please select a category
          </Text>
        )}
      </View>

      <EmojiPicker
        selectedCategory={selectedCategory}
        selectedEmoji={selectedEmoji}
        onSelectEmoji={setSelectedEmoji}
        theme={theme}
        enableAnimations={enableAnimations}
      />

      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: theme.text, fontSize: 13 * theme.fontScale }]}>
          Mood
        </Text>

        <View style={styles.moodGrid}>
          {moods.map((mood) => {
            const active = selectedMood === mood;
            return (
              <TouchableOpacity
                key={mood}
                activeOpacity={0.75}
                onPress={() => setSelectedMood(mood)}
                style={[
                  styles.moodPill,
                  {
                    backgroundColor: active ? theme.accent : theme.accentLight,
                    borderColor: active ? theme.accent : "transparent",
                  },
                ]}
              >
                <Text style={styles.moodIcon}>{moodIcons[mood]}</Text>
                <Text
                  style={[
                    styles.moodText,
                    {
                      color: active ? "#FFFFFF" : theme.accent,
                      fontWeight: active ? "700" : "600",
                      fontSize: 13 * theme.fontScale,
                    },
                  ]}
                >
                  {mood}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

          {!selectedMood && (
          <Text style={[styles.hint, { color: theme.textSecondary, fontSize: 12 * theme.fontScale }]}>
            Please select a mood
          </Text>
        )}
      </View>

      <IntensitySlider
        value={intensity}
        onChange={setIntensity}
        theme={theme}
        enableAnimations={enableAnimations}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    padding: 20,
    paddingBottom: 120,
  },

  screenTitle: {
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: -0.5,
    marginBottom: 4,
  },

  screenSubtitle: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 24,
    opacity: 0.7,
  },

  section: {
    marginBottom: 18,
  },

  sectionLabel: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 10,
  },

  pillsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  pill: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1.5,

    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },

  pillText: {
    fontSize: 13,
    letterSpacing: 0.2,
  },

  moodGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  moodPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1.5,
    gap: 6,
  },

  moodIcon: {
    fontSize: 16,
  },

  moodText: {
    fontSize: 13,
    letterSpacing: 0.2,
  },

  hint: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: 6,
    marginLeft: 4,
    opacity: 0.6,
  },

  buttonContainer: {
    marginTop: 10,
    alignItems: "center",
  },
});
