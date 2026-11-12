import React from 'react';
import { View, ImageBackground, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import LogoWhite from '@/assets/icons/LogoWhite';
import { Text } from '@/components/ui/text';
import { Svg, Rect, Defs, LinearGradient, Stop } from 'react-native-svg';
import ONBOARDING_1 from '@/assets/images/onboarding/onboarding-1.png';
import { clearUserAuthenticated, setActiveRole } from "@/constants/authState";

const BottomGradient = () => (
  <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '65%', zIndex: 1 }}>
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
    router.push('/tabs/(worker-tabs)' as any);
  };

  const navigateToEmployer = () => {
    clearUserAuthenticated();
    setActiveRole("employer");
    router.push({
      pathname: '/auth',
      params: { role: 'employer', step: 'login' },
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#000000' }}>
      {/* Logo Overlay */}
      <View style={{ position: 'absolute', top: 55, left: 0, right: 0, alignItems: 'center', zIndex: 10 }}>
        <LogoWhite />
      </View>

      <ImageBackground
        source={ONBOARDING_1}
        style={{ flex: 1, width: '100%' }}
        resizeMode="cover"
      >
        {/* Dark bottom gradient overlay */}
        <BottomGradient />

        {/* Role Selection Actions */}
        <View style={{ position: 'absolute', bottom: 50, left: 0, right: 0, paddingHorizontal: 24, zIndex: 5 }}>
          <Text
            style={{
              color: '#FFFFFF',
              fontSize: 30,
              fontWeight: '800',
              lineHeight: 36,
              textAlign: 'center',
              marginBottom: 8,
            }}
          >
            The Smarter Way{'\n'}To Find Work
          </Text>
          <Text
            style={{
              color: '#D4D4D4',
              fontSize: 14,
              textAlign: 'center',
              paddingHorizontal: 16,
              marginBottom: 32,
            }}
          >
            Workers find real jobs at transparent rates.
          </Text>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={navigateToWorker}
            style={{
              minHeight: 56,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 12,
              backgroundColor: '#FFFFFF',
            }}
          >
            <Text style={{ color: '#000000', fontSize: 16, fontWeight: '700' }}>
              Worker
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={navigateToEmployer}
            style={{
              minHeight: 56,
              marginTop: 12,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.4)',
              borderRadius: 12,
              backgroundColor: 'rgba(0,0,0,0.35)',
            }}
          >
            <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '700' }}>
              Employer
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}
