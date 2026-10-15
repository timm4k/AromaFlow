import { useLocalSearchParams } from "expo-router";
import ScentCatalogDetailsScreen from "../../src/file-based-navigation/ScentCatalogDetailsScreen";

export default function PlaceDetailsRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const scentId = Array.isArray(id) ? id[0] : id;
  return <ScentCatalogDetailsScreen scentId={scentId} />;
}
