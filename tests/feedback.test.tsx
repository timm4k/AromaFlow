import { act, fireEvent, render, waitFor } from "@testing-library/react-native";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  View,
} from "react-native";
import FeedbackScreen from "../src/form-elements-and-validation/FeedbackScreen";
import InputField from "../src/form-elements-and-validation/InputField";
import {
  feedbackDefaults,
  feedbackSchema,
  formatFeedback,
} from "../src/form-elements-and-validation/feedbackSchema";
import { fieldColors } from "../src/form-elements-and-validation/formColors";

jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({ goBack: jest.fn() }),
}));
jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));
jest.mock("../src/hooks/useTheme", () => ({
  useTheme: () => ({
    theme: jest
      .requireActual("../src/styles/colors")
      .getTheme(false, true, "medium"),
  }),
}));

const validFeedback = {
  name: "Tate",
  email: "tate@example.com",
  rating: 4,
  comment: "The lavender collection feels calm and easy to explore",
  isAnonymous: false,
};

describe("Feedback validation", () => {
  test.each([
    ["empty form", feedbackDefaults],
    ["short name", { ...validFeedback, name: "T" }],
    ["long name", { ...validFeedback, name: "T".repeat(51) }],
    ["invalid email", { ...validFeedback, email: "tate@" }],
    ["short feedback", { ...validFeedback, comment: "Nice" }],
    ["long feedback", { ...validFeedback, comment: "a".repeat(301) }],
    ["zero stars", { ...validFeedback, rating: 0 }],
    ["six stars", { ...validFeedback, rating: 6 }],
    ["fractional stars", { ...validFeedback, rating: 2.5 }],
  ])("rejects %s", (_, value) =>
    expect(feedbackSchema.safeParse(value).success).toBe(false),
  );

  test("accepts real feedback and defaults anonymity to false", () => {
    const { isAnonymous: _isAnonymous, ...input } = validFeedback;
    expect(feedbackSchema.parse(input)).toEqual(validFeedback);
  });

  test("does not show the name in an anonymous receipt", () => {
    const receipt = formatFeedback({ ...validFeedback, isAnonymous: true });
    expect(receipt).toContain("Name: Anonymous");
    expect(receipt).not.toContain("Name: Tate");
  });
});

