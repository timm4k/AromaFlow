import AsyncStorage from "@react-native-async-storage/async-storage";

const SETTINGS_KEY = "@aromaflow/settings";

export async function loadSettings() {
  try {
    const raw = await AsyncStorage.getItem(SETTINGS_KEY);

    if (!raw) return null;

    return JSON.parse(raw);
  } catch (e) {
    console.warn("Failed to load settings", e);

    return null;
  }
}

export async function saveSettings(settings) {
  try {
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.warn("Failed to save settings", e);
  }
}
