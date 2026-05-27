import AsyncStorage from "@react-native-async-storage/async-storage";

const SESSION_KEY = "@aromaflow/session";

export async function getSession() {
  try {
    const raw = await AsyncStorage.getItem(SESSION_KEY);

    if (!raw) return null;

    return JSON.parse(raw);
  } catch (e) {
    console.warn("Failed to read session", e);

    return null;
  }
}

export async function saveSession(user) {
  try {
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } catch (e) {
    console.warn("Failed to save session", e);
  }
}

export async function removeSession() {
  try {
    await AsyncStorage.removeItem(SESSION_KEY);
  } catch (e) {
    console.warn("Failed to remove session", e);
  }
}
