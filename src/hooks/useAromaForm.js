import { useCallback, useMemo, useState } from "react";
import {
  aromaLimits,
  formatName,
  validateDescription,
  validateName,
} from "../utils/validation";

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
  const [selectedCategory, setSelectedCategory] = useState(
    INITIAL.selectedCategory,
  );
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
    const fullDescription = description.trim();
    const shortDesc =
      fullDescription.length > aromaLimits.preview
        ? fullDescription.slice(0, aromaLimits.preview) + "..."
        : fullDescription;

    return {
      title: formatName(name),
      category: selectedCategory,
      intensity,
      emoji: selectedEmoji,
      shortDescription: shortDesc,
      fullDescription,
      origin: "Custom creation",
      recommendedUsage: `Best for ${selectedMood.toLowerCase()} moments`,
      mood: selectedMood,
      visibility,
      interestingFact: "",
      predominance: "",
    };
  }, [
    name,
    description,
    selectedCategory,
    selectedMood,
    intensity,
    selectedEmoji,
    visibility,
  ]);

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
      setName: (v) => {
        if (v.length <= aromaLimits.name) setName(v);
      },
      setDescription: (v) => {
        if (v.length <= aromaLimits.description) setDescription(v);
      },
      setSelectedCategory: (cat) => {
        setSelectedCategory(cat);
        setSelectedEmoji("");
      },
      setSelectedMood,
      setIntensity,
      setSelectedEmoji,
      setVisibility,
    },
    canSubmit,
    buildPayload,
    reset,
  };
}
