import { NavigationContainer } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import { useMemo } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useShallow } from "zustand/react/shallow";
import ErrorBoundary from "./src/components/ErrorBoundary";
import StoreSubscriber from "./src/components/StoreSubscriber";
import AppNavigator from "./src/navigation/AppNavigator";
import { getNavigationTheme } from "./src/navigation/navigationTheme";
import useSettingsStore from "./src/store/settingsStore";
import { getTheme } from "./src/styles/colors";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

function AppContent() {
  const { darkMode, pastelMode, accentIntensity, fontSize } = useSettingsStore(
    useShallow((state) => ({
      darkMode: state.darkMode,
      pastelMode: state.pastelMode,
      accentIntensity: state.accentIntensity,
      fontSize: state.fontSize,
    })),
  );
  const theme = useMemo(
    () => getTheme(darkMode, pastelMode, accentIntensity, fontSize),
    [darkMode, pastelMode, accentIntensity, fontSize],
  );
  const navigationTheme = useMemo(
    () => getNavigationTheme(theme, darkMode),
    [theme, darkMode],
  );

  return (
    <SafeAreaProvider>
      <StatusBar style={darkMode ? "light" : "dark"} />
      <NavigationContainer theme={navigationTheme}>
        <AppNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AppContent />
        <StoreSubscriber />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
