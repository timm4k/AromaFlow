import { useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import CustomButton from "../components/CustomButton";
import EmojiPicker from "../components/EmojiPicker";
import InputField from "../components/InputField";
import IntensitySlider from "../components/IntensitySlider";
import ScreenHeader from "../components/ScreenHeader";

import { addCategories, moods, moodIcons } from "../utils/constants";
import {
  formatName,
  validateDescription,
  validateName,
} from "../utils/validation";
import { spacing } from "../styles/spacing";

export default function AddAromaScreen({
  theme,
  onAdd,
  existingNames,
  enableAnimations,
}) {
  const insets = useSafeAreaInsets();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedMood, setSelectedMood] = useState("");
  const [intensity, setIntensity] = useState(3);
  const [selectedEmoji, setSelectedEmoji] = useState("");
  const [visibility, setVisibility] = useState("private");

  const nameValidation = useMemo(
    () => validateName(name, existingNames),
    [name, existingNames],
  );

  const descValidation = useMemo(
    () => validateDescription(description),
    [description],
  );

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
      visibility,
    });

    setName("");
    setDescription("");
    setSelectedCategory("");
    setSelectedMood("");
    setIntensity(3);
    setSelectedEmoji("");
    setVisibility("private");
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
        <Text style={[styles.sectionLabel, { color: theme.text }]}>
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
                    backgroundColor: active
                      ? theme.accent
                      : theme.accentLight,
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
                      color: active ? theme.white : theme.accent,
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
          <Text style={[styles.hint, { color: theme.textSecondary }]}>
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
        <Text style={[styles.sectionLabel, { color: theme.text }]}>
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
                    backgroundColor: active
                      ? theme.accent
                      : theme.accentLight,
                    borderColor: active ? theme.accent : "transparent",
                  },
                ]}
              >
                <Text style={styles.moodIcon}>{moodIcons[mood]}</Text>

                <Text
                  style={[
                    styles.moodText,
                    {
                      color: active ? theme.white : theme.accent,
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
          <Text style={[styles.hint, { color: theme.textSecondary }]}>
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

      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: theme.text }]}>
          Visibility
        </Text>

        <View style={styles.visibilityRow}>
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => setVisibility("private")}
            style={[
              styles.visibilityPill,
              {
                backgroundColor:
                  visibility === "private"
                    ? theme.accent
                    : theme.accentLight,
                borderColor:
                  visibility === "private" ? theme.accent : "transparent",
              },
            ]}
          >
            <Text style={styles.visibilityIcon}>🔒</Text>

            <Text
              style={[
                styles.visibilityText,
                {
                    color:
                      visibility === "private"
                        ? theme.white
                        : theme.accent,
                  fontWeight: visibility === "private" ? "700" : "600",
                },
              ]}
            >
              Private
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => setVisibility("public")}
            style={[
              styles.visibilityPill,
              {
                backgroundColor:
                  visibility === "public"
                    ? theme.accent
                    : theme.accentLight,
                borderColor:
                  visibility === "public" ? theme.accent : "transparent",
              },
            ]}
          >
            <Text style={styles.visibilityIcon}>🌍</Text>

            <Text
              style={[
                styles.visibilityText,
                {
                  color:
                    visibility === "public" ? theme.white : theme.accent,
                  fontWeight: visibility === "public" ? "700" : "600",
                },
              ]}
            >
              Public
            </Text>
          </TouchableOpacity>
        </View>

        <Text
          style={[
            styles.visibilityHint,
            { color: theme.textSecondary },
          ]}
        >
          {visibility === "public"
            ? "Everyone can see this aroma in Community"
            : "Only you can see this aroma"}
        </Text>
      </View>

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

  visibilityRow: {
    flexDirection: "row",
    gap: 10,
  },

  visibilityPill: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    gap: 8,
  },

  visibilityIcon: {
    fontSize: 18,
  },

  visibilityText: {
    fontSize: 15,
    letterSpacing: 0.2,
  },

  visibilityHint: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: 8,
    textAlign: "center",
    opacity: 0.6,
  },

  buttonContainer: {
    marginTop: 10,
    alignItems: "center",
  },
});
