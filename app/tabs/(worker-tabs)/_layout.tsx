import { Redirect, Tabs, usePathname, useSegments } from "expo-router";
import { CustomTabBar } from "@/components/layout/CustomTabBar";
import TabIcons from "@/assets/icons/TabIcons";
import { getWorkerLoginRoute } from "@/constants/authState";
import {
  isProtectedWorkerTabRoute,
  useAuthGuardState,
} from "@/hooks/useAuthGuard";

export default function WorkerTabsLayout() {
  const pathname = usePathname();
  const segments = useSegments();
  const { isAuthenticated, isCheckingAuth } = useAuthGuardState();
  const currentRoute = segments[segments.length - 1];

  if (isCheckingAuth) {
    return null;
  }

  if (isProtectedWorkerTabRoute(currentRoute) && !isAuthenticated) {
    return <Redirect href={getWorkerLoginRoute(pathname) as any} />;
  }

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <TabIcons.HomeIcon color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="jobs"
        options={{
          title: "Search",
          tabBarIcon: ({ color, size }) => <TabIcons.SearchIcon color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="my-jobs"
        options={{
          title: "My Jobs",
          tabBarIcon: ({ color, size }) => <TabIcons.BagIcon color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="chats"
        options={{
          title: "Chats",
          tabBarIcon: ({ color, size }) => <TabIcons.ChatIcon color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => <TabIcons.ProfileIcon color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
