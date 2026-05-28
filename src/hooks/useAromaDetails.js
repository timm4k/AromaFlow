import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Share } from "react-native";
import { getAromaById } from "../firebase/aromaService";
import { aromas as localAromas } from "../data/aromas";

function findLocalAroma(id) {
  return localAromas.find(
    (a) => a.id === id || a.title?.toLowerCase().replace(/\s+/g, "-") === id,
  ) || null;
}

export default function useAromaDetails(aromaId, currentUser) {
  const [aroma, setAroma] = useState(null);
  const [loading, setLoading] = useState(true);

  const isOwner = aroma && currentUser && aroma.ownerId === currentUser.uid;

  useEffect(() => {
    (async () => {
      try {
        const local = findLocalAroma(aromaId);

        if (local) {
          setAroma(local);
          setLoading(false);
          return;
        }

        const data = await getAromaById(aromaId);
        setAroma(data);
      } catch (e) {
        console.warn("Failed to load aroma", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [aromaId]);

  const handleShare = useCallback(async () => {
    if (!aroma) return;

    try {
      await Share.share({
        message: `${aroma.emoji || "🌸"} ${aroma.title}\n\n${aroma.shortDescription || aroma.fullDescription || ""}\n\nShared from AromaFlow`,
        title: aroma.title,
      });
    } catch {
    }
  }, [aroma]);

  const handleCalendarReminder = useCallback(async () => {
    try {
      const Calendar = await import("expo-calendar");

      const { status } = await Calendar.requestCalendarPermissionsAsync();

      if (status !== "granted") {
        Alert.alert("Permission Denied", "Calendar access is needed to set reminders.");
        return;
      }

      const calendars = await Calendar.getCalendarsAsync();
      const defaultCal = calendars.find((c) => c.allowsModifications) || calendars[0];

      if (!defaultCal) {
        Alert.alert("No Calendar Found", "Could not find a writable calendar.");
        return;
      }

      const now = new Date();
      const event = {
        title: `AromaFlow: ${aroma?.title || "Explore Scents"}`,
        notes: aroma?.shortDescription || "",
        startDate: now,
        endDate: new Date(now.getTime() + 30 * 60 * 1000),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      };

      await Calendar.createEventAsync(defaultCal.id, event);
      Alert.alert("Reminder Added", "A 30-minute exploration session has been added to your calendar.");
    } catch (e) {
      console.warn("Calendar error", e);
      Alert.alert("Calendar Error", "Could not create the event. Make sure expo-calendar is installed.");
    }
  }, [aroma]);

  const dots = useMemo(
    () => Array.from({ length: 5 }, (_, i) => i < (aroma?.intensity || 0)),
    [aroma?.intensity],
  );

  const createdDate = aroma?.createdAt
    ? new Date(aroma.createdAt).toLocaleDateString("en-US", {
        year: "numeric", month: "long", day: "numeric",
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
