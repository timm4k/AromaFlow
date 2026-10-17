import AsyncStorage from "@react-native-async-storage/async-storage";
import { z } from "zod";
import { placeIcons, placeTitleLimit } from "../placeOptions";
import type { PlacePin } from "../types/map";

const savedPlacesSchema = z.array(
  z.object({
    id: z.string().min(1),
    title: z.string().trim().min(1).max(placeTitleLimit),
    coordinate: z.object({
      latitude: z.number().min(-90).max(90),
      longitude: z.number().min(-180).max(180),
    }),
    createdAt: z.string(),
    icon: z.string().refine((icon) => placeIcons.includes(icon)),
    saved: z.literal(true),
  }),
);

function storageKey(profileId: string) {
  return `aromaflow:scent-places:${encodeURIComponent(profileId)}`;
}

export async function loadSavedPlaces(profileId: string): Promise<PlacePin[]> {
  const value = await AsyncStorage.getItem(storageKey(profileId));
  return value ? savedPlacesSchema.parse(JSON.parse(value)) : [];
}

export async function storeSavedPlaces(profileId: string, pins: PlacePin[]) {
  const saved = savedPlacesSchema.parse(pins.filter((pin) => pin.saved));
  await AsyncStorage.setItem(storageKey(profileId), JSON.stringify(saved));
}
