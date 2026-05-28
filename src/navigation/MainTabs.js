import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StyleSheet, Text, View } from "react-native";

import CommunityScreen from "../screens/CommunityScreen";
import InspirationScreen from "../screens/InspirationScreen";
import SettingsScreen from "../screens/SettingsScreen";
import { AromasTab, MyAromasTab, AddTab } from "./tabScreens";
import { useTheme } from "../hooks/useTheme";
import { shadows } from "../styles/shadows";
import { borderRadius } from "../styles/spacing";
import { withOpacity } from "../utils/colorHelpers";

const Tab = createBottomTabNavigator();

function TabIcon({ icon, focused, accent }) {
  return (
    <View
      style={[
        styles.iconContainer,
        focused && { backgroundColor: accent + "25" },
      ]}
    >
      <Text style={[styles.icon, focused && styles.iconFocused]}>
        {icon}
      </Text>
    </View>
  );
}

export default function MainTabs() {
  const { theme } = useTheme();

  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            position: "absolute",
            bottom: 24,
            left: 16,
            right: 16,
            height: 68,
            borderRadius: borderRadius.xxl,
            paddingTop: 6,
            paddingBottom: 8,
            backgroundColor: withOpacity(theme.card, 0.88),
            borderTopWidth: 0,
            borderWidth: 1,
            borderColor: theme.border,
            shadowColor: theme.shadow,
            ...shadows.nav,
          },
          tabBarShowLabel: true,
          tabBarActiveTintColor: theme.accent,
          tabBarInactiveTintColor: theme.textSecondary,
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: "700",
            letterSpacing: 0.2,
          },
        }}
      >
        <Tab.Screen
          name="Aromas"
          component={AromasTab}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon icon="🌿" focused={focused} accent={theme.accent} />
            ),
            tabBarLabel: "Aromas",
          }}
        />

        <Tab.Screen
          name="Community"
          component={CommunityScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon icon="🌍" focused={focused} accent={theme.accent} />
            ),
            tabBarLabel: "Community",
          }}
        />

        <Tab.Screen
          name="Inspiration"
          component={InspirationScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon icon="✨" focused={focused} accent={theme.accent} />
            ),
            tabBarLabel: "Inspire",
          }}
        />

        <Tab.Screen
          name="MyAromas"
          component={MyAromasTab}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon icon="📝" focused={focused} accent={theme.accent} />
            ),
            tabBarLabel: "My Aromas",
          }}
        />

        <Tab.Screen
          name="Add"
          component={AddTab}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon icon="➕" focused={focused} accent={theme.accent} />
            ),
            tabBarLabel: "Add",
          }}
        />

        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon icon="⚙️" focused={focused} accent={theme.accent} />
            ),
            tabBarLabel: "Settings",
          }}
        />
      </Tab.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },

  icon: {
    fontSize: 18,
    opacity: 0.6,
  },

  iconFocused: {
    opacity: 1,
  },
});
