import Constants, { ExecutionEnvironment } from "expo-constants";
import { Platform } from "react-native";

const REMINDER_DURATION_MINUTES = 30;

export async function createCalendarReminder({ title, notes }) {
  if (
    Platform.OS === "web" ||
    Constants.executionEnvironment === ExecutionEnvironment.StoreClient
  ) {
    return { status: "unsupported" };
  }
  const Calendar = require("expo-calendar/legacy");
  const { status } = await Calendar.requestCalendarPermissionsAsync();
  if (status !== "granted") return { status: "permission-denied" };
  const calendars = await Calendar.getCalendarsAsync(
    Calendar.EntityTypes.EVENT,
  );
  const calendar = calendars.find((entry) => entry.allowsModifications);
  if (!calendar) return { status: "no-calendar" };
  const now = new Date();
  const eventId = await Calendar.createEventAsync(calendar.id, {
    title,
    notes,
    startDate: now,
    endDate: new Date(now.getTime() + REMINDER_DURATION_MINUTES * 60 * 1000),
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
  if (!eventId) throw new Error("The calendar did not create the reminder");
  return { status: "created", eventId };
}
