import { useCallback, useEffect, useRef, useState } from "react";
import type { User } from "firebase/auth";
import {
  ActivityIndicator,
  Alert,
  AppState,
  Linking,
  Pressable,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../hooks/useTheme";
import { useAuth } from "../hooks/useAuth";
import { LocationDenied } from "./components/LocationDenied";
import { LocationPermissionRequest } from "./components/LocationPermissionRequest";
import { MapAction, MapNotice } from "./components/MapNotice";
import { MapCanvas, type MapCanvasHandle } from "./components/MapCanvas";
import { PlaceEditor } from "./components/PlaceEditor";
import { PlaceList } from "./components/PlaceList";
import { isValidCoordinates } from "./coordinates";
import { scentOrigins } from "./data/scentOrigins";
import { useCurrentLocation } from "./hooks/useCurrentLocation";
import { useLocationPermission } from "./hooks/useLocationPermission";
import { usePlacePins } from "./hooks/usePlacePins";
import { styles } from "./styles";
import type { Coordinates, PlacePin } from "./types/map";

export default function MapScreen() {
  const { currentUser }: { currentUser: User | null } = useAuth();
  return currentUser ? (
    <ScentMapScreen key={currentUser.uid} profileId={currentUser.uid} />
  ) : null;
}

function ScentMapScreen({ profileId }: { profileId: string }) {
  const { theme } = useTheme();
  const mapRef = useRef<MapCanvasHandle>(null);
  const { pins, ready, busy, storageError, addPin, changePin, retryLoad } =
    usePlacePins(profileId);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [placesVisible, setPlacesVisible] = useState(false);
  const selectedPin = pins.find((pin) => pin.id === selectedId);
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [mapAttempt, setMapAttempt] = useState(0);
  const { status, requestPermission, recheckPermission } =
    useLocationPermission();
  const {
    coords,
    loading: coordsLoading,
    error,
    fetchLocation,
  } = useCurrentLocation();

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") void recheckPermission();
    });
    return () => subscription.remove();
  }, [recheckPermission]);

  useEffect(() => {
    if (status === "granted") void fetchLocation();
  }, [status, fetchLocation]);

  const handleMapRef = useCallback((map: MapCanvasHandle | null) => {
    mapRef.current = map;
    if (!map) setMapReady(false);
  }, []);

  const centerOnUser = useCallback(() => {
    if (coords && mapReady) {
      mapRef.current?.centerOn(coords);
    }
  }, [coords, mapReady]);

  useEffect(() => {
    centerOnUser();
  }, [centerOnUser]);

  const handleMapPress = useCallback(
    (coordinate: Coordinates) => {
      if (!ready || busy) return;
      if (!isValidCoordinates(coordinate)) return;
      setSelectedId(addPin(coordinate));
    },
    [addPin, busy, ready],
  );

  const confirmPin = async (pin: PlacePin) => {
    if (await changePin(pin.id, pin)) setSelectedId(null);
  };

  const removePin = async () => {
    if (selectedId && (await changePin(selectedId, null))) setSelectedId(null);
  };

  const handleCenterOnUser = useCallback(() => {
    if (coords) centerOnUser();
    else void fetchLocation();
  }, [coords, centerOnUser, fetchLocation]);

  const showOrigins = useCallback(() => {
    mapRef.current?.fitCoordinates(
      scentOrigins.map((origin) => origin.coordinate),
    );
  }, []);

  const focusPlace = (coordinate: Coordinates) => {
    mapRef.current?.centerOn(coordinate);
    setPlacesVisible(false);
  };

  const openSource = useCallback((url: string) => {
    void Linking.openURL(url).catch(() =>
      Alert.alert(
        "Source unavailable",
        "Could not open the botanical reference — try again later",
      ),
    );
  }, []);

  if (status === "loading")
    return (
      <MapNotice
        icon="📍"
        title="Checking location access"
        message="AromaFlow only uses foreground location for this map"
      >
        <ActivityIndicator size="large" color={theme.accent} />
      </MapNotice>
    );
  if (status === "undetermined")
    return (
      <LocationPermissionRequest onRequest={() => void requestPermission()} />
    );
  if (status === "denied") return <LocationDenied />;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.bg }]}
      edges={["bottom"]}
    >
      <View style={styles.container}>
        <MapCanvas
          key={mapAttempt}
          ref={handleMapRef}
          pins={pins}
          coordinate={coords}
          onReady={() => setMapReady(true)}
          onPress={handleMapPress}
          onEdit={setSelectedId}
          onSource={(id) => {
            const origin = scentOrigins.find((item) => item.scentId === id);
            if (origin) openSource(origin.sourceUrl);
          }}
          onError={setMapError}
          onOpenLink={openSource}
        />
        <View
          pointerEvents="none"
          style={[
            styles.overlay,
            styles.badge,
            { backgroundColor: theme.card, shadowColor: theme.shadow },
          ]}
        >
          <Text style={[styles.badgeTitle, { color: theme.text }]}>
            My places: {pins.length}
          </Text>
        </View>
        {(error || storageError || !ready || mapError) && (
          <View
            style={[
              styles.overlay,
              styles.errorCard,
              { backgroundColor: theme.card, shadowColor: theme.shadow },
            ]}
          >
            <Text
              accessibilityRole="alert"
              style={[styles.caption, { color: theme.error }]}
            >
              {storageError ||
                error ||
                (mapError
                  ? "Could not load the map"
                  : "Loading your saved places…")}
            </Text>
            {!ready && storageError ? (
              <MapAction title="Retry saved places" onPress={retryLoad} />
            ) : error ? (
              <MapAction
                title="Retry location"
                onPress={() => void fetchLocation()}
                disabled={coordsLoading}
              />
            ) : mapError ? (
              <MapAction
                title="Retry map"
                onPress={() => {
                  setMapError(false);
                  setMapReady(false);
                  setMapAttempt((value) => value + 1);
                }}
              />
            ) : null}
          </View>
        )}
        <View style={styles.controls}>
          <MapAction
            title="Find places"
            onPress={() => setPlacesVisible(true)}
          />
          <MapAction
            title="View origins"
            onPress={showOrigins}
            disabled={!mapReady}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Center on my location"
            accessibilityState={{ disabled: coordsLoading || !mapReady }}
            disabled={coordsLoading || !mapReady}
            onPress={handleCenterOnUser}
            style={({ pressed }) => [
              styles.locationButton,
              { backgroundColor: theme.card },
              (coordsLoading || !mapReady) && styles.disabled,
              pressed && styles.pressed,
            ]}
          >
            {coordsLoading ? (
              <ActivityIndicator size="small" color={theme.accent} />
            ) : (
              <Text style={styles.locationIcon}>🎯</Text>
            )}
          </Pressable>
        </View>
        {placesVisible && (
          <PlaceList
            pins={pins}
            onFocus={focusPlace}
            onEdit={(id) => {
              setPlacesVisible(false);
              setSelectedId(id);
            }}
            onClose={() => setPlacesVisible(false)}
          />
        )}
        {selectedPin && (
          <PlaceEditor
            key={selectedPin.id}
            pin={selectedPin}
            busy={busy}
            error={storageError}
            onConfirm={(pin) => void confirmPin(pin)}
            onRemove={() => void removePin()}
            onClose={() => setSelectedId(null)}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
