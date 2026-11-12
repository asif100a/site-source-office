import React from 'react';
import { View } from 'react-native';
import Logo from '@/assets/icons/Logo';

export default function SplashScreen() {
  // const logoFade = useRef(new Animated.Value(0)).current;
  // const logoScale = useRef(new Animated.Value(0.95)).current;

  // useEffect(() => {
  //   Animated.parallel([
  //     Animated.timing(logoFade, {
  //       toValue: 1,
  //       duration: 1000,
  //       useNativeDriver: true,
  //     }),
  //     Animated.spring(logoScale, {
  //       toValue: 1,
  //       friction: 8,
  //       tension: 40,
  //       useNativeDriver: true,
  //     })
  //   ]).start();
  // }, []);

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
      }}
    >
      <Logo />
    </View>
  );
}
