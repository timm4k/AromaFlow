import { Stack } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { AppProviders } from "../src/file-based-navigation/AppProviders";
import { useAuth } from "../src/hooks/useAuth";
import { useTheme } from "../src/hooks/useTheme";

function RootStack() {
  const { currentUser, loading } = useAuth();
  const { theme } = useTheme();
  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: theme.bg,
        }}
      >
        <ActivityIndicator
          accessibilityLabel="Loading your session"
          color={theme.accent}
          size="large"
        />
      </View>
    );
  }
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: theme.card },
        headerTintColor: theme.text,
        headerTitleStyle: { fontWeight: "700" },
      }}
    >
      <Stack.Protected guard={Boolean(currentUser)}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="aroma/[id]"
          options={{
            headerShown: true,
            title: "Aroma details",
            headerBackTitle: "Back",
          }}
        />
        <Stack.Screen
          name="inspiration/[id]"
          options={{ headerShown: false }}
        />
      </Stack.Protected>
      <Stack.Protected guard={!currentUser}>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Screen name="feedback" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AppProviders>
      <RootStack />
    </AppProviders>
  );
}
