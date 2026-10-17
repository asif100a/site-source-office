import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

const INSTALLATION_ID_KEY = "site-source.installation-id";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const getProjectId = () =>
  Constants.expoConfig?.extra?.eas?.projectId ??
  Constants.easConfig?.projectId ??
  Constants.expoConfig?.extra?.projectId ??
  process.env.EXPO_PUBLIC_EAS_PROJECT_ID;

const createInstallationId = () =>
  `installation-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;

export const getInstallationId = async () => {
  const existingId = await AsyncStorage.getItem(INSTALLATION_ID_KEY);

  if (existingId) return existingId;

  const nextId = createInstallationId();
  await AsyncStorage.setItem(INSTALLATION_ID_KEY, nextId);
  return nextId;
};

export const configureAndroidNotificationChannel = async () => {
  if (Platform.OS !== "android") return;

  await Notifications.setNotificationChannelAsync("default", {
    name: "Default",
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: "#FF5500",
  });
};

export const requestPushNotificationToken = async () => {
  if (Platform.OS === "web") return null;
  if (!Device.isDevice) return null;

  await configureAndroidNotificationChannel();

  const permissions = await Notifications.getPermissionsAsync();
  let finalStatus = permissions.status;

  if (finalStatus !== "granted") {
    const requestedPermissions = await Notifications.requestPermissionsAsync();
    finalStatus = requestedPermissions.status;
  }

  if (finalStatus !== "granted") return null;

  const projectId = getProjectId();
  const tokenResponse = projectId
    ? await Notifications.getExpoPushTokenAsync({ projectId })
    : await Notifications.getExpoPushTokenAsync();

  return tokenResponse.data;
};

// Authentication must remain usable when push notifications are not
// configured for the current build (for example, a local Android build
// without google-services.json).
export const getOptionalPushNotificationToken = async () => {
  try {
    return await requestPushNotificationToken();
  } catch (error) {
    console.warn("Push token unavailable; continuing without FCM token.", error);
    return null;
  }
};
