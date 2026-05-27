import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_CUSTOM = "@aromaflow/customAromas";

function favoritesKey(userId) {
  return `@aromaflow/favorites_${userId}`;
}

export async function loadCustomAromas() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_CUSTOM);

    if (!raw) return [];

    return JSON.parse(raw);
  } catch (e) {
    console.warn("Failed to load custom aromas", e);

    return [];
  }
}

export async function saveCustomAromas(aromas) {
  try {
    await AsyncStorage.setItem(STORAGE_CUSTOM, JSON.stringify(aromas));
  } catch (e) {
    console.warn("Failed to save custom aromas", e);
  }
}

export async function loadFavorites(userId) {
  if (!userId) return [];

  try {
    const raw = await AsyncStorage.getItem(favoritesKey(userId));

    if (!raw) return [];

    return JSON.parse(raw);
  } catch (e) {
    console.warn("Failed to load favorites", e);

    return [];
  }
}

export async function saveFavorites(userId, ids) {
  if (!userId) return;

  try {
    await AsyncStorage.setItem(favoritesKey(userId), JSON.stringify(ids));
  } catch (e) {
    console.warn("Failed to save favorites", e);
  }
}
