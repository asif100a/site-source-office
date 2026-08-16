import React from 'react';
import { View, ImageBackground, Dimensions, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import LogoWhite from '@/assets/icons/LogoWhite';
import { Text } from '@/components/ui/text';
import { Box } from '@/components/ui/box';
import { Svg, Rect, Defs, LinearGradient, Stop } from 'react-native-svg';
import ONBOARDING_1 from '@/assets/images/onboarding/onboarding-1.png';
import { clearUserAuthenticated, setActiveRole } from "@/constants/authState";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const BottomGradient = () => (
  <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: SCREEN_HEIGHT * 0.65, zIndex: 1 }}>
    <Svg height="100%" width="100%">
      <Defs>
        <LinearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#000000" stopOpacity="0" />
          <Stop offset="45%" stopColor="#000000" stopOpacity="0.75" />
          <Stop offset="100%" stopColor="#000000" stopOpacity="0.95" />
        </LinearGradient>
      </Defs>
      <Rect width="100%" height="100%" fill="url(#grad)" />
    </Svg>
  </View>
);

export default function OnboardingScreen() {
  const router = useRouter();

  const navigateToWorker = () => {
    clearUserAuthenticated();
    setActiveRole("worker");
    router.replace('/tabs/(worker-tabs)' as any);
  };

  const navigateToEmployer = () => {
    clearUserAuthenticated();
    setActiveRole("employer");
    router.replace({
      pathname: '/auth',
      params: { role: 'employer', step: 'login' },
    });
  };

  return (
    <Box className="flex-1 bg-black">
      {/* Logo Overlay */}
      <View style={{ position: 'absolute', top: 55, left: 0, right: 0, alignItems: 'center', zIndex: 10 }}>
        <LogoWhite />
      </View>

      <ImageBackground
        source={ONBOARDING_1}
        style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}
        resizeMode="cover"
      >
        {/* Dark bottom gradient overlay */}
        <BottomGradient />

        {/* Role Selection Actions */}
        <View style={{ position: 'absolute', bottom: 50, left: 0, right: 0, paddingHorizontal: 24, zIndex: 5 }}>
          <Text className="text-white text-3xl font-extrabold text-center mb-2 leading-tight">
            The Smarter Way{'\n'}To Find Work
          </Text>
          <Text className="text-neutral-300 text-sm text-center px-4 mb-8">
            Workers find real jobs at transparent rates.
          </Text>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={navigateToWorker}
            className="bg-white rounded-xl py-4 items-center justify-center shadow-md"
          >
            <Text className="text-black font-bold text-base">Worker</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={navigateToEmployer}
            className="border border-white/40 bg-black/35 rounded-xl py-4 items-center justify-center mt-3"
          >
            <Text className="text-white font-bold text-base">Employer</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </Box>
  );
}