describe("Reusable input", () => {
  test("forwards focus, blur and keyboard props and keeps error priority", () => {
    const onFocus = jest.fn();
    const onBlur = jest.fn();
    const view = render(
      <InputField
        label="Email"
        keyboardType="email-address"
        onFocus={onFocus}
        onBlur={onBlur}
      />,
    );
    const input = view.getByLabelText("Email");
    expect(input.props.keyboardType).toBe("email-address");
    fireEvent(input, "focus", { nativeEvent: {} });
    expect(onFocus).toHaveBeenCalledTimes(1);
    expect(
      StyleSheet.flatten(view.UNSAFE_getAllByType(View)[1].props.style),
    ).toEqual(
      expect.objectContaining({
        borderColor: fieldColors.focus,
        borderWidth: 2,
      }),
    );
    view.rerender(
      <InputField label="Email" error="Invalid email" onBlur={onBlur} />,
    );
    expect(view.getByText("Invalid email")).toBeTruthy();
    expect(
      StyleSheet.flatten(view.UNSAFE_getAllByType(View)[1].props.style),
    ).toEqual(expect.objectContaining({ borderColor: fieldColors.error }));
    fireEvent(input, "blur", { nativeEvent: {} });
    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  test("only shows a clear button when there is text and a handler", () => {
    const onClear = jest.fn();
    const view = render(
      <InputField label="Name" value="Tate" onClear={onClear} />,
    );
    fireEvent.press(view.getByLabelText("Clear Name"));
    expect(onClear).toHaveBeenCalledTimes(1);
    view.rerender(<InputField label="Name" value="" onClear={onClear} />);
    expect(view.queryByLabelText("Clear Name")).toBeNull();
    view.rerender(<InputField label="Name" value="Tate" />);
    expect(view.queryByLabelText("Clear Name")).toBeNull();
  });
});

describe("Feedback screen", () => {
  afterEach(() => jest.restoreAllMocks());

  test("validates on submit and removes errors as the user corrects input", async () => {
    const alert = jest.spyOn(Alert, "alert").mockImplementation(() => {});
    const view = render(<FeedbackScreen />);
    await act(async () => {
      fireEvent.press(view.getByText("Send feedback"));
    });
    await waitFor(() =>
      expect(view.getByText("Enter a valid email address")).toBeTruthy(),
    );
    expect(alert).not.toHaveBeenCalled();
    await act(async () => {
      fireEvent.changeText(view.getByLabelText("Email address"), "wrong-email");
    });
    expect(view.getByText("Enter a valid email address")).toBeTruthy();
    await act(async () => {
      fireEvent.changeText(
        view.getByLabelText("Email address"),
        validFeedback.email,
      );
    });
    await waitFor(() =>
      expect(view.queryByText("Enter a valid email address")).toBeNull(),
    );
    fireEvent.changeText(view.getByLabelText("Your feedback"), "Nice");
    await waitFor(() =>
      expect(
        view.getByText("Write at least 10 characters about your experience"),
      ).toBeTruthy(),
    );
  });

  test("submits controlled fields, stars and switch then resets after confirmation", async () => {
    const alert = jest.spyOn(Alert, "alert").mockImplementation(() => {});
    const view = render(<FeedbackScreen />);
    expect(view.UNSAFE_getByType(KeyboardAvoidingView).props.behavior).toBe(
      Platform.OS === "ios" ? "padding" : "height",
    );
    expect(
      view.UNSAFE_getByType(ScrollView).props.keyboardShouldPersistTaps,
    ).toBe("handled");
    fireEvent.changeText(view.getByLabelText("Your name"), validFeedback.name);
    fireEvent.changeText(
      view.getByLabelText("Email address"),
      validFeedback.email,
    );
    fireEvent.changeText(
      view.getByLabelText("Your feedback"),
      validFeedback.comment,
    );
    fireEvent.press(view.getByLabelText("4 stars"));
    fireEvent(view.UNSAFE_getByType(Switch), "valueChange", true);
    fireEvent.press(view.getByText("Send feedback"));
    await waitFor(() => expect(alert).toHaveBeenCalledTimes(1));
    expect(alert.mock.calls[0][1]).toBe(
      formatFeedback({ ...validFeedback, isAnonymous: true }),
    );
    fireEvent.press(view.getByLabelText("Clear Your name"));
    expect(view.getByLabelText("Your name").props.value).toBe("");
    const confirm = alert.mock.calls[0][2]?.[0].onPress;
    expect(confirm).toBeDefined();
    await act(async () => {
      confirm?.();
    });
    expect(view.getByLabelText("Email address").props.value).toBe("");
    expect(view.getByLabelText("Your feedback").props.value).toBe("");
    expect(view.getByText("5 of 5 stars")).toBeTruthy();
    expect(view.UNSAFE_getByType(Switch).props.value).toBe(false);
  });

  test("web confirmation shows submitted data and resets after Done", async () => {
    jest.replaceProperty(Platform, "OS", "web");
    const view = render(<FeedbackScreen />);
    fireEvent.changeText(view.getByLabelText("Your name"), validFeedback.name);
    fireEvent.changeText(
      view.getByLabelText("Email address"),
      validFeedback.email,
    );
    fireEvent.changeText(
      view.getByLabelText("Your feedback"),
      validFeedback.comment,
    );
    await act(async () => {
      fireEvent.press(view.getByText("Send feedback"));
    });
    expect(view.getByText("Thank you for your feedback!")).toBeTruthy();
    expect(
      view.getByText(formatFeedback({ ...validFeedback, rating: 5 })),
    ).toBeTruthy();
    fireEvent.press(view.getByText("Done"));
    expect(view.queryByText("Thank you for your feedback!")).toBeNull();
    expect(view.getByLabelText("Your name").props.value).toBe("");
  });
});
