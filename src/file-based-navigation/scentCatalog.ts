import { aromas } from "../data/aromas";

export interface Scent {
  id: string;
  title: string;
  category: string;
  origin: string;
  shortDescription: string;
  fullDescription: string;
  intensity: number;
  emoji: string;
  recommendedUsage: string;
  mood: string;
  interestingFact: string;
  predominance: string;
  photoSearch: string;
  rating: number;
}

const photoSubjects: Record<string, string> = {
  Rose: "Rosa damascena",
  Lavender: "Lavandula angustifolia",
  Vanilla: "Vanilla planifolia",
  Cinnamon: "Cinnamon sticks",
  Lemon: "Lemon fruit",
  Jasmine: "Jasminum officinale",
  Sandalwood: "Santalum album",
  Peppermint: "Mentha piperita",
  Orange: "Orange fruit",
  Cedarwood: "Cedrus wood",
  Bergamot: "Bergamot fruit",
  "Ylang-Ylang": "Cananga odorata",
  Patchouli: "Pogostemon cablin",
  Eucalyptus: "Eucalyptus globulus",
  Grapefruit: "Grapefruit fruit",
  Frankincense: "Frankincense resin",
  Geranium: "Pelargonium graveolens",
  "Black Pepper": "Black peppercorns",
  Chamomile: "Matricaria chamomilla",
  Myrrh: "Myrrh resin",
  Clove: "Cloves spice",
  Neroli: "Citrus aurantium flowers",
  "Cedar Leaf": "Thuja occidentalis",
  Pine: "Pinus sylvestris",
  Tuberose: "Polianthes tuberosa",
  Lemongrass: "Cymbopogon citratus",
  Coriander: "Coriander seeds",
  Petitgrain: "Citrus aurantium leaves",
  Cypress: "Cupressus sempervirens",
  Cardamom: "Cardamom pods",
};

const sampleRatings: Record<string, number> = {
  Floral: 4.8,
  Herbal: 4.7,
  Citrus: 4.6,
  Oriental: 4.9,
  Woody: 4.8,
  Spicy: 4.5,
};

export const scentCatalog: Scent[] = aromas.map((aroma) => ({
  ...aroma,
  photoSearch: photoSubjects[aroma.title] ?? aroma.title,
  rating: sampleRatings[aroma.category],
}));

export function getScentById(id: string): Scent | undefined {
  return scentCatalog.find(
    (scent) =>
      scent.id === id || scent.title.toLowerCase().replace(/\s+/g, "-") === id,
  );
}

const familyPhotoSubjects: Record<string, string> = {
  Floral: "Rose flowers",
  Herbal: "Lavandula angustifolia",
  Citrus: "Lemon fruit",
  Oriental: "Vanilla pods",
  Woody: "Cedar wood",
  Spicy: "Cinnamon sticks",
};

interface PhotoSubjectInput {
  title?: string;
  category?: string;
  shortDescription?: string;
  fullDescription?: string;
  photoSearch?: string;
}

const photoIngredients = [...scentCatalog].sort(
  (a, b) => b.title.length - a.title.length,
);

export function getPhotoSubject(aroma: PhotoSubjectInput): string {
  if (aroma.photoSearch) return aroma.photoSearch;
  const normalize = (text: string) =>
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
  for (const text of [
    aroma.title,
    aroma.shortDescription,
    aroma.fullDescription,
  ]) {
    if (!text) continue;
    const words = ` ${normalize(text)} `;
    const ingredient = photoIngredients.find((scent) =>
      words.includes(` ${normalize(scent.title)} `),
    );
    if (ingredient) return ingredient.photoSearch;
  }
  return (
    aroma.title?.trim() ||
    familyPhotoSubjects[aroma.category ?? ""] ||
    "Perfume flowers"
  );
}
