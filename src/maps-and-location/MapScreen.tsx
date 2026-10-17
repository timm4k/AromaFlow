import { MapNotice } from "./components/MapNotice";

export default function MapScreen() {
  return (
    <MapNotice
      icon="🗺️"
      title="Scent origins"
      message="Open this mobile map in Expo Go or a development build to explore origin regions, use GPS and manage your own places"
    />
  );
}
