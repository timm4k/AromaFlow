import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type Ref,
} from "react";
import { ActivityIndicator, View } from "react-native";
import WebView from "react-native-webview";
import { z } from "zod";
import { useTheme } from "../../hooks/useTheme";
import { getScentById } from "../../file-based-navigation/scentCatalog";
import { scentOrigins } from "../data/scentOrigins";
import { mapDocument } from "../mapDocument";
import { styles } from "../styles";
import type { Coordinates, PlacePin } from "../types/map";

export interface MapCanvasHandle {
  centerOn: (coordinate: Coordinates) => void;
  fitCoordinates: (coordinates: Coordinates[]) => void;
}

interface MapCanvasProps {
  ref: Ref<MapCanvasHandle>;
  pins: PlacePin[];
  coordinate: Coordinates | null;
  onReady: () => void;
  onPress: (coordinate: Coordinates) => void;
  onEdit: (id: string) => void;
  onSource: (id: string) => void;
  onOpenLink: (url: string) => void;
  onError: (failed: boolean) => void;
}

const eventSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("press"),
    coordinate: z.object({
      latitude: z.number().min(-90).max(90),
      longitude: z.number().min(-180).max(180),
    }),
  }),
  z.object({ type: z.enum(["edit", "source"]), id: z.string().max(100) }),
  z.object({ type: z.enum(["ready", "error", "tilesLoaded"]) }),
]);
const mapSource = { html: mapDocument };

export function MapCanvas({
  ref,
  pins,
  coordinate,
  onReady,
  onPress,
  onEdit,
  onSource,
  onOpenLink,
  onError,
}: MapCanvasProps) {
  const { theme } = useTheme();
  const webRef = useRef<WebView>(null);
  const [ready, setReady] = useState(false);
  const send = useCallback((message: object) => {
    webRef.current?.injectJavaScript(
      `window.AromaMap?.receive(${JSON.stringify(message)});true;`,
    );
  }, []);
  useImperativeHandle(
    ref,
    () => ({
      centerOn: (target) => send({ type: "center", coordinate: target }),
      fitCoordinates: (coordinates) => send({ type: "fit", coordinates }),
    }),
    [send],
  );
  useEffect(() => {
    if (!ready) return;
    send({
      type: "update",
      data: {
        coordinate,
        theme: {
          text: theme.text,
          card: theme.card,
          accent: theme.accent,
          accentLight: theme.accentLight,
        },
        places: [
          ...pins.map((pin) => ({
            ...pin,
            kind: "personal",
            description: pin.saved ? "Saved on this device" : "Temporary place",
          })),
          ...scentOrigins.map((origin) => ({
            id: origin.scentId,
            title: getScentById(origin.scentId)?.title ?? origin.species,
            sourceName: origin.sourceName,
            description: `${origin.region} — regional reference\n${origin.species}\n${origin.rangeNote}`,
            coordinate: origin.coordinate,
            icon: "🌿",
            kind: "origin",
          })),
        ],
      },
    });
  }, [pins, coordinate, ready, send, theme]);

  return (
    <View style={styles.container}>
      <WebView
        ref={webRef}
        source={mapSource}
        originWhitelist={["*"]}
        javaScriptEnabled
        domStorageEnabled={false}
        sharedCookiesEnabled={false}
        thirdPartyCookiesEnabled={false}
        allowFileAccess={false}
        setSupportMultipleWindows={false}
        onShouldStartLoadWithRequest={(request) => {
          if (request.url === "about:blank") return true;
          if (
            [
              "https://opentopomap.org/about",
              "https://www.openstreetmap.org/copyright",
            ].includes(request.url)
          )
            onOpenLink(request.url);
          return false;
        }}
        onError={() => onError(true)}
        onMessage={({ nativeEvent }) => {
          if (nativeEvent.data.length > 4096) return;
          let value: unknown;
          try {
            value = JSON.parse(nativeEvent.data);
          } catch {
            onError(true);
            return;
          }
          const parsed = eventSchema.safeParse(value);
          if (!parsed.success) return;
          const event = parsed.data;
          if (event.type === "ready") {
            setReady(true);
            onReady();
          } else if (event.type === "press") onPress(event.coordinate);
          else if (
            event.type === "edit" &&
            pins.some((pin) => pin.id === event.id)
          )
            onEdit(event.id);
          else if (
            event.type === "source" &&
            scentOrigins.some((origin) => origin.scentId === event.id)
          )
            onSource(event.id);
          else if (event.type === "error") onError(true);
          else if (event.type === "tilesLoaded") onError(false);
        }}
        style={[styles.container, { backgroundColor: theme.bg }]}
      />
      {!ready && (
        <View pointerEvents="none" style={styles.mapLoading}>
          <ActivityIndicator size="large" color={theme.accent} />
        </View>
      )}
    </View>
  );
}
