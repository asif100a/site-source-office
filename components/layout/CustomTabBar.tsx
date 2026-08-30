import React from "react";
import { View, StyleSheet, Pressable, Text } from "react-native";
import { BottomTabBarProps } from "expo-router/tabs";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { Colors } from "@/constants/Colors";
import { getWorkerLoginRoute } from "@/constants/authState";
import {
  isProtectedWorkerTabRoute,
  useIsAuthenticated,
} from "@/hooks/useAuthGuard";

type CustomTabBarProps = BottomTabBarProps;

export function CustomTabBar({
  state,
  descriptors,
  navigation,
}: CustomTabBarProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const isAuthenticated = useIsAuthenticated();

  const triggerTabHaptic = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
  };

  const renderTab = (route: (typeof state.routes)[0], index: number) => {
    const { options } = descriptors[route.key];
    const label =
      options.tabBarLabel !== undefined
        ? options.tabBarLabel
        : options.title !== undefined
          ? options.title
          : route.name;

    const isFocused = state.index === index;
    const activeColor = Colors.common.BRAND;
    const inactiveColor = Colors.common.GRAY_NORMAL;
    const iconColor = isFocused ? activeColor : inactiveColor;
    const labelColor = isFocused ? activeColor : inactiveColor;
    const isProtectedWorkerRoute = isProtectedWorkerTabRoute(route.name);

    const onPress = () => {
      void triggerTabHaptic();
      const event = navigation.emit({
        type: "tabPress",
        target: route.key,
        canPreventDefault: true,
      });

      if (event.defaultPrevented) {
        return;
      }

      if (isProtectedWorkerRoute && !isAuthenticated) {
        router.push(
          getWorkerLoginRoute(`/tabs/(worker-tabs)/${route.name}`) as any,
        );
        return;
      }

      if (!isFocused) {
        navigation.navigate(route.name);
      }
    };

    const onLongPress = () => {
      navigation.emit({ type: "tabLongPress", target: route.key });
    };

    return (
      <Pressable
        key={route.key}
        accessibilityRole="button"
        accessibilityState={isFocused ? { selected: true } : {}}
        accessibilityLabel={options.tabBarAccessibilityLabel}
        onPress={onPress}
        onLongPress={onLongPress}
        style={styles.tabButton}
      >
        <View
          style={[
            styles.activeIndicator,
            { backgroundColor: activeColor, opacity: isFocused ? 1 : 0 },
          ]}
        />
        <View style={styles.tabContent}>
          <View style={styles.iconWrapper}>
            {options.tabBarIcon &&
              options.tabBarIcon({
                focused: isFocused,
                color: iconColor,
                size: 22,
              })}
          </View>
          <View style={styles.labelContainer}>
            {typeof label === "string" ? (
              <Text style={[styles.label, { color: labelColor }]}>{label}</Text>
            ) : typeof label === "function" ? (
              label({
                focused: isFocused,
                color: labelColor,
                position: "below-icon",
                children: route.name,
              })
            ) : (
              <Text style={[styles.label, { color: labelColor }]}>
                {route.name}
              </Text>
            )}
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <View
      style={[
        styles.tabBarContainer,
        { paddingBottom: insets.bottom > 0 ? insets.bottom : 8 },
      ]}
    >
      {state.routes?.map((route: (typeof state.routes)[0], index: number) =>
        renderTab(route, index),
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#F3F4F6",
    paddingTop: 0,
    elevation: 12,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: -3 },
    shadowRadius: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    paddingBottom: 4,
    paddingTop: 0,
  },
  activeIndicator: {
    width: '100%',
    height: 3,
    borderRadius: 999,
    marginBottom: 8,
  },
  tabContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapper: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  labelContainer: {
    marginTop: 2,
  },
  label: {
    fontSize: 11,
    fontWeight: "600",
  },
  middleButtonWrapper: {
    flex: 1,
    alignItems: "center",
    marginTop: -28,
  },
  middleButton: {
    width: 72,
    height: 72,
    borderRadius: 50,
    backgroundColor: Colors.common.BRAND,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 6,
    borderColor: "#fff",
    marginTop: -18,
  },
});
