import AsyncStorage from "@react-native-async-storage/async-storage";
import { act, render, waitFor } from "@testing-library/react-native";
import StoreSubscriber from "../src/components/StoreSubscriber";
import useAromaStore from "../src/store/aromaStore";
import useAuthStore from "../src/store/authStore";

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(() => Promise.resolve()),
}));
jest.mock("../src/store/settingsStore", () => {
  const settings = { ready: true, sessionOnly: false, setReady: jest.fn() };
  return { __esModule: true, default: (select) => select(settings) };
});
jest.mock("../src/firebase/authService", () => ({
  onAuthChanged: () => () => {},
}));
jest.mock("../src/firebase/aromaService", () => ({
  subscribePublicAromas: () => () => {},
  subscribeMyAromas: () => () => {},
}));

test("favorites are loaded before saving and never copied to another account", async () => {
  AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(["lavender"]));
  useAuthStore.setState({ currentUser: { uid: "tate" } });
  useAromaStore.setState({ favorites: [], customAromas: [] });
  const view = render(<StoreSubscriber />);
  await waitFor(() =>
    expect(useAromaStore.getState().favorites).toEqual(["lavender"]),
  );
  expect(AsyncStorage.setItem).not.toHaveBeenCalledWith(
    "@aromaflow/favorites_tate",
    "[]",
  );

  let resolveFavorites;
  AsyncStorage.getItem.mockImplementationOnce(
    () =>
      new Promise((resolve) => {
        resolveFavorites = resolve;
      }),
  );
  AsyncStorage.setItem.mockClear();
  act(() => useAuthStore.setState({ currentUser: { uid: "remi" } }));
  expect(AsyncStorage.setItem).not.toHaveBeenCalledWith(
    "@aromaflow/favorites_remi",
    JSON.stringify(["lavender"]),
  );
  await act(async () => resolveFavorites(JSON.stringify(["cedar"])));
  await waitFor(() =>
    expect(useAromaStore.getState().favorites).toEqual(["cedar"]),
  );
  expect(AsyncStorage.setItem).toHaveBeenCalledWith(
    "@aromaflow/favorites_remi",
    JSON.stringify(["cedar"]),
  );
  view.unmount();
});
