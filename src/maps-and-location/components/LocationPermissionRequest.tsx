import { MapAction, MapNotice } from "./MapNotice";

export function LocationPermissionRequest({
  onRequest,
}: {
  onRequest: () => void;
}) {
  return (
    <MapNotice
      icon="📍"
      title="Location access"
      message="Allow foreground location access to see yourself on the scent origins map and add your own discovery pins"
    >
      <MapAction title="Allow location access" onPress={onRequest} />
    </MapNotice>
  );
}
