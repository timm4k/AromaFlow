import { act, renderHook, waitFor } from "@testing-library/react-native";
import * as Calendar from "expo-calendar/legacy";
import Constants from "expo-constants";
import { getAromaById } from "../src/firebase/aromaService";
import useAromaDetails from "../src/hooks/useAromaDetails";
import useAromaForm from "../src/hooks/useAromaForm";
import useAuthForm from "../src/hooks/useAuthForm";
import { createCalendarReminder } from "../src/services/calendarService";
import { validateDescription, validateName } from "../src/utils/validation";

jest.mock("../src/firebase/aromaService", () => ({ getAromaById: jest.fn() }));
jest.mock("expo-calendar/legacy", () => ({
  EntityTypes: { EVENT: "event" },
  requestCalendarPermissionsAsync: jest.fn(),
  getCalendarsAsync: jest.fn(),
  createEventAsync: jest.fn(),
}));

jest.mock("expo-constants", () => ({
  __esModule: true,
  default: { executionEnvironment: "standalone" },
  ExecutionEnvironment: { StoreClient: "storeClient" },
}));

beforeEach(() => jest.clearAllMocks());
afterEach(() => jest.restoreAllMocks());

test("Expo Go does not load an unavailable native calendar module", async () => {
  jest.replaceProperty(Constants, "executionEnvironment", "storeClient");
  expect(
    await createCalendarReminder({
      title: "AromaFlow",
      notes: "Explore scents",
    }),
  ).toEqual({ status: "unsupported" });
  expect(Calendar.requestCalendarPermissionsAsync).not.toHaveBeenCalled();
});

test("existing aroma validation still rejects duplicates and short descriptions", () => {
  expect(validateName(" lavender ", ["Lavender"]).valid).toBe(false);
  expect(validateDescription("Nice scent").valid).toBe(false);
  expect(
    validateDescription("A clean lavender scent for a quiet evening").valid,
  ).toBe(true);
});

test("the aroma form creates the same payload and resets every control", () => {
  const { result } = renderHook(() => useAromaForm([]));
  act(() => {
    result.current.setters.setName(" lavender mist ");
    result.current.setters.setDescription(
      " A gentle lavender scent for evening rituals ",
    );
    result.current.setters.setSelectedCategory("Floral");
    result.current.setters.setSelectedMood("Relaxing");
    result.current.setters.setSelectedEmoji("🌸");
  });
  expect(result.current.canSubmit).toBe(true);
  expect(result.current.buildPayload()).toEqual(
    expect.objectContaining({
      title: "Lavender mist",
      fullDescription: "A gentle lavender scent for evening rituals",
      category: "Floral",
      mood: "Relaxing",
      intensity: 3,
      visibility: "private",
    }),
  );
  act(() => result.current.reset());
  expect(result.current.canSubmit).toBe(false);
  expect(result.current.fields.name).toBe("");
});

test("repeated login taps only start one request", async () => {
  let resolveLogin;
  const login = jest.fn(
    () =>
      new Promise((resolve) => {
        resolveLogin = resolve;
      }),
  );
  const { result } = renderHook(() => useAuthForm({ mode: "login", login }));
  act(() => {
    result.current.setEmail(" tate@example.com ");
    result.current.setPassword("test-password");
  });
  let pending;
  act(() => {
    pending = result.current.handleSubmit();
    result.current.handleSubmit();
  });
  expect(login).toHaveBeenCalledTimes(1);
  expect(login).toHaveBeenCalledWith("tate@example.com", "test-password");
  await act(async () => {
    resolveLogin();
    await pending;
  });
  expect(result.current.isSubmitting).toBe(false);
});

test("late aroma requests do not overwrite a newly opened aroma", async () => {
  let resolveFirst;
  getAromaById
    .mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveFirst = resolve;
        }),
    )
    .mockResolvedValueOnce({ id: "second-custom", title: "Cedar breeze" });
  const { result, rerender } = renderHook(
    ({ id }) => useAromaDetails(id, null),
    { initialProps: { id: "first-custom" } },
  );
  rerender({ id: "second-custom" });
  await waitFor(() => expect(result.current.loading).toBe(false));
  await act(async () =>
    resolveFirst({ id: "first-custom", title: "Old aroma" }),
  );
  expect(result.current.aroma.title).toBe("Cedar breeze");
});

test("calendar permission denial does not attempt to create an event", async () => {
  Calendar.requestCalendarPermissionsAsync.mockResolvedValue({
    status: "denied",
  });
  expect(
    await createCalendarReminder({
      title: "AromaFlow",
      notes: "Explore scents",
    }),
  ).toEqual({ status: "permission-denied" });
  expect(Calendar.createEventAsync).not.toHaveBeenCalled();
});

test("a read-only calendar is never used as a fallback", async () => {
  Calendar.requestCalendarPermissionsAsync.mockResolvedValue({
    status: "granted",
  });
  Calendar.getCalendarsAsync.mockResolvedValue([
    { id: "read-only", allowsModifications: false },
  ]);
  expect(
    await createCalendarReminder({
      title: "AromaFlow",
      notes: "Explore scents",
    }),
  ).toEqual({ status: "no-calendar" });
  expect(Calendar.createEventAsync).not.toHaveBeenCalled();
});

test("a reminder is added to a writable calendar for thirty minutes", async () => {
  Calendar.requestCalendarPermissionsAsync.mockResolvedValue({
    status: "granted",
  });
  Calendar.getCalendarsAsync.mockResolvedValue([
    { id: "personal", allowsModifications: true },
  ]);
  Calendar.createEventAsync.mockResolvedValue("event-id");
  expect(
    await createCalendarReminder({
      title: "AromaFlow: Lavender",
      notes: "Evening ritual",
    }),
  ).toEqual({ status: "created", eventId: "event-id" });
  const [calendarId, event] = Calendar.createEventAsync.mock.calls[0];
  expect(calendarId).toBe("personal");
  expect(event.endDate.getTime() - event.startDate.getTime()).toBe(
    30 * 60 * 1000,
  );
});
