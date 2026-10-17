import React, { useState, useEffect, useRef, useCallback } from "react";
import { Animated } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import SplashScreenComponent from "./screens/SplashScreen";
import OnboardingScreenComponent from "./screens/OnboardingScreen";
import { getDashboardRouteForRole } from "@/constants/Routes";
import { getActiveRole } from "@/constants/authState";
import { useAuthGuardState } from "@/hooks/useAuthGuard";

export default function Home() {
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const { isAuthenticated, isCheckingAuth } = useAuthGuardState();

  useEffect(() => {
    // Show splash for 2.5s, then fade out and render the onboarding screens
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 650,
        useNativeDriver: true,
      }).start(() => {
        setShowSplash(false);
      });
    }, 2500);

    return () => clearTimeout(timer);
  }, [fadeAnim]);

  // A token can be issued during registration while this screen remains
  // mounted behind /auth. Only redirect when the startup screen is focused.
  useFocusEffect(useCallback(() => {
    if (showSplash || isCheckingAuth || !isAuthenticated) {
      return;
    }

    let isMounted = true;

    setIsRedirecting(true);

    getActiveRole()
      .then((activeRole) => {
        if (isMounted) {
          router.replace(getDashboardRouteForRole(activeRole));
        }
      })
      .catch(() => {
        if (isMounted) {
          setIsRedirecting(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, isCheckingAuth, router, showSplash]));

  if (showSplash) {
    return (
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <SplashScreenComponent />
      </Animated.View>
    );
  }

  if (isCheckingAuth || isRedirecting) {
    return null;
  }

  return <OnboardingScreenComponent />;
}
