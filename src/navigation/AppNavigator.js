import { ActivityIndicator, StyleSheet, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import AromaDetailsScreen from "../screens/AromaDetailsScreen";
import InspirationDetailsScreen from "../screens/InspirationDetailsScreen";
import MainTabs from "./MainTabs";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { currentUser, loading } = useAuth();
  const { theme } = useTheme();

  if (loading) {
    return (
      <View style={[styles.loading, { backgroundColor: theme.bg }]}>
        <ActivityIndicator size="large" color={theme.accent} />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {currentUser ? (
        <>
          <Stack.Screen
            name="MainTabs"
            component={MainTabs}
            options={{ animation: "fade" }}
          />

          <Stack.Screen
            name="AromaDetails"
            component={AromaDetailsScreen}
            options={{ animation: "slide_from_right" }}
          />

          <Stack.Screen
            name="InspirationDetails"
            component={InspirationDetailsScreen}
            options={{ animation: "slide_from_right" }}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ animation: "fade", gestureEnabled: false }}
          />

          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ animation: "slide_from_right" }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
