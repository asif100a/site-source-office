import { useEffect, useRef } from "react";
import { useRouter } from "expo-router";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { useSelector } from "react-redux";
import { useRegisterPushTokenMutation } from "@/store/api/notificationApi";
import type { RootState } from "@/store/store";
import {
  getInstallationId,
  requestPushNotificationToken,
} from "@/services/pushNotifications";

type NotificationData = {
  url?: unknown;
  pathname?: unknown;
  screen?: unknown;
};

const getNotificationRoute = (data: NotificationData) => {
  const route = data.url ?? data.pathname ?? data.screen;
  return typeof route === "string" && route.startsWith("/") ? route : null;
};

export default function PushNotificationRegistrar() {
  const router = useRouter();
  const token = useSelector((state: RootState) => state.auth.token);
  const [registerPushToken] = useRegisterPushTokenMutation();
  const lastRegisteredTokenRef = useRef<string | null>(null);

  useEffect(() => {
    if (!token || Platform.OS === "web") return;

    let cancelled = false;

    const registerToken = async () => {
      const pushToken = await requestPushNotificationToken();
      if (!pushToken || cancelled) return;

      if (lastRegisteredTokenRef.current === pushToken) return;

      const installationId = await getInstallationId();

      await registerPushToken({
        token: pushToken,
        provider: "expo",
        platform: Platform.OS,
        installationId,
      }).unwrap();

      lastRegisteredTokenRef.current = pushToken;
    };

    void registerToken().catch((error) => {
      console.error("Unable to register push notification token:", error);
    });

    return () => {
      cancelled = true;
    };
  }, [registerPushToken, token]);

  useEffect(() => {
    if (Platform.OS === "web") return;

    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification.request.content
          .data as NotificationData;
        const route = getNotificationRoute(data);

        if (route) {
          router.push(route as any);
        }
      },
    );

    return () => {
      subscription.remove();
    };
  }, [router]);

  return null;
}
