import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Share } from "react-native";
import { getScentById } from "../file-based-navigation/scentCatalog";
import { getAromaById } from "../firebase/aromaService";
import { createCalendarReminder } from "../services/calendarService";

export default function useAromaDetails(aromaId, currentUser) {
  const [aroma, setAroma] = useState(null);
  const [loadedId, setLoadedId] = useState(null);
  const loading = loadedId !== aromaId;

  const isOwner = aroma && currentUser && aroma.ownerId === currentUser.uid;

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        if (!aromaId) {
          if (active) setAroma(null);
          return;
        }
        const local = getScentById(aromaId);

        const data = local || (await getAromaById(aromaId));
        if (active) setAroma(data);
      } catch {
        if (active) {
          setAroma(null);
          Alert.alert(
            "Aroma Unavailable",
            "Could not load this aroma — please try again",
          );
        }
      } finally {
        if (active) setLoadedId(aromaId);
      }
    })();
    return () => {
      active = false;
    };
  }, [aromaId]);

  const handleShare = useCallback(async () => {
    if (!aroma) return;

    try {
      await Share.share({
        message: `${aroma.emoji || "🌸"} ${aroma.title}\n\n${aroma.shortDescription || aroma.fullDescription || ""}\n\nShared from AromaFlow`,
        title: aroma.title,
      });
    } catch {
      Alert.alert("Sharing Unavailable", "Could not share this aroma");
    }
  }, [aroma]);

  const handleCalendarReminder = useCallback(async () => {
    try {
      const result = await createCalendarReminder({
        title: `AromaFlow: ${aroma?.title || "Explore Scents"}`,
        notes: aroma?.shortDescription || "",
      });
      if (result.status === "unsupported") {
        Alert.alert(
          "Calendar unavailable in Expo Go",
          "Calendar reminders require a development build of AromaFlow",
        );
        return;
      }
      if (result.status === "permission-denied") {
        Alert.alert(
          "Permission Denied",
          "Calendar access is needed to set reminders.",
        );
        return;
      }

      if (result.status === "no-calendar") {
        Alert.alert("No Calendar Found", "Could not find a writable calendar.");
        return;
      }

      Alert.alert(
        "Reminder Added",
        "A 30-minute exploration session has been added to your calendar.",
      );
    } catch {
      Alert.alert(
        "Calendar Error",
        "Could not create the event. Make sure expo-calendar is installed.",
      );
    }
  }, [aroma]);

  const dots = useMemo(
    () => Array.from({ length: 5 }, (_, i) => i < (aroma?.intensity || 0)),
    [aroma?.intensity],
  );

  const createdDate = aroma?.createdAt
    ? new Date(aroma.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return {
    aroma,
    setAroma,
    loading,
    isOwner,
    dots,
    createdDate,
    handleShare,
    handleCalendarReminder,
  };
}
