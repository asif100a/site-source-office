import { Redirect, Slot, usePathname, useSegments } from "expo-router";
import { ScrollView } from "react-native";
import WorkerWebFooter from "@/components/layout/WorkerWebFooter";
import WorkerWebNavbar from "@/components/layout/WorkerWebNavbar";
import { getWorkerLoginRoute } from "@/constants/authState";
import {
  isProtectedWorkerTabRoute,
  useAuthGuardState,
} from "@/hooks/useAuthGuard";

export default function WorkerTabsWebLayout() {
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
    <ScrollView className="flex-1 bg-neutral-50">
      <WorkerWebNavbar />
      <Slot />
      <WorkerWebFooter />
    </ScrollView>
  );
}
