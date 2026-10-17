import { useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { getScentById } from "../../file-based-navigation/scentCatalog";
import { useTheme } from "../../hooks/useTheme";
import { scentOrigins } from "../data/scentOrigins";
import { styles } from "../styles";
import type { Coordinates, PlacePin } from "../types/map";
import { MapAction } from "./MapNotice";

interface PlaceListProps {
  pins: PlacePin[];
  onFocus: (coordinate: Coordinates) => void;
  onEdit: (id: string) => void;
  onClose: () => void;
}

interface PlaceListItem {
  id: string;
  title: string;
  detail: string;
  coordinate: Coordinates;
  pin?: PlacePin;
}

export function PlaceList({ pins, onFocus, onEdit, onClose }: PlaceListProps) {
  const { theme } = useTheme();
  const [search, setSearch] = useState("");
  const entries: PlaceListItem[] = [
    ...pins.map((pin) => ({
      id: `pin:${pin.id}`,
      title: `${pin.icon} ${pin.title}`,
      detail: pin.saved
        ? "My place · Saved on this device"
        : "My place · Temporary",
      coordinate: pin.coordinate,
      pin,
    })),
    ...scentOrigins.map((origin) => ({
      id: `origin:${origin.scentId}`,
      title: getScentById(origin.scentId)?.title ?? origin.species,
      detail: `${origin.region}\n${origin.species}\n${origin.rangeNote}`,
      coordinate: origin.coordinate,
    })),
  ];
  const query = search.trim().toLowerCase();
  const matches = entries.filter((entry) =>
    `${entry.title} ${entry.detail}`.toLowerCase().includes(query),
  );

  return (
    <Modal transparent animationType="slide" onRequestClose={onClose}>
      <View style={[styles.editorBackdrop, { backgroundColor: theme.overlay }]}>
        <View style={[styles.placeList, { backgroundColor: theme.card }]}>
          <Text style={[styles.heading, { color: theme.text }]}>
            Find a place
          </Text>
          <Text style={[styles.caption, { color: theme.textSecondary }]}>
            Search origin regions and your pins, then tap a place to center the
            map
          </Text>
          <TextInput
            accessibilityLabel="Search map places"
            value={search}
            onChangeText={setSearch}
            placeholder="Search a scent, region or your place"
            placeholderTextColor={theme.textSecondary}
            style={[
              styles.placeInput,
              { color: theme.text, borderColor: theme.border },
            ]}
          />
          <FlatList
            data={matches}
            keyExtractor={(item) => item.id}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.placeListContent}
            ListEmptyComponent={
              <Text style={[styles.message, { color: theme.textSecondary }]}>
                No matching places
              </Text>
            }
            renderItem={({ item }) => (
              <View style={[styles.placeRow, { borderColor: theme.border }]}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Show ${item.title} on map`}
                  onPress={() => onFocus(item.coordinate)}
                  style={({ pressed }) => [
                    styles.placeTarget,
                    pressed && styles.pressed,
                  ]}
                >
                  <Text style={[styles.calloutTitle, { color: theme.text }]}>
                    {item.title}
                  </Text>
                  <Text
                    style={[styles.caption, { color: theme.textSecondary }]}
                  >
                    {item.detail}
                  </Text>
                  <Text style={[styles.actionText, { color: theme.accent }]}>
                    Show on map →
                  </Text>
                </Pressable>
                {item.pin && (
                  <MapAction
                    title="Edit or delete"
                    onPress={() => onEdit(item.pin!.id)}
                  />
                )}
              </View>
            )}
          />
          <MapAction title="Close" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}
