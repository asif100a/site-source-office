import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { useRouter } from "expo-router";
import { getDashboardRouteForRole } from "@/constants/Routes";
import { getActiveRole } from "@/constants/authState";

export default function TabsIndexFallback() {
  const router = useRouter();

  useEffect(() => {
    getActiveRole().then((storedRole) => {
      router.replace(getDashboardRouteForRole(storedRole) as any);
    });
  }, [router]);

  return (
    <View className="flex-1 items-center justify-center bg-neutral-50">
      <ActivityIndicator size="large" color="#111827" />
    </View>
  );
}
