import { useCallback, useMemo, useState } from "react";
import { formatName, validateDescription, validateName } from "../utils/validation";

const INITIAL = {
  name: "",
  description: "",
  selectedCategory: "",
  selectedMood: "",
  intensity: 3,
  selectedEmoji: "",
  visibility: "private",
};

export default function useAromaForm(existingNames) {
  const [name, setName] = useState(INITIAL.name);
  const [description, setDescription] = useState(INITIAL.description);
  const [selectedCategory, setSelectedCategory] = useState(INITIAL.selectedCategory);
  const [selectedMood, setSelectedMood] = useState(INITIAL.selectedMood);
  const [intensity, setIntensity] = useState(INITIAL.intensity);
  const [selectedEmoji, setSelectedEmoji] = useState(INITIAL.selectedEmoji);
  const [visibility, setVisibility] = useState(INITIAL.visibility);

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

  const buildPayload = useCallback(() => {
    const shortDesc =
      description.trim().length > 100
        ? description.trim().slice(0, 100) + "..."
        : description.trim();

    return {
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
    };
  }, [name, description, selectedCategory, selectedMood, intensity, selectedEmoji, visibility]);

  const reset = useCallback(() => {
    setName(INITIAL.name);
    setDescription(INITIAL.description);
    setSelectedCategory(INITIAL.selectedCategory);
    setSelectedMood(INITIAL.selectedMood);
    setIntensity(INITIAL.intensity);
    setSelectedEmoji(INITIAL.selectedEmoji);
    setVisibility(INITIAL.visibility);
  }, []);

  return {
    fields: {
      name,
      description,
      selectedCategory,
      selectedMood,
      intensity,
      selectedEmoji,
      visibility,
    },
    setters: {
      setName: (v) => { if (v.length <= 24) setName(v); },
      setDescription: (v) => { if (v.length <= 220) setDescription(v); },
      setSelectedCategory: (cat) => {
        setSelectedCategory(cat);
        setSelectedEmoji("");
      },
      setSelectedMood,
      setIntensity,
      setSelectedEmoji,
      setVisibility,
    },
    nameValidation,
    descValidation,
    canSubmit,
    buildPayload,
    reset,
  };
}
