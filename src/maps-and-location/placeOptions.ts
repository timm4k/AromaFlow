export const placeExamples = [
  { title: "Perfume shop", icon: "🛍️" },
  { title: "Botanical garden", icon: "🌿" },
  { title: "Perfume workshop", icon: "🧪" },
  { title: "A new scent discovery", icon: "✨" },
] as const;

export const placeIcons = [
  "📍",
  ...placeExamples.map(({ icon }) => icon),
  "🌸",
  "☕",
];
export const placeTitleLimit = 80;
export const defaultPlaceTitle = "My scent place";
