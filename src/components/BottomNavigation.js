import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const tabs = [
  { key: "aromas", icon: "🌿", label: "Aromas" },
  { key: "myaromas", icon: "📝", label: "My Aromas" },
  { key: "add", icon: "➕", label: "Add" },
  { key: "settings", icon: "⚙️", label: "Settings" },
];

function TabItem({ tab, active, onTabChange, theme, animationsEnabled }) {
  const scale = useRef(new Animated.Value(1)).current;
  const dotScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const dur = animationsEnabled ? 300 : 0;
    Animated.parallel([
      Animated.spring(scale, {
        toValue: active ? 1.1 : 1,
        friction: 6,
        tension: 100,
        useNativeDriver: true,
      }),
      Animated.timing(dotScale, {
        toValue: active ? 1 : 0,
        duration: dur,
        useNativeDriver: true,
      }),
    ]).start();
  }, [active, animationsEnabled]);

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => onTabChange(tab.key)}
      style={styles.tab}
    >
      <Animated.View
        style={[
          styles.iconContainer,
          active && { backgroundColor: theme.accentLight },
          { transform: [{ scale }] },
        ]}
      >
        <Text style={[styles.icon, active && styles.iconActive]}>
          {tab.icon}
        </Text>
      </Animated.View>
      <Text
        style={[
          styles.label,
          {
            color: active ? theme.accent : theme.textSecondary,
            fontWeight: active ? "700" : "500",
            fontSize: 10 * theme.fontScale,
          },
        ]}
      >
        {tab.label}
      </Text>
      {active && (
        <Animated.View
          style={[
            styles.activeDot,
            { backgroundColor: theme.accent, transform: [{ scale: dotScale }] },
          ]}
        />
      )}
    </TouchableOpacity>
  );
}

export default function BottomNavigation({ activeTab, onTabChange, theme, enableAnimations }) {
  return (
    <View style={styles.wrapper}>
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.card + "E0",
            borderColor: theme.border,
          },
        ]}
      >
        {tabs.map((tab) => (
          <TabItem
            key={tab.key}
            tab={tab}
            active={activeTab === tab.key}
            onTabChange={onTabChange}
            theme={theme}
            animationsEnabled={enableAnimations}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingBottom: 24,
    paddingHorizontal: 16,
    pointerEvents: "box-none",
  },

  container: {
    flexDirection: "row",
    borderRadius: 28,
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 4,

    shadowColor: "#7B5EA7",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,

    width: "100%",
    maxWidth: 480,
  },

  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 4,
  },

  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 2,
  },

  icon: {
    fontSize: 18,
    opacity: 0.6,
  },

  iconActive: {
    opacity: 1,
  },

  label: {
    fontSize: 10,
    letterSpacing: 0.2,
    includeFontPadding: false,
  },

  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 2,
  },
});
