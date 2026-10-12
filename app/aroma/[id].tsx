import { useLocalSearchParams } from "expo-router";
import ScentDetailsScreen from "../../src/file-based-navigation/ScentDetailsScreen";

export default function AromaDetailsRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <ScentDetailsScreen aromaId={Array.isArray(id) ? id[0] : id} />;
}
