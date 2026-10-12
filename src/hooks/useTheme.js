import { useMemo } from "react";
import useSettingsStore from "../store/settingsStore";
import { getTheme } from "../styles/colors";

export function useTheme() {
  const { setReady: _setReady, ...settings } = useSettingsStore();
  const { darkMode, pastelMode, accentIntensity, fontSize } = settings;

  const theme = useMemo(
    () => getTheme(darkMode, pastelMode, accentIntensity, fontSize),
    [darkMode, pastelMode, accentIntensity, fontSize],
  );

  return {
    theme,
    ...settings,
  };
}
