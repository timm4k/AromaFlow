import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import useSettingsStore from "./src/store/settingsStore";
import { getTheme } from "./src/styles/colors";
import AppNavigator from "./src/navigation/AppNavigator";
import StoreSubscriber from "./src/components/StoreSubscriber";
import ErrorBoundary from "./src/components/ErrorBoundary";
import { getNavigationTheme } from "./src/navigation/navigationTheme";

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
  const { darkMode, pastelMode, accentIntensity, fontSize } = useSettingsStore();
  const theme = getTheme(darkMode, pastelMode, accentIntensity, fontSize);
  const navigationTheme = getNavigationTheme(theme, darkMode);

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
