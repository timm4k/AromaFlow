import { useCallback, useEffect, useRef, useState } from "react";
import * as Location from "expo-location";

export type PermissionState = "loading" | "undetermined" | "granted" | "denied";

export function useLocationPermission() {
  const [status, setStatus] = useState<PermissionState>("loading");
  const session = useRef({ active: false, requesting: false, version: 0 });

  const checkPermission = useCallback(() => {
    const current = session.current;
    if (current.requesting) return;
    const currentVersion = ++current.version;
    return Location.getForegroundPermissionsAsync()
      .then((permission) => {
        if (current.active && current.version === currentVersion) {
          setStatus(
            permission.status === "granted"
              ? "granted"
              : !permission.canAskAgain
                ? "denied"
                : permission.status,
          );
        }
      })
      .catch(() => {
        if (current.active && current.version === currentVersion)
          setStatus("denied");
      });
  }, []);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    const current = session.current;
    if (current.requesting) return false;
    current.requesting = true;
    const currentVersion = ++current.version;
    if (current.active) setStatus("loading");
    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      const granted = permission.status === "granted";
      if (current.active && current.version === currentVersion)
        setStatus(granted ? "granted" : "denied");
      return granted;
    } catch {
      if (current.active && current.version === currentVersion)
        setStatus("denied");
      return false;
    } finally {
      current.requesting = false;
    }
  }, []);

  useEffect(() => {
    const current = session.current;
    current.active = true;
    void checkPermission();
    return () => {
      current.active = false;
      current.version++;
    };
  }, [checkPermission]);

  return { status, requestPermission, recheckPermission: checkPermission };
}
