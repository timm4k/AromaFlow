import { deleteAroma, updateAroma } from "../src/firebase/aromaService";
import useAromaStore from "../src/store/aromaStore";
import useAuthStore from "../src/store/authStore";
import { filterAromas } from "../src/utils/filterAromas";

jest.mock("../src/firebase/aromaService", () => ({
  addAroma: jest.fn(),
  deleteAroma: jest.fn(),
  updateAroma: jest.fn(),
}));
jest.mock("../src/firebase/authService", () => ({}));

beforeEach(() => {
  jest.clearAllMocks();
  useAuthStore.setState({ currentUser: { uid: "tate", displayName: "Tate" } });
  useAromaStore.setState({ customAromas: [], publicAromas: [], favorites: [] });
});

test.each([null, { uid: "remi" }])(
  "rejects changes without the owner account",
  async (user) => {
    useAromaStore.setState({
      customAromas: [{ id: "lavender", ownerId: "tate" }],
    });
    useAuthStore.setState({ currentUser: user });
    await expect(
      useAromaStore.getState().deleteAroma("lavender"),
    ).rejects.toThrow("own aromas");
    await expect(
      useAromaStore
        .getState()
        .updateAroma("lavender", { visibility: "public" }),
    ).rejects.toThrow("own aromas");
    expect(deleteAroma).not.toHaveBeenCalled();
    expect(updateAroma).not.toHaveBeenCalled();
  },
);

test("rejects unknown aromas instead of sending a blind update", async () => {
  await expect(
    useAromaStore.getState().updateAroma("missing", {}),
  ).rejects.toThrow("own aromas");
  expect(updateAroma).not.toHaveBeenCalled();
});

test("allows the owner to change a public aroma and removes deleted favorites", async () => {
  useAromaStore.setState({
    publicAromas: [{ id: "lavender", ownerId: "tate" }],
    favorites: ["lavender", "cedar"],
  });
  await useAromaStore
    .getState()
    .updateAroma("lavender", { visibility: "private" });
  expect(updateAroma).toHaveBeenCalledWith("lavender", {
    visibility: "private",
  });
  await useAromaStore.getState().deleteAroma("lavender");
  expect(useAromaStore.getState().favorites).toEqual(["cedar"]);
});

test("shared search keeps case-insensitive matching and category filtering", () => {
  const aromas = [
    { id: "rose", title: "Rose", category: "Floral" },
    { id: "cedar", title: "Cedar", category: "Woody" },
  ];
  expect(filterAromas(aromas, " ROSE ")).toEqual([aromas[0]]);
  expect(filterAromas(aromas, "", "Woody")).toEqual([aromas[1]]);
  expect(filterAromas(aromas, "rose", "Woody")).toEqual([]);
});
