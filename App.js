import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AuthProvider } from "./src/context/AuthContext";
import { ThemeProvider, useTheme } from "./src/context/ThemeContext";
import { AromaProvider } from "./src/context/AromaContext";
import AppNavigator from "./src/navigation/AppNavigator";
import ErrorBoundary from "./src/components/ErrorBoundary";
import { getNavigationTheme } from "./src/navigation/navigationTheme";

function AppContent() {
  const { theme, darkMode } = useTheme();
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
      <AuthProvider>
        <ThemeProvider>
          <AromaProvider>
            <AppContent />
          </AromaProvider>
        </ThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
