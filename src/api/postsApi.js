const BASE_URL = "https://jsonplaceholder.typicode.com";

const aromaInspirations = [
  "The Art of Layering Fragrances",
  "How to Choose Your Signature Scent",
  "Morning Rituals: Aromatherapy for Your Day",
  "Evening Winds: Calming Scents for Sleep",
  "The Psychology of Smell and Memory",
  "Natural vs Synthetic: Understanding Notes",
  "Seasonal Scents: What to Wear and When",
  "Building a Capsule Fragrance Wardrobe",
  "The History of Perfumery",
  "Citrus & Sunshine: Uplifting Aromas",
  "Woody Notes: Grounding Your Spirit",
  "Floral Fantasies: Romance in a Bottle",
  "Gourmand Scents: When Food Meets Fragrance",
  "Fresh & Clean: The Appeal of Minimalist Scents",
  "Spicy & Warm: Evening Elegance",
];

const aromaEmojis = [
  "🌸", "🌿", "🍊", "🌙", "🧠", "🔬", "❄️", "👗",
  "📜", "☀️", "🌲", "💐", "🍰", "🧼", "🌶️",
];

export async function fetchPosts() {
  const res = await fetch(`${BASE_URL}/posts`);

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  const data = await res.json();

  return data.slice(0, 15).map((item, index) => ({
    id: item.id,
    title: aromaInspirations[index] || `Aroma Inspiration #${item.id}`,
    body: item.body,
    emoji: aromaEmojis[index] || "✨",
  }));
}
