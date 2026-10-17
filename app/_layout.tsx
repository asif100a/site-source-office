import { Fab, FabIcon } from "@/components/ui/fab";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { MoonIcon, SunIcon } from "@/components/ui/icon";
import "@/global.css";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";
import { useFonts } from "expo-font";
import { Slot, usePathname } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import * as WebBrowser from "expo-web-browser";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "@/store/store";
import PushNotificationRegistrar from "@/components/modules/common/PushNotificationRegistrar";

// OAuth redirects back to the site root. This must run before the root route
// renders so the popup returns the result to the page that opened it.
WebBrowser.maybeCompleteAuthSession();

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    // The app renders its own splash screen, so release the native launch view
    // as soon as the React tree is ready instead of blocking on font loading.
    SplashScreen.hideAsync();
  }, []);
  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const pathname = usePathname();
  const [colorMode, setColorMode] = useState<"light" | "dark" | "system">(
    "dark",
  );

  return (
    // <ThemeProvider value={colorMode === 'dark' ? DarkTheme : DefaultTheme}>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <GluestackUIProvider mode={colorMode}>
            {/* <StatusBar style={colorMode === 'dark' ? 'light' : 'dark'} /> */}
            <StatusBar style={"light"} />
            <Stack
              screenOptions={{
                headerShown: false,
                animation: "slide_from_right",
                animationDuration: 200,
              }}
            >
              <Stack.Screen name="index" />
              <Stack.Screen name="auth" />
            </Stack>
            <PushNotificationRegistrar />
            <Toast />
          </GluestackUIProvider>
          {/*
          {pathname === '/' && (
            <Fab
              onPress={() =>
                setColorMode(colorMode === 'dark' ? 'light' : 'dark')
              }
              className="m-6"
              size="lg"
            >
              <FabIcon as={colorMode === 'dark' ? MoonIcon : SunIcon} />
            </Fab>
          )}
         */}
        </GestureHandlerRootView>
      </PersistGate>
    </Provider>
    // </ThemeProvider>
  );
}
