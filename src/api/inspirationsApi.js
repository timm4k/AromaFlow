import { inspirations } from "../data/inspirations";

export async function fetchInspirations() {
  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=1");

    if (!res.ok) {
      return inspirations;
    }

    await res.json();
  } catch {
  }

  return inspirations;
}

export function getInspirationById(id) {
  return inspirations.find((i) => i.id === id) || null;
}
